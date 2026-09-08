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

import { Style, theme, buildFullSystem } from './loader.js';
import { createRealFamilyTheme } from './harness/themes.js';

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

    const fontSizeKeys = Object.keys(theme.Dimension.fontSize);
    for (let i = 0; i < fontSizeKeys.length; i++) {
      const value = theme.Dimension.fontSize[fontSizeKeys[i]];
      if (!Number.isFinite(value)) {
        errors.push('fontSize.' + fontSizeKeys[i] + ' = ' + value);
      }
    }

    const spaceKeys = Object.keys(theme.Dimension.space);
    for (let i = 0; i < spaceKeys.length; i++) {
      const value = theme.Dimension.space[spaceKeys[i]];
      if (!Number.isFinite(value)) {
        errors.push('space.' + spaceKeys[i] + ' = ' + value);
      }
    }

    const radiusKeys = Object.keys(theme.Dimension.radius);
    for (let i = 0; i < radiusKeys.length; i++) {
      const value = theme.Dimension.radius[radiusKeys[i]];
      if (!Number.isFinite(value)) {
        errors.push('radius.' + radiusKeys[i] + ' = ' + value);
      }
    }

    assert.strictEqual(errors.length, 0,
      'L1 found non-finite Dimension values:\n  ' + errors.join('\n  '));

  });


  it('should have theme Color values as strings', function () {

    const errors = [];
    const colorKeys = Object.keys(theme.Color);

    for (let i = 0; i < colorKeys.length; i++) {
      const value = theme.Color[colorKeys[i]];
      if (typeof value !== 'string') {
        errors.push('Color.' + colorKeys[i] + ' = ' + value);
      }
    }

    assert.strictEqual(errors.length, 0,
      'L1 found non-string Color values:\n  ' + errors.join('\n  '));

  });


  it('should have theme Font weight values as strings', function () {

    const errors = [];
    const weightKeys = Object.keys(theme.Font.weight);

    for (let i = 0; i < weightKeys.length; i++) {
      const value = theme.Font.weight[weightKeys[i]];
      if (typeof value !== 'string') {
        errors.push('Font.weight.' + weightKeys[i] + ' = ' + value);
      }
    }

    assert.strictEqual(errors.length, 0,
      'L1 found non-string Font.weight values:\n  ' + errors.join('\n  '));

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

    const badTheme = {
      Color: { APP_PRIMARY: '#0f62fe', TEXT_PRIMARY: '#161616' },
      Dimension: {
        fontSize: { xs: '0.75rem', sm: NaN, md: null },
        space: { xs: 4, sm: '0.5rem' },
        radius: { sm: 4 },
        lineHeightRatio: 1.4
      },
      Font: {
        family: { primary: 'System', secondary: 'System' },
        weight: { regular: '400' }
      },
      Breakpoint: { base: 0 }
    };

    const errors = [];
    const fontSizeKeys = Object.keys(badTheme.Dimension.fontSize);

    for (let i = 0; i < fontSizeKeys.length; i++) {
      const key = fontSizeKeys[i];
      const value = badTheme.Dimension.fontSize[key];

      if (Number.isNaN(value)) {
        errors.push('NaN at fontSize.' + key);
      } else if (value === null) {
        errors.push('null at fontSize.' + key);
      } else if (typeof value === 'string' && UNIT_PATTERN.test(value)) {
        errors.push('unit string at fontSize.' + key + ': ' + value);
      }
    }

    const spaceKeys = Object.keys(badTheme.Dimension.space);
    for (let i = 0; i < spaceKeys.length; i++) {
      const key = spaceKeys[i];
      const value = badTheme.Dimension.space[key];
      if (typeof value === 'string' && UNIT_PATTERN.test(value)) {
        errors.push('unit string at space.' + key + ': ' + value);
      }
    }

    assert.ok(errors.length >= 3,
      'L1-PROOF: expected at least 3 errors, got ' + errors.length);

  });


  it('should reject unit-suffixed dimension values at build time', function () {

    const badTheme = {
      Color: theme.Color,
      Dimension: {
        fontSize: { xs: '0.75rem', sm: 14, md: 16 },
        space: { xs: 4 },
        radius: { sm: 4 },
        lineHeightRatio: 1.4
      },
      Font: theme.Font,
      Breakpoint: theme.Breakpoint
    };

    assert.throws(function () {
      buildFullSystem(badTheme, 'base');
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('unit-suffixed string') !== -1;
    });

  });


  it('should reject NaN dimension values at build time', function () {

    const badTheme = {
      Color: theme.Color,
      Dimension: {
        fontSize: { xs: 12, sm: NaN },
        space: { xs: 4 },
        radius: { sm: 4 },
        lineHeightRatio: 1.4
      },
      Font: theme.Font,
      Breakpoint: theme.Breakpoint
    };

    assert.throws(function () {
      buildFullSystem(badTheme, 'base');
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('finite number') !== -1;
    });

  });

});


// ============================================================================
// 3. FONT WEIGHT RESOLUTION
// ============================================================================

describe('L1: Font weight resolution', function () {

  it('should generate font_weight utilities for all weights', function () {

    const warnings = [];
    const weightKeys = Object.keys(theme.Font.weight);

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

    const poppinsTheme = createRealFamilyTheme();
    const poppinsSystem = buildFullSystem(poppinsTheme, 'base');
    const poppinsUtils = poppinsSystem.Style.utilities;

    const regular = poppinsUtils['font_weight_regular'];
    assert.ok(regular);
    assert.strictEqual(regular.fontFamily, 'Poppins_400Regular');
    assert.strictEqual(regular.fontWeight, undefined);

  });

});
