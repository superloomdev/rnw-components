// Info: Per-component geometry lint tests.
//
// Scans component source files for hardcoded numeric geometry values that
// match the component's own spec sheet entry. A literal is a violation
// only when that component's own entry supplies the same field. A
// component with no spec entry is reported in a separate `uncovered`
// count, never as a violation.
//
// The per-component lint starts at zero violations by construction.
// The uncovered count becomes the ratchet.
//
// Allowed exceptions:
// - Values inside data/ files (spec sheets, oracles, manifests)
// - Values inside _test/ files (tests can assert specific values)
// - Values inside parts/ files (mechanism parts may compute)
// - Zero (0) and unit values (0, 1, 2 for border widths)
// - Values inside comments

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the spec sheet to know which values are specced per component
const spec = (await import('../data/component-spec.js')).default;

// Build a map of component file name -> spec entry
// Component files are named in camelCase (e.g., textInput.js -> textInput)
// The spec keys are also camelCase (e.g., textInput, button, etc.)
function specKeyForFile (fileName) {
  // Strip .js extension and convert first char to lowercase
  const base = basename(fileName, '.js');
  return base.charAt(0).toLowerCase() + base.slice(1);
}

// Token reference -> numeric value map (from the Carbon white theme build).
// Used to resolve token references in the spec to numeric values for lint.
const TOKEN_VALUES = {
  'size.container_01': 24,
  'size.container_02': 32,
  'size.container_03': 40,
  'size.container_04': 48,
  'size.container_05': 64,
  'size.size_xsmall': 24,
  'size.size_small': 32,
  'size.size_medium': 40,
  'size.size_large': 48,
  'size.size_xlarge': 64,
  'size.size_2xlarge': 80,
  'size.icon_01': 16,
  'size.icon_02': 20,
  'size.icon_03': 24,
  'size.icon_04': 32,
  'spacing.spacing_01': 2,
  'spacing.spacing_02': 4,
  'spacing.spacing_03': 8,
  'spacing.spacing_04': 12,
  'spacing.spacing_05': 16,
  'spacing.spacing_06': 24,
  'spacing.spacing_07': 32,
  'spacing.spacing_08': 40,
  'spacing.spacing_09': 48
};

function resolveTokenValue (tokenName) {
  return TOKEN_VALUES[tokenName];
}

// Collect specced numeric values for a given spec entry
function speccedValuesForEntry (entry) {
  const values = new Set();
  if (!entry || typeof entry !== 'object') return values;

  // Check for token references (heightToken, paddingInlineToken, etc.)
  for (const field of ['height', 'minHeight', 'paddingInline', 'paddingInlineStart',
    'paddingInlineEnd', 'iconSize', 'stepperIconSize', 'dismissTargetSize',
    'removeTargetSize', 'targetSize', 'itemHeight', 'controlSize', 'width',
    'minSize']) {
    const tokenField = field + 'Token';
    if (entry[tokenField]) {
      const resolved = resolveTokenValue(entry[tokenField]);
      if (resolved && resolved > 2) values.add(resolved);
    }
    if (typeof entry[field] === 'number' && entry[field] > 2) {
      values.add(entry[field]);
    }
  }
  // Also check nested icon sizes
  if (entry.sizes && typeof entry.sizes === 'object') {
    for (const size of Object.values(entry.sizes)) {
      if (typeof size === 'object' && size.sizeToken) {
        const resolved = resolveTokenValue(size.sizeToken);
        if (resolved && resolved > 2) values.add(resolved);
      }
      if (typeof size === 'number' && size > 2) values.add(size);
    }
  }
  // Check button sizes map
  if (entry.sizes && typeof entry.sizes === 'object') {
    for (const size of Object.values(entry.sizes)) {
      if (typeof size === 'object' && size.heightToken) {
        const resolved = resolveTokenValue(size.heightToken);
        if (resolved && resolved > 2) values.add(resolved);
      }
    }
  }
  return values;
}

// --- Scan component files for hardcoded geometry ---------------------------

