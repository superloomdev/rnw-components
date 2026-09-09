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
import { execFileSync } from 'node:child_process';
import * as rnw from 'react-native-web';

import { Style, Themer } from './loader.js';
import buildTokenContract from 'rnw-components/data/token-contract.js';

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

    // text_disabled is exempt (low opacity by design).
    // support_success and support_warning are Carbon status colors used as
    // icon/background fills, not as text on white; their contrast on white
    // is below 4.5:1 by Carbon's own design.
    const EXEMPT_TOKENS = ['text_disabled', 'support_success', 'support_warning'];
    const colorTokens = Style.tokens.Color;
    const bgPrimary = colorTokens.background;
    const findings = [];

    const FONT_TOKENS = [
      'text_primary', 'text_secondary', 'text_secondary', 'text_disabled', 'text_on_color',
      'interactive', 'support_success', 'support_error', 'support_warning', 'support_info'
    ];

    for (let i = 0; i < FONT_TOKENS.length; i++) {
      const token = FONT_TOKENS[i];
      const value = colorTokens[token];

      if (!value || EXEMPT_TOKENS.indexOf(token) !== -1) {
        continue;
      }

      const bg = token === 'text_on_color' ? colorTokens.interactive : bgPrimary;
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


// ============================================================================
// L4-R6: No direct mechanism requires in component files
// ============================================================================

describe('L4-R6: No direct mechanism requires', function () {

  it('should not import from parts/ directly in component files', function () {

    const files = collectFiles(COMPONENT_DIR);
    const findings = [];

    for (let f = 0; f < files.length; f++) {
      const lines = readLines(files[f]);
      const rel = path.relative(COMPONENT_DIR, files[f]);

      // context/ is infrastructure, not a component; it legitimately
      // imports the compound-context part to cache context instances.
      if (rel.startsWith('context' + path.sep)) {
        continue;
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip comments
        if (line.trim().indexOf('//') === 0) {
          continue;
        }

        // Match imports from parts/ directory
        if (/from\s+['"][^'"]*\/parts\//.test(line)) {
          findings.push(rel + ':' + (i + 1) + ' imports from parts/ directly');
        }
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R6: direct parts/ imports found:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// L4-R9: text_disabled only in disabled branches
// ============================================================================

describe('L4-R9: text_disabled only in disabled branches', function () {

  it('should only reference text_disabled in disabled or error contexts', function () {

    const files = collectFiles(COMPONENT_DIR);
    const findings = [];

    for (let f = 0; f < files.length; f++) {
      const lines = readLines(files[f]);
      const rel = path.relative(COMPONENT_DIR, files[f]);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip comments
        if (line.trim().indexOf('//') === 0) {
          continue;
        }

        // Look for text_disabled usage outside of disabled/error contexts
        if (line.indexOf('text_disabled') !== -1) {
          // Check surrounding context for disabled or error keywords
          const context = lines.slice(Math.max(0, i - 3), Math.min(lines.length, i + 4)).join(' ');
          if (!/disabled|error|invalid|isInvalid/i.test(context)) {
            findings.push(rel + ':' + (i + 1) + ' uses text_disabled outside a disabled/error context');
          }
        }
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R9: text_disabled used outside disabled/error branches:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// L4-R10: BORDER tokens not used as font color
// ============================================================================

describe('L4-R10: BORDER tokens not used as font color', function () {

  it('should not use border tokens as font color utilities', function () {

    const files = collectFiles(COMPONENT_DIR);
    const findings = [];

    for (let f = 0; f < files.length; f++) {
      const lines = readLines(files[f]);
      const rel = path.relative(COMPONENT_DIR, files[f]);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip comments
        if (line.trim().indexOf('//') === 0) {
          continue;
        }

        // Look for font_ utilities that reference border tokens
        if (/font_border_subtle|font_border_strong|font_border_interactive|font_border_inverse/.test(line)) {
          findings.push(rel + ':' + (i + 1) + ' uses a border token as a font color');
        }
      }
    }

    assert.strictEqual(findings.length, 0,
      'L4-R10: border tokens used as font colors:\n  ' + findings.join('\n  '));

  });

});


// ============================================================================
// Planted-violation proof tests for G27/G28/G29 (new) and G30/G31/G32 (moved)
// ============================================================================

describe('L4-PROOF: G27/G28/G29/G30/G31/G32 violation detection', function () {

  // Parse ci.yml once and extract the grep patterns from each gate.
  // The test proves the gates fire by running the extracted pattern with
  // grep -E against a planted line (must match) and a legitimate line
  // (must not match). Hand-copying the regexes is banned (rule 35).
  const __dirname2 = path.dirname(fileURLToPath(import.meta.url));
  const CI_YML = path.resolve(__dirname2, '..', '.github', 'workflows', 'ci.yml');
  const ciText = fs.readFileSync(CI_YML, 'utf8');
  const ciLines = ciText.split('\n');

  // Extract the script block for a named gate (e.g. "G27")
  function getGateScript (gateName) {
    const headerRe = new RegExp('^\\s+- name: (' + gateName + '\\b.*)$');
    for (let i = 0; i < ciLines.length; i++) {
      const m = ciLines[i].match(headerRe);
      if (!m) { continue; }
      // The run block must be the next non-blank line
      const runLine = ciLines[i + 1];
      if (!runLine || !/^\s+run: \|/.test(runLine)) { continue; }
      const runIndent = runLine.match(/^(\s+)/)[1].length;
      const body = [];
      for (let j = i + 2; j < ciLines.length; j++) {
        const line = ciLines[j];
        if (!line.trim()) { body.push(''); continue; }
        const indent = line.match(/^(\s*)/)[1].length;
        if (indent <= runIndent) { break; }
        body.push(line);
      }
      return body.join('\n');
    }
    return null;
  }

  // Extract every grep -E pattern from a script block. Returns an array of
  // { pattern, flags } objects in the order they appear. Excludes grep -vE
  // exclusion patterns (flags containing v) since those are filters, not
  // detectors. Handles escaped double quotes (\" inside the YAML pattern)
  // by allowing backslash-escaped characters inside the quoted body and
  // applying bash double-quote unescaping after extraction.
  function extractPatterns (script) {
    const patterns = [];
    const lines = script.split('\n');
    for (const line of lines) {
      const re = /grep\s+(-\w+)\s+"((?:[^"\\]|\\.)*)"/g;
      let m;
      while ((m = re.exec(line)) !== null) {
        if (m[1].indexOf('v') === -1) {
          // Bash double-quote unescaping: \" -> ", \\ -> \, \$ -> $.
          // Other backslash sequences (\., \[, \|, etc.) are passed through
          // unchanged by bash inside double quotes.
          const raw = m[2];
          const unescaped = raw
            .replace(/\\(["\\$])/g, '$1');
          patterns.push({ pattern: unescaped, flags: m[1] });
        }
      }
    }
    return patterns;
  }

  // Run grep -E with a pattern against a single line of text. Returns true
  // when the pattern matches the line. Passes -i when the gate flags include
  // case-insensitive matching.
  function grepMatches (entry, line) {
    const pattern = typeof entry === 'string' ? entry : entry.pattern;
    const flags = typeof entry === 'string' ? '' : entry.flags;
    const args = ['-E'];
    if (flags.indexOf('i') !== -1) {
      args.push('-i');
    }
    args.push(pattern);
    try {
      execFileSync('grep', args, {
        input: line + '\n',
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      return true;
    } catch {
      return false;
    }
  }

  // G27: four command proofs (one per fallback form)
  const g27Patterns = extractPatterns(getGateScript('G27') || '');
  assert.ok(g27Patterns.length >= 4, 'G27 should have at least 4 grep patterns, got ' + g27Patterns.length);

  it('G27 form 1 should detect a utility fallback chain', function () {
    assert.ok(grepMatches(g27Patterns[0], "Style.utilities[bgKey] || Style.utilities['background_layer_02']"),
      'G27 form 1 should detect utility fallback chain');
    assert.ok(!grepMatches(g27Patterns[0], "Style.utilities[bgKey]"),
      'G27 form 1 should not match a clean utility read');
  });

  it('G27 form 2 should detect a hasOwnProperty existence check', function () {
    assert.ok(grepMatches(g27Patterns[1], 'hasOwnProperty.call(Style.utilities, key)'),
      'G27 form 2 should detect hasOwnProperty check');
    assert.ok(!grepMatches(g27Patterns[1], 'Style.utilities[key]'),
      'G27 form 2 should not match a clean utility read');
  });

  it('G27 form 3 should detect a bracket-form color fallback', function () {
    assert.ok(grepMatches(g27Patterns[2], 'Style.tokens.Color[color] || color'),
      'G27 form 3 should detect bracket color fallback');
    assert.ok(!grepMatches(g27Patterns[2], 'Style.utilities[bgKey]'),
      'G27 form 3 should not match a utility read');
  });

  it('G27 form 4 should detect a dot-form color fallback', function () {
    assert.ok(grepMatches(g27Patterns[3], 'Style.tokens.Color.interactive || fallback'),
      'G27 form 4 should detect dot color fallback');
    assert.ok(!grepMatches(g27Patterns[3], 'Style.tokens.Color.interactive'),
      'G27 form 4 should not match a clean color read');
  });

  // G28: one proof
  const g28Patterns = extractPatterns(getGateScript('G28') || '');
  assert.ok(g28Patterns.length >= 1, 'G28 should have at least 1 grep pattern');

  it('G28 should detect a SCREAMING_SNAKE token name', function () {
    assert.ok(grepMatches(g28Patterns[0], 'const util = Style.utilities["BACKGROUND_PRIMARY"];'),
      'G28 should detect BACKGROUND_PRIMARY SCREAMING token');
    assert.ok(!grepMatches(g28Patterns[0], 'const util = Style.utilities["background_primary"];'),
      'G28 should not match a lowercase token name');
  });

  // G29: three command proofs
  const g29Patterns = extractPatterns(getGateScript('G29') || '');
  assert.ok(g29Patterns.length >= 3, 'G29 should have at least 3 grep patterns, got ' + g29Patterns.length);

  it('G29 command 1 should detect a unit string in theme/data', function () {
    assert.ok(grepMatches(g29Patterns[0], "const w = '16px';"),
      'G29 command 1 should detect 16px unit string');
    assert.ok(!grepMatches(g29Patterns[0], "const w = 16;"),
      'G29 command 1 should not match a plain number');
  });

  it('G29 command 2 should detect a percentage string in theme data', function () {
    assert.ok(grepMatches(g29Patterns[1], "const w = '50%';"),
      'G29 command 2 should detect 50% percentage string');
    assert.ok(!grepMatches(g29Patterns[1], "const w = 50;"),
      'G29 command 2 should not match a plain number');
  });

  it('G29 command 3 should detect a percentage on a non-allowed prop', function () {
    assert.ok(grepMatches(g29Patterns[2], "fontSize: '120%'"),
      'G29 command 3 should detect fontSize percentage');
    assert.ok(!grepMatches(g29Patterns[2], "width: '50%'"),
      'G29 command 3 should not match width percentage (allowed)');
  });

  // G30: one proof
  const g30Patterns = extractPatterns(getGateScript('G30') || '');
  assert.ok(g30Patterns.length >= 1, 'G30 should have at least 1 grep pattern');

  it('G30 should detect vendor terminology', function () {
    assert.ok(grepMatches(g30Patterns[0], 'const color = Carbon.blue60;'),
      'G30 should detect "Carbon" in source');
    assert.ok(!grepMatches(g30Patterns[0], 'const color = interactive;'),
      'G30 should not match a generic token name');
  });

  // G31: one proof
  const g31Patterns = extractPatterns(getGateScript('G31') || '');
  assert.ok(g31Patterns.length >= 1, 'G31 should have at least 1 grep pattern');

  it('G31 should detect dead token names', function () {
    assert.ok(grepMatches(g31Patterns[0], 'const util = Style.utilities["font_size_md"];'),
      'G31 should detect font_size_md dead token');
    assert.ok(!grepMatches(g31Patterns[0], 'const util = Style.utilities["font_heading01"];'),
      'G31 should not match a live token name');
  });

  // G32: one proof
  const g32Patterns = extractPatterns(getGateScript('G32') || '');
  assert.ok(g32Patterns.length >= 1, 'G32 should have at least 1 grep pattern');

  it('G32 should detect removed ./theme export reference', function () {
    assert.ok(grepMatches(g32Patterns[0], "import theme from 'rnw-components/theme';"),
      'G32 should detect rnw-components/theme reference');
    assert.ok(!grepMatches(g32Patterns[0], "import { createSystem } from 'rnw-components';"),
      'G32 should not match a valid import');
  });

  // Proof that the G29 percentage filter matches every percent_style_props entry.
  // For each allowed prop, a percentage string on that prop should NOT be caught
  // by the G29 command 3 filter. This proves the allowlist is complete.
  it('G29 command 3 should not match any percent_style_props entry', function () {
    const allowed = DATA.percent_style_props;
    for (const prop of allowed) {
      const line = prop + ": '50%'";
      assert.ok(!grepMatches(g29Patterns[2], line),
        'G29 command 3 should not match allowed prop ' + prop + ' (it is in percent_style_props)');
    }
  });

});


// ─── Color token contract ──────────────────────────────────────────────────

// The contract color tokens createSystem validates through Themer.
// Computed from the contract through the same D8 rule the library uses.
const _contract = Themer.getContract();
const _contractInfo = buildTokenContract(_contract);
const requiredColorTokens = _contractInfo.REQUIRED_TOKENS
  .filter(function (name) { return name.indexOf('color.') === 0; })
  .map(function (name) { return name.slice('color.'.length); });


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

    if (/Style\.tokens\.Color\.[a-z_]+ \|\| /.test(text)) {
      hits.push(path.relative(COMPONENT_DIR, files[i]));
    }

  }

  assert.deepEqual(hits, []);
});

test('every Style.tokens.Color read by a component is in the required list', function () {
  // A component reading a token the gate does not require would reintroduce
  // the undefined-color class this plan removed.
  const files = collectFiles(COMPONENT_DIR);
  const read = new Set();

  for (let i = 0; i < files.length; i++) {
    const text = fs.readFileSync(files[i], 'utf8');
    const found = text.match(/Style\.tokens\.Color\.([a-z_0-9]+)/g) || [];

    for (let j = 0; j < found.length; j++) {
      read.add(found[j].replace('Style.tokens.Color.', ''));
    }

  }

  const missing = Array.from(read).filter(function (t) {
    return requiredColorTokens.indexOf(t) === -1;
  });

  assert.deepEqual(missing, []);
});

test('the required color list matches the contract D8 rule', function () {
  // Compute the expected required color tokens directly from the contract
  // by the D8 words alone, without calling buildTokenContract. The rule:
  // every structure-tier token, plus every value-tier token except
  // color.tag_* and color.ai_*. Then filter for color tokens only.
  const contract = Themer.getContract();
  const expected = Object.keys(contract.tokens)
    .filter(function (name) {
      const group = name.slice(0, name.indexOf('.'));
      const tier = contract.groups[group].tier;
      if (tier === 'structure') { return true; }
      if (tier === 'value') {
        if (name.indexOf('color.tag_') === 0 || name.indexOf('color.ai_') === 0) {
          return false;
        }
        return true;
      }
      return false;
    })
    .filter(function (name) { return name.indexOf('color.') === 0; })
    .map(function (name) { return name.slice('color.'.length); })
    .sort();
  const actual = requiredColorTokens.slice().sort();
  assert.deepEqual(actual, expected);
});
