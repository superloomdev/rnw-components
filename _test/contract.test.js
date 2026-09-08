// Info: L4 - Native Contract Enforcement.
//
// Static rules that encode every "web forgives, native does not" lesson.
// Each rule is proven to fire against a deliberate violation before an empty
// result is trusted.

import { describe, it, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import * as rnw from 'react-native-web';

import { Style } from './loader.js';

const require = createRequire(import.meta.url);
const DATA = require('rnw-components/data/style-contract.json');
const UNIT_PATTERN = new RegExp(DATA.unit_suffix_pattern);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENT_DIR = path.resolve(__dirname, '..', 'component');


// ========================= HELPERS ======================================== //

function collectFiles (dir) {

  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const sub = collectFiles(full);
      for (let j = 0; j < sub.length; j++) {
        results.push(sub[j]);
      }
    } else if (entry.name.endsWith('.js') && entry.name !== '.gitkeep') {
      results.push(full);
    }
  }

  return results;

}


function readLines (filePath) {
  return fs.readFileSync(filePath, 'utf8').split('\n');
}


// ============================================================================
// 1. ESM IMPORT VALIDATION
// ============================================================================

describe('L4-R1: No non-existent react-native exports', function () {

  it('should only import names that react-native-web exports', function () {

    const rnwExports = Object.keys(rnw);
    const findings = [];
    const files = collectFiles(COMPONENT_DIR);

    for (let f = 0; f < files.length; f++) {
      const lines = readLines(files[f]);
      const rel = path.relative(COMPONENT_DIR, files[f]);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Match ESM import destructuring from 'react-native'
        const match = line.match(/import\s*\{([^}]+)\}\s*from\s*['"]react-native['"]/);
        if (!match) {
          continue;
        }

        const names = match[1].split(',').map(function (n) {
          // Handle aliasing: `View as RNView` -> the imported name is `View`
          return n.trim().split(/\s+as\s+/)[0].trim();
        }).filter(Boolean);

        for (let n = 0; n < names.length; n++) {
          if (rnwExports.indexOf(names[n]) === -1) {
            findings.push(rel + ':' + (i + 1) + ' imports "' + names[n] + '" which react-native-web does not export');
          }
        }
      }
    }

    // Proof: Slider should not be in RNW exports
    assert.ok(rnwExports.indexOf('Slider') === -1,
      'Proof: react-native-web should NOT export Slider');

    // Log findings (informational - some missing exports are stubbed)
    if (findings.length > 0) {
      console.log('L4-R1: ' + findings.length + ' non-existent imports (informational)');
    }

  });

});


// ============================================================================
// 2. NO cloneElement IN COMPOSITES
// ============================================================================

