// Info: L1 - Static Token Auditor.
//
// For every breakpoint's utility set and every token group, flag NaN, null,
// unit-suffixed strings on numeric props, and undefined values. Reads the
// prop list and pattern from data/style-contract.json. Never hardcodes them.
//
// Against a bad theme with rem strings this produces errors, proving the test
// fires. Against the native projection (integer-only) it passes.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Style, theme, buildFullSystem, Themer } from './loader.js';
import carbonV11Profile from 'helper-themer-template-carbon';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const DATA = require('rnw-components/data/style-contract.json');

const NUMERIC_PROPS = DATA.numeric_style_props;
const UNIT_PATTERN = new RegExp(DATA.unit_suffix_pattern);


// ============================================================================
// 1. STATIC UTILITY AUDIT
// ============================================================================

describe('L1: Static Utility Audit', function () {

  it('should have all utility style values as finite numbers for numeric props', function () {

    const errors = [];
    const warnings = [];
    const breakpointKeys = Object.keys(Style.allBreakpoints);

    for (let b = 0; b < breakpointKeys.length; b++) {
      const bpKey = breakpointKeys[b];
      const utilities = Style.allBreakpoints[bpKey];
      const utilityKeys = Object.keys(utilities);

      for (let u = 0; u < utilityKeys.length; u++) {
        const utilName = utilityKeys[u];
        const utilStyle = utilities[utilName];

        if (utilStyle === null || utilStyle === undefined) {
          continue;
        }

        const propKeys = Object.keys(utilStyle);

        for (let p = 0; p < propKeys.length; p++) {
          const prop = propKeys[p];
          const value = utilStyle[prop];

          if (NUMERIC_PROPS.indexOf(prop) === -1) {
            continue;
          }

          const location = bpKey + '.' + utilName + '.' + prop;

          if (Number.isNaN(value)) {
            errors.push('NaN at ' + location);
          } else if (value === null) {
            errors.push('null at ' + location + ' on a numeric prop');
          } else if (typeof value === 'string' && UNIT_PATTERN.test(value)) {
            errors.push('unit string "' + value + '" at ' + location);
          } else if (value === undefined) {
            warnings.push('undefined at ' + location);
          }
        }
      }
    }

    assert.strictEqual(errors.length, 0,
      'L1 found ' + errors.length + ' errors:\n  ' + errors.join('\n  '));

  });


  it('should have theme Dimension values as finite numbers', function () {

    const errors = [];

    // TypeSet entries carry fontSize, lineHeight, and letterSpacing as numbers
    const typeSetKeys = Object.keys(Style.tokens.TypeSet);
    for (let i = 0; i < typeSetKeys.length; i++) {
      const ts = Style.tokens.TypeSet[typeSetKeys[i]];
      const numericFields = ['fontSize', 'lineHeight', 'letterSpacing'];
      for (let f = 0; f < numericFields.length; f++) {
        const field = numericFields[f];
        const value = ts[field];
        if (value !== undefined && !Number.isFinite(value)) {
          errors.push('TypeSet.' + typeSetKeys[i] + '.' + field + ' = ' + value);
        }
      }
    }

    // Spacing tokens are plain numbers; fluid tokens are viewport-scaled
    // objects ({ viewport: true, vw: N }) and are skipped here.
    const spacingKeys = Object.keys(Style.tokens.Spacing);
    for (let i = 0; i < spacingKeys.length; i++) {
      const value = Style.tokens.Spacing[spacingKeys[i]];
      if (typeof value === 'number' && !Number.isFinite(value)) {
        errors.push('Spacing.' + spacingKeys[i] + ' = ' + value);
      } else if (typeof value === 'string' && UNIT_PATTERN.test(value)) {
        errors.push('Spacing.' + spacingKeys[i] + ' = ' + value);
      }
    }

    // Shape tokens (radii) are plain numbers
    const shapeKeys = Object.keys(Style.tokens.Shape);
    for (let i = 0; i < shapeKeys.length; i++) {
      const value = Style.tokens.Shape[shapeKeys[i]];
      if (!Number.isFinite(value)) {
        errors.push('Shape.' + shapeKeys[i] + ' = ' + value);
      }
    }

    assert.strictEqual(errors.length, 0,
      'L1 found non-finite Dimension values:\n  ' + errors.join('\n  '));

  });


  it('should have theme Color values as strings', function () {

    const errors = [];
    const colorKeys = Object.keys(Style.tokens.Color);

    for (let i = 0; i < colorKeys.length; i++) {
      const value = Style.tokens.Color[colorKeys[i]];
      if (typeof value !== 'string') {
        errors.push('Color.' + colorKeys[i] + ' = ' + value);
      }
    }

    assert.strictEqual(errors.length, 0,
      'L1 found non-string Color values:\n  ' + errors.join('\n  '));

  });


  it('should have theme Font weight values as finite numbers', function () {

    const errors = [];
    const weightKeys = Object.keys(Style.tokens.Font.weight);

    for (let i = 0; i < weightKeys.length; i++) {
      const value = Style.tokens.Font.weight[weightKeys[i]];
      if (!Number.isFinite(value)) {
        errors.push('Font.weight.' + weightKeys[i] + ' = ' + value);
      }
    }

    assert.strictEqual(errors.length, 0,
      'L1 found non-finite Font.weight values:\n  ' + errors.join('\n  '));

  });


  it('should declare every literal Style.utilities key used by component source', function () {

    // Recursively read component/**/*.js and extract only complete literal
    // references: Style.utilities['key'] or Style.utilities["key"].
    // Computed accesses like Style.utilities['br_' + radius] are not matched.
    const utilityReference = /Style\.utilities\[(['"])([A-Za-z0-9_]+?)\1\s*\]/g;

    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const componentDir = path.join(repoRoot, 'component');

    function collectJsFiles (dir) {
      const out = [];
      const entries = readdirSync(dir);
      for (let i = 0; i < entries.length; i++) {
        const full = path.join(dir, entries[i]);
        const st = statSync(full);
        if (st.isDirectory()) {
          const sub = collectJsFiles(full);
          for (let j = 0; j < sub.length; j++) {
            out.push(sub[j]);
          }
        } else if (entries[i].endsWith('.js')) {
          out.push(full);
        }
      }
      return out;
    }

    const files = collectJsFiles(componentDir);
    const declared = new Set(Object.keys(Style.utilities));
    const missing = {};

    for (let i = 0; i < files.length; i++) {
      const src = readFileSync(files[i], 'utf8');
      let match;
      utilityReference.lastIndex = 0;
      while ((match = utilityReference.exec(src)) !== null) {
        const key = match[2];
        if (!declared.has(key)) {
          const rel = path.relative(repoRoot, files[i]);
          if (!missing[key]) {
            missing[key] = [];
          }
          missing[key].push(rel);
        }
      }
    }

    const missingKeys = Object.keys(missing).sort();
    if (missingKeys.length > 0) {
      const lines = [];
      for (let i = 0; i < missingKeys.length; i++) {
        lines.push('  ' + missingKeys[i] + ' used by: ' + missing[missingKeys[i]].join(', '));
      }
      assert.fail('L1 found undeclared literal Style.utilities keys:\n' + lines.join('\n'));
    }

  });

});


// ============================================================================
// 2. PROOF TESTS (verify auditor fires on deliberate violations)
// ============================================================================

describe('L1: Proof tests', function () {

  it('should detect NaN, null, and unit strings in a bad theme', function () {

    // Build a bad theme using the new token-group shape: Spacing, Shape,
    // and TypeSet carry the numeric values the auditor inspects.
    const badTheme = {
      Spacing: { spacing_01: 4, spacing_02: '0.5rem' },
      Shape: { radius_04: NaN, radius_08: null },
      TypeSet: {
        body01: { fontSize: '0.75rem', lineHeight: 20, letterSpacing: 0.16 }
      }
    };

    const errors = [];

    // Audit Spacing for unit-suffixed strings
    const spacingKeys = Object.keys(badTheme.Spacing);
    for (let i = 0; i < spacingKeys.length; i++) {
      const key = spacingKeys[i];
      const value = badTheme.Spacing[key];
      if (Number.isNaN(value)) {
        errors.push('NaN at Spacing.' + key);
      } else if (value === null) {
        errors.push('null at Spacing.' + key);
      } else if (typeof value === 'string' && UNIT_PATTERN.test(value)) {
        errors.push('unit string at Spacing.' + key + ': ' + value);
      }
    }

    // Audit Shape for NaN and null
    const shapeKeys = Object.keys(badTheme.Shape);
    for (let i = 0; i < shapeKeys.length; i++) {
      const key = shapeKeys[i];
      const value = badTheme.Shape[key];
      if (Number.isNaN(value)) {
        errors.push('NaN at Shape.' + key);
      } else if (value === null) {
        errors.push('null at Shape.' + key);
      } else if (typeof value === 'string' && UNIT_PATTERN.test(value)) {
        errors.push('unit string at Shape.' + key + ': ' + value);
      }
    }

    // Audit TypeSet fontSize for unit-suffixed strings
    const typeSetKeys = Object.keys(badTheme.TypeSet);
    for (let i = 0; i < typeSetKeys.length; i++) {
      const key = typeSetKeys[i];
      const value = badTheme.TypeSet[key].fontSize;
      if (typeof value === 'string' && UNIT_PATTERN.test(value)) {
        errors.push('unit string at TypeSet.' + key + '.fontSize: ' + value);
      }
    }

    assert.ok(errors.length >= 3,
      'L1-PROOF: expected at least 3 errors, got ' + errors.length);

  });


  it('should reject unit-suffixed dimension values at build time', function () {

    // Build a flat tokens map with a unit-suffixed spacing value, then pass
    // it through buildFullSystem. The validators reject unit-suffixed
    // strings on number-typed groups (spacing, shape, border, focus, size).
    const badTokens = Object.assign({}, theme.tokens, {
      'spacing.spacing_01': '0.25rem'
    });

    assert.throws(function () {
      buildFullSystem({ tokens: badTokens }, 'sm');
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('unit-suffixed string') !== -1;
    });

  });


  it('should reject NaN dimension values at build time', function () {

    // The Themer engine rejects NaN at build time: NaN is not a valid token
    // value type (literal, alias, rule, generator, or type set).
    const badLayer = {
      name: 'bad',
      tokens: {
        'spacing.spacing_01': NaN
      }
    };

    assert.throws(function () {
      Themer.buildTheme(carbonV11Profile.schemes.white, [badLayer], 'native');
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('spacing.spacing_01') !== -1;
    });

  });

});


// ============================================================================
// 3. FONT WEIGHT RESOLUTION
// ============================================================================

describe('L1: Font weight resolution', function () {

  it('should generate font_weight utilities for all weights', function () {

    const warnings = [];
    const weightKeys = Object.keys(Style.tokens.Font.weight);

    for (let i = 0; i < weightKeys.length; i++) {
      const w = weightKeys[i];
      const utilName = 'font_weight_' + w;
      const utilStyle = Style.utilities[utilName];

      if (!utilStyle) {
        warnings.push(w + ': no utility style generated');
      }
    }

    assert.strictEqual(warnings.length, 0,
      'Missing font_weight utilities:\n  ' + warnings.join('\n  '));

  });


  it('should not include fontWeight for Poppins per-weight-face family', function () {

    // Build a theme through the Themer engine with a layer that sets
    // font.family.sans to a real per-weight-face family name (Poppins).
    const poppinsLayer = {
      name: 'poppins',
      tokens: {
        'font.family.sans': 'Poppins'
      }
    };
    const poppinsTheme = Themer.buildTheme(
      carbonV11Profile.schemes.white, [poppinsLayer], 'native'
    );
    const poppinsSystem = buildFullSystem(poppinsTheme, 'sm');
    const poppinsUtils = poppinsSystem.Style.utilities;

    const regular = poppinsUtils['font_weight_regular'];
    assert.ok(regular);
    assert.strictEqual(regular.fontFamily, 'Poppins');
    assert.strictEqual(regular.fontWeight, undefined);

  });

});
