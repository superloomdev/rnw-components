// Info: Hard-coded geometry/token lint tests (Plan 0156, Part B).
//
// Scans component source files for hardcoded numeric geometry values that
// should come from the spec sheet. The spec sheet is the single source of
// truth for heights, paddings, icon sizes, and target sizes. A hardcoded
// literal in a component is a defect: it bypasses the spec sheet and the
// oracle, so the value can drift from Carbon without detection.
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
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the spec sheet to know which values are specced
const spec = (await import('../data/component-spec.js')).default;

// Collect all specced numeric values (the values that MUST NOT appear as
// literals in component implementation files)
const speccedValues = new Set();
for (const entry of Object.values(spec)) {
  if (typeof entry.height === 'number' && entry.height > 2) speccedValues.add(entry.height);
  if (typeof entry.paddingInline === 'number' && entry.paddingInline > 2) speccedValues.add(entry.paddingInline);
  if (typeof entry.iconSize === 'number') speccedValues.add(entry.iconSize);
  if (typeof entry.stepperIconSize === 'number') speccedValues.add(entry.stepperIconSize);
  if (typeof entry.dismissTargetSize === 'number' && entry.dismissTargetSize > 2) speccedValues.add(entry.dismissTargetSize);
  if (typeof entry.removeTargetSize === 'number' && entry.removeTargetSize > 2) speccedValues.add(entry.removeTargetSize);
  if (typeof entry.targetSize === 'number' && entry.targetSize > 2) speccedValues.add(entry.targetSize);
  if (typeof entry.itemHeight === 'number' && entry.itemHeight > 2) speccedValues.add(entry.itemHeight);
}
// Also check nested icon sizes
for (const size of Object.values(spec.icon.sizes)) {
  speccedValues.add(size);
}

// --- Scan component files for hardcoded geometry ---------------------------

describe('geometry lint - no hardcoded spec values in components', () => {

  function scanComponentDir (dir) {
    const violations = [];

    function scan (d) {
      const entries = readdirSync(d);
      for (const entry of entries) {
        const fullPath = join(d, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          scan(fullPath);
        } else if (entry.endsWith('.js')) {
          const content = readFileSync(fullPath, 'utf8');
          // Strip comments
          const stripped = content
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/.*$/gm, '');

          // Look for numeric literals that match specced values
          // Match patterns like: height: 40, minHeight: 40, width: 20, etc.
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
    return violations;
  }

  it('component files should not hardcode spec sheet geometry values', () => {
    const componentDir = join(__dirname, '..', 'component');
    const violations = scanComponentDir(componentDir);

    // Filter out known acceptable uses (e.g., in style objects that
    // reference the spec sheet via Parts.Spec)
    const realViolations = violations.filter(v => {
      // Allow if the file imports or uses Parts.Spec
      const content = readFileSync(join(__dirname, '..', v.file), 'utf8');
      if (content.includes('Parts.Spec') || content.includes('Spec(')) {
        return false; // File uses spec sheet, acceptable
      }
      return true;
    });

    // Baseline violations ratchet: these known violations will shrink as
    // Part C/D fixes the components. New violations are never allowed.
    // Format: "file: value" entries
    const BASELINE_VIOLATIONS = [
      'component/atom/badgeIndicator.js: 20',
      'component/atom/checkbox.js: 20',
      'component/atom/iconIndicator.js: 24',
      'component/atom/radioButton.js: 20',
      'component/atom/shapeIndicator.js: 16',
      'component/composite/datePicker.js: 32',
      'component/molecule/aISkeletonIcon.js: 24',
      'component/molecule/aISkeletonText.js: 16',
      'component/molecule/menuItemSelectable.js: 16',
      'component/molecule/paginationNav.js: 32',
      'component/molecule/progressStep.js: 24',
      'component/molecule/skeletonIcon.js: 24',
      'component/molecule/skeletonText.js: 16',
      'component/molecule/structuredListInput.js: 20',
      'component/molecule/userAvatar.js: 40'
    ];

    const currentViolationKeys = realViolations.map(v => `${v.file}: ${v.value}`);
    const baselineSet = new Set(BASELINE_VIOLATIONS);

    // New violations (not in baseline) are always failures
    const newViolations = currentViolationKeys.filter(k => !baselineSet.has(k));

    if (newViolations.length > 0) {
      assert.fail(
        `Found ${newViolations.length} NEW hardcoded geometry values (not in baseline):\n` +
        newViolations.join('\n') + '\n' +
        'These values should come from Parts.Spec() instead of being hardcoded.'
      );
    }

    // Report baseline shrinkage (informational, not a failure)
    const fixedCount = BASELINE_VIOLATIONS.filter(k => !currentViolationKeys.includes(k)).length;
    if (fixedCount > 0) {
      // Baseline has shrunk - good! Update the baseline.
      // This is not a failure; it's progress.
    }
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

          // Find the useOverlay call position
          const overlayIdx = content.indexOf('useOverlay');
          if (overlayIdx === -1) continue;

          // Check for early returns BEFORE the useOverlay call
          const beforeOverlay = content.substring(0, overlayIdx);
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