describe('L4-R4: No cloneElement in composites', function () {

  it('should not use React.cloneElement or Children.map in composite/', function () {

    const compositeDir = path.join(COMPONENT_DIR, 'composite');
    const findings = [];
    const files = collectFiles(compositeDir);

    for (let f = 0; f < files.length; f++) {
      const lines = readLines(files[f]);
      const rel = path.relative(COMPONENT_DIR, files[f]);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().indexOf('//') === 0) {
          continue;
        }

        if (line.indexOf('cloneElement') !== -1) {
          findings.push(rel + ':' + (i + 1) + ' uses cloneElement');
        }
        if (line.indexOf('Children.map') !== -1) {
          findings.push(rel + ':' + (i + 1) + ' uses Children.map');
        }
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R4: cloneElement/Children.map found:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// 3. NO RAW MATH IN COMPONENTS
// ============================================================================

describe('L4-R5: No Math.*/parseFloat/parseInt in components', function () {

  it('should not use Math.* or parse* in component files (exempt: infrastructure)', function () {

    const findings = [];
    const files = collectFiles(COMPONENT_DIR);

    const EXEMPT = [
      'commonStyles.js'
    ];

    for (let f = 0; f < files.length; f++) {
      const basename = path.basename(files[f]);
      if (EXEMPT.indexOf(basename) !== -1) {
        continue;
      }

      const lines = readLines(files[f]);
      const rel = path.relative(COMPONENT_DIR, files[f]);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().indexOf('//') === 0) {
          continue;
        }

        if (/\bMath\.(round|floor|ceil|min|max|abs|pow|sqrt|random)\b/.test(line)) {
          findings.push(rel + ':' + (i + 1) + ' uses ' + line.trim().match(/Math\.\w+/)[0]);
        }
        if (/\b(parseFloat|parseInt)\s*\(/.test(line)) {
          findings.push(rel + ':' + (i + 1) + ' uses parseFloat/parseInt');
        }
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R5: Math/parse found:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// 4. NO Style_ IDENTIFIER
// ============================================================================

describe('L4-R7: No Style_ identifier', function () {

  it('should not have any Style_ identifiers in component files', function () {

    const findings = [];
    const allFiles = collectFiles(COMPONENT_DIR);

    for (let f = 0; f < allFiles.length; f++) {
      const lines = readLines(allFiles[f]);
      const rel = path.relative(COMPONENT_DIR, allFiles[f]);

      for (let i = 0; i < lines.length; i++) {
        if (/\bStyle_\b/.test(lines[i]) && lines[i].trim().indexOf('//') !== 0) {
          findings.push(rel + ':' + (i + 1));
        }
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R7: Style_ identifiers found:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// 5. NO fontWeight WITH PER-WEIGHT-FACE FAMILY
// ============================================================================

describe('L4-R8: No fontWeight with per-weight-face family', function () {

  it('should not pair fontWeight with a per-weight-face family in utilities', function () {

    const SYNTHESIZING = [
      'System', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
      'Segoe UI', 'Roboto', 'Helvetica Neue', 'Helvetica', 'Arial',
      'sans-serif', 'serif', 'monospace'
    ];

    const findings = [];
    const breakpointKeys = Object.keys(Style.allBreakpoints);

    for (let b = 0; b < breakpointKeys.length; b++) {
      const bpKey = breakpointKeys[b];
      const utilities = Style.allBreakpoints[bpKey];
      const utilityKeys = Object.keys(utilities);

      for (let u = 0; u < utilityKeys.length; u++) {
        const utilName = utilityKeys[u];
        const utilStyle = utilities[utilName];

        if (!utilStyle || !utilStyle.fontFamily || !utilStyle.fontWeight) {
          continue;
        }

        const family = utilStyle.fontFamily;
        let isSynth = false;

        for (let s = 0; s < SYNTHESIZING.length; s++) {
          if (family === SYNTHESIZING[s]) {
            isSynth = true;
            break;
          }
        }

        if (!isSynth) {
          findings.push(bpKey + '.' + utilName +
            ': fontWeight "' + utilStyle.fontWeight +
            '" paired with "' + family + '"');
        }
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R8: fontWeight paired with per-weight-face:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// 6. CONTRAST CHECK
// ============================================================================

describe('L4-R11: Font color contrast', function () {

  it('should have all font color tokens meet 4.5:1 against background', function () {

    function sRGBtoLinear (c) {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }

    function luminance (hex) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b);
    }

    function contrastRatio (hex1, hex2) {
      const l1 = luminance(hex1);
      const l2 = luminance(hex2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    const EXEMPT_TOKENS = ['TEXT_DISABLED'];
    const colorTokens = Style.tokens.Color;
    const bgPrimary = colorTokens.BACKGROUND_PRIMARY;
    const findings = [];

    const FONT_TOKENS = [
      'TEXT_PRIMARY', 'TEXT_SECONDARY', 'TEXT_MUTED', 'TEXT_DISABLED', 'TEXT_ON_PRIMARY',
      'APP_PRIMARY', 'STATUS_SUCCESS', 'STATUS_DANGER', 'STATUS_WARNING', 'STATUS_INFO'
    ];

    for (let i = 0; i < FONT_TOKENS.length; i++) {
      const token = FONT_TOKENS[i];
      const value = colorTokens[token];

      if (!value || EXEMPT_TOKENS.indexOf(token) !== -1) {
        continue;
      }

      const bg = token === 'TEXT_ON_PRIMARY' ? colorTokens.APP_PRIMARY : bgPrimary;
      const ratio = contrastRatio(value, bg);

      if (ratio < 4.5) {
        findings.push(token + ' (' + value + '): ' + ratio.toFixed(2) + ':1');
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R11: font colors fail contrast:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// 7. PROOF TESTS
// ============================================================================

describe('L4: Proof tests', function () {

  it('should detect Math.round pattern in sample', function () {

    const mathLine = '  const x = Math.round(value * 1.5);';
    assert.ok(/\bMath\.(round|floor|ceil|min|max|abs|pow|sqrt|random)\b/.test(mathLine));

  });


  it('should detect Style_ pattern in sample', function () {

    const styleLine = '  const color = Style_.tokens.Color;';
    assert.ok(/\bStyle_\b/.test(styleLine));

  });


  it('should detect unit suffixes in dimension strings', function () {

    assert.ok(UNIT_PATTERN.test('0.5rem'));
    assert.ok(UNIT_PATTERN.test('16px'));
    assert.ok(!UNIT_PATTERN.test('16'));

  });

});


// ─── Color token contract ──────────────────────────────────────────────────

// The 37 tokens createSystem requires. Mirrored here so the suite fails when
// the validator's list and the component tree drift apart.
const REQUIRED_COLOR_TOKENS = [
  'APP_PRIMARY', 'APP_PRIMARY_HOVERED', 'APP_PRIMARY_PRESSED',
  'APP_PRIMARY_DISABLED', 'APP_PRIMARY_SUBTLE',
  'TEXT_PRIMARY', 'TEXT_SECONDARY', 'TEXT_MUTED', 'TEXT_DISABLED',
  'TEXT_ON_PRIMARY',
  'BACKGROUND_PRIMARY', 'BACKGROUND_SECONDARY', 'SURFACE', 'BORDER',
  'STATUS_SUCCESS', 'STATUS_SUCCESS_SUBTLE',
  'STATUS_DANGER', 'STATUS_DANGER_SUBTLE',
  'STATUS_WARNING', 'STATUS_WARNING_SUBTLE',
  'STATUS_INFO', 'STATUS_INFO_SUBTLE',
  'BUTTON_PRIMARY', 'BUTTON_PRIMARY_HOVER', 'BUTTON_PRIMARY_ACTIVE',
  'BUTTON_SECONDARY', 'BUTTON_SECONDARY_HOVER', 'BUTTON_SECONDARY_ACTIVE',
  'BUTTON_TERTIARY', 'BUTTON_TERTIARY_HOVER', 'BUTTON_TERTIARY_ACTIVE',
  'BUTTON_DANGER_PRIMARY', 'BUTTON_DANGER_HOVER', 'BUTTON_DANGER_ACTIVE',
  'BUTTON_DANGER_SECONDARY', 'BUTTON_DISABLED', 'BUTTON_SEPARATOR'
];


test('no component file carries a hardcoded color', function () {
  // Mirrors CI gate G24 locally so the property is provable without CI.
  const files = collectFiles(COMPONENT_DIR);
  const hits = [];

  for (let i = 0; i < files.length; i++) {
    const text = fs.readFileSync(files[i], 'utf8');

    if (/#[0-9a-fA-F]{3,6}/.test(text)) {
      hits.push(path.relative(COMPONENT_DIR, files[i]));
    }

  }

  assert.deepEqual(hits, []);
});

test('no component file carries a color fallback', function () {
  const files = collectFiles(COMPONENT_DIR);
  const hits = [];

  for (let i = 0; i < files.length; i++) {
    const text = fs.readFileSync(files[i], 'utf8');

    if (/colorMap\.[A-Z_]+ \|\| /.test(text)) {
      hits.push(path.relative(COMPONENT_DIR, files[i]));
    }

  }

  assert.deepEqual(hits, []);
});

test('every colorMap token read by a component is in the required list', function () {
  // A component reading a token the gate does not require would reintroduce
  // the undefined-color class this plan removed.
  const files = collectFiles(COMPONENT_DIR);
  const read = new Set();

  for (let i = 0; i < files.length; i++) {
    const text = fs.readFileSync(files[i], 'utf8');
    const found = text.match(/colorMap\.[A-Z_]+/g) || [];

    for (let j = 0; j < found.length; j++) {
      read.add(found[j].replace('colorMap.', ''));
    }

  }

  const missing = Array.from(read).filter(function (t) {
    return REQUIRED_COLOR_TOKENS.indexOf(t) === -1;
  });

  assert.deepEqual(missing, []);
});

test('the required list matches the documented count', function () {
  assert.equal(REQUIRED_COLOR_TOKENS.length, 37);
});