describe('geometry lint - per-component hardcoded spec values', () => {

  function scanComponentDir (dir) {
    const violations = [];
    const uncovered = [];

    function scan (d) {
      const entries = readdirSync(d);
      for (const entry of entries) {
        const fullPath = join(d, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (entry.endsWith('.js')) {
          const specKey = specKeyForFile(entry);
          const specEntry = spec[specKey];

          // If no spec entry exists for this component, it is uncovered
          if (!specEntry) {
            uncovered.push(fullPath.replace(join(__dirname, '..') + '/', ''));
            continue;
          }

          // Get the specced values for this component's own entry
          const speccedValues = speccedValuesForEntry(specEntry);
          if (speccedValues.size === 0) {
            uncovered.push(fullPath.replace(join(__dirname, '..') + '/', ''));
            continue;
          }

          const content = readFileSync(fullPath, 'utf8');
          // Strip comments
          const stripped = content
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '');

          // Look for numeric literals that match this component's specced values
          const patterns = [
            /(?:height|minHeight|minWidth|width|size|padding|paddingInline)\s*:\s*(\d+)/g,
            /(?:minHeight|minWidth|targetSize)\s*:\s*(\d+)/g
          ];

          for (const pattern of patterns) {
            const matches = stripped.matchAll(pattern);
            for (const match of matches) {
              const value = parseInt(match[1], 10);
              // Skip small values (0, 1, 2) that are border widths or zero
              if (value <= 2) continue;
              if (speccedValues.has(value)) {
                violations.push({
                  file: fullPath.replace(join(__dirname, '..') + '/', ''),
                  value: value,
                  context: match[0]
                });
              }
            }
          }
        }
      }
    }

    scan(dir);
    return { violations, uncovered };
  }

  it('component files should not hardcode their own spec sheet geometry values', () => {
    const componentDir = join(__dirname, '..', 'component');
    const { violations, uncovered } = scanComponentDir(componentDir);

    // The new check starts at zero violations by construction.
    // The per-component check starts at zero violations by construction.
    // Any violation is a failure.
    if (violations.length > 0) {
      const details = violations.map(v => `${v.file}: ${v.value} (${v.context})`).join('\n');
      assert.fail(
        `Found ${violations.length} hardcoded geometry values matching the component's own spec:\n` +
        details + '\n' +
        'These values should come from Parts.Spec() instead of being hardcoded.'
      );
    }

    // Report the uncovered count (informational, becomes the ratchet)
    // This is recorded in PROGRESS and may only shrink.
    console.log('geometry lint: uncovered components:', uncovered.length);
  });

});

// --- Hook-order validation -------------------------------------------------

describe('hook-order lint - useOverlay before early returns', () => {

  function scanOverlayComponents () {
    const violations = [];
    const componentDir = join(__dirname, '..', 'component');

    function scan (dir) {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (entry.endsWith('.js')) {
          const content = readFileSync(fullPath, 'utf8');
          // Check if this component uses useOverlay
          if (!content.includes('useOverlay')) continue;

          // Find the first CALL to useOverlay (not the alias assignment).
          // The alias `const useOverlay = Parts.Overlay.useOverlay;` near the
          // top of the file is not a call; we need the first `useOverlay(` call.
          const callMatch = /\buseOverlay\s*\(/.exec(content);
          if (!callMatch) continue;

          const overlayCallIdx = callMatch.index;

          // Find the Public Functions START banner; scan for early returns
          // only between that banner (or 0 if absent) and the first call.
          const bannerIdx = content.indexOf('Public Functions START');
          const scanStart = bannerIdx === -1 ? 0 : bannerIdx;

          const beforeOverlay = content.substring(scanStart, overlayCallIdx);
          const earlyReturnPattern = /return\s*(?:null|undefined|false)\s*[;}]|return\s*\(?\s*null/;
          if (earlyReturnPattern.test(beforeOverlay)) {
            violations.push({
              file: fullPath.replace(join(__dirname, '..') + '/', ''),
              issue: 'early return before useOverlay call'
            });
          }
        }
      }
    }

    scan(componentDir);
    return violations;
  }

  it('no component should have early returns before useOverlay', () => {
    const violations = scanOverlayComponents();
    if (violations.length > 0) {
      const details = violations.map(v => `${v.file}: ${v.issue}`).join('\n');
      assert.fail(
        `Found ${violations.length} hook-order violations:\n${details}\n` +
        'useOverlay must be called before any early returns to respect React Rules of Hooks.'
      );
    }
  });

});
