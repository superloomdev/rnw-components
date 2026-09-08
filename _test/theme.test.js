// Info: Theme-agnosticism and theme-contract enforcement.
//
// Two properties are proven here. First, the component set carries no baked-in
// design language: the same components rendered under Carbon and under a
// deliberately un-Carbon theme must produce different style values. If they
// match, a value is hardcoded somewhere and the theme is decorative. Second,
// createSystem refuses an incomplete theme: every required Color token is
// mandatory and the throw names every one that is absent, so one boot reports
// the whole gap.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Text as RNText, StyleSheet } from 'react-native';

import { createSystem, Text, TOKENS } from 'rnw-components';
import { COMPONENTS } from 'rnw-components/all';

import { sharedLibs, React, TestRenderer, act } from './loader.js';
import {
  buildCarbonWhite,
  buildContrastTheme,
  buildIncompleteTheme
} from './harness/themes.js';


// ========================= HELPERS ======================================== //

/********************************************************************
Build a system on a theme and register the whole flat component set.

@param {Object} theme - Built theme from Themer.buildTheme() (has .tokens)

@return {Object} - System object from createSystem
*********************************************************************/
function systemFor (theme) {

  const system = createSystem(sharedLibs, {}, theme, 'sm');
  system.addComponents(COMPONENTS);

  // Return the populated system for the caller to inspect
  return system;

}


// ========================= BRIDGE PATH PRESERVATION ======================= //

describe('bridge path preservation', function () {

  it('should reject scalar and nested path collisions in either order', function () {
    for (const flat of [
      { 'color.roles': 'scalar', 'color.roles.primary': 'child' },
      { 'color.roles.primary': 'child', 'color.roles': 'scalar' }
    ]) {
      assert.throws(function () {
        createSystem(sharedLibs, {}, { tokens: flat }, 'sm');
      }, TypeError);
    }
  });

  it('should reject unsafe and empty path segments', function () {
    for (const key of ['color.__proto__.value', 'font.constructor.prototype.value', 'color..value']) {
      assert.throws(function () {
        createSystem(sharedLibs, {}, { tokens: { [key]: 1 } }, 'sm');
      }, TypeError);
    }
    assert.equal(Object.prototype.value, undefined);
  });

  it('should not mutate the theme it was given', function () {
    const theme = buildCarbonWhite();
    const before = JSON.stringify(theme);
    createSystem(sharedLibs, {}, theme, 'sm');
    assert.strictEqual(JSON.stringify(theme), before);
  });

});


// ========================= TYPE-SET RENDERING AND STRICT LOOKUP ============= //

describe('type-set rendering and strict lookup', function () {

  it('should preserve the complete type set unless weight is explicitly overridden', function () {
    // Use a synthesizing family so fontWeight is carried into the style
    const built = buildCarbonWhite();
    const theme = { tokens: Object.assign({}, built.tokens) };
    theme.tokens['font.family.sans'] = 'System';

    const system = createSystem(sharedLibs, { STRICT_TOKENS: true }, theme, 'sm');
    system.addComponents({ Text });

    // Default type set (body01) carries the full type style
    let renderer;
    act(function () {
      renderer = TestRenderer.create(
        React.createElement(system.Component.Text, { typeSet: 'body01' }, 'Sample')
      );
    });
    const style1 = StyleSheet.flatten(renderer.root.findByType(RNText).props.style);
    assert.equal(style1.fontSize, 14);
    assert.equal(style1.lineHeight, 20);
    assert.equal(style1.letterSpacing, 0.16);
    assert.equal(style1.fontWeight, '400');
    renderer.unmount();

    // Override weight to bold
    act(function () {
      renderer = TestRenderer.create(
        React.createElement(system.Component.Text, { typeSet: 'body01', weight: 'bold' }, 'Sample')
      );
    });
    const style2 = StyleSheet.flatten(renderer.root.findByType(RNText).props.style);
    assert.equal(style2.fontSize, 14);
    assert.equal(style2.lineHeight, 20);
    assert.equal(style2.fontWeight, 700);
    renderer.unmount();
  });

  it('should reject unknown dynamic color and weight tokens in strict mode', function () {
    const system = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');
    system.addComponents({ Text });

    for (const props of [{ color: 'missing' }, { weight: 'missing' }, { typeSet: 'missing' }]) {
      assert.throws(function () {
        act(function () {
          TestRenderer.create(React.createElement(system.Component.Text, props, 'Sample'));
        });
      }, /unknown utility/);
    }
  });

  it('should tolerate an unknown type set only in lenient mode', function () {
    const system = createSystem(sharedLibs, {}, buildCarbonWhite(), 'sm');
    system.addComponents({ Text });

    let renderer;
    act(function () {
      renderer = TestRenderer.create(
        React.createElement(system.Component.Text, { typeSet: 'missing' }, 'Sample')
      );
    });
    // In lenient mode the unknown type set is skipped, not thrown
    assert.ok(renderer.toJSON());
    renderer.unmount();
  });

});


// ========================= TIER 1 - CONTRACT ENFORCEMENT ================== //

describe('theme contract enforcement', function () {

  it('should build on a complete Carbon theme', function () {

    assert.ok(systemFor(buildCarbonWhite()).Style.utilities);

  });

  it('should build on a complete non-Carbon theme', function () {

    assert.ok(systemFor(buildContrastTheme()).Style.utilities);

  });

  it('should throw when a required Color token is absent', function () {

    const fixture = buildIncompleteTheme();

    assert.throws(function () {
      createSystem(sharedLibs, {}, fixture, 'sm');
    }, TypeError);

  });

  it('should name every absent token in a single throw', function () {

    const fixture = buildIncompleteTheme();

    try {
      createSystem(sharedLibs, {}, fixture, 'sm');
      assert.fail('createSystem accepted an incomplete theme');
    } catch (error) {
      for (let i = 0; i < fixture.removed.length; i++) {
        assert.ok(
          error.message.indexOf(fixture.removed[i]) !== -1,
          'throw did not name ' + fixture.removed[i]
        );
      }
    }

  });

  it('should carry the error catalog type in the message', function () {

    const fixture = buildIncompleteTheme();

    try {
      createSystem(sharedLibs, {}, fixture, 'sm');
      assert.fail('createSystem accepted an incomplete theme');
    } catch (error) {
      assert.ok(error.message.indexOf('CONTRACT_MISSING_TOKEN') !== -1);
    }

  });

  it('should tolerate an empty-string Color token without crashing', function () {

    // An empty-string color passes the presence check; the value-type error
    // (CONTRACT_INVALID_VALUE) is deliberately filtered so a projected theme
    // is not rejected for platform-specific value shapes. The system builds
    // and the utility carries the empty string verbatim.
    const built = buildCarbonWhite();
    const theme = { tokens: Object.assign({}, built.tokens) };
    theme.tokens['color.interactive'] = '';

    const sys = createSystem(sharedLibs, {}, theme, 'sm');
    assert.strictEqual(sys.Style.utilities['font_interactive'].color, '');

  });

  it('should tolerate a non-string Color token without crashing', function () {

    // A non-string color value is skipped during utility generation (only
    // string values produce background/font/border utilities), but the
    // system still builds. The CONTRACT_INVALID_VALUE is filtered.
    const built = buildCarbonWhite();
    const theme = { tokens: Object.assign({}, built.tokens) };
    theme.tokens['color.background'] = 16;

    const sys = createSystem(sharedLibs, {}, theme, 'sm');
    assert.strictEqual(sys.Style.utilities['background_background'], undefined);

  });

});


// ========================= TIER 1 - THEME AGNOSTICISM ===================== //

describe('theme agnosticism', function () {

  it('should carry the theme color into the font utilities', function () {

    const carbon = systemFor(buildCarbonWhite());
    const contrast = systemFor(buildContrastTheme());

    assert.strictEqual(carbon.Style.utilities['font_interactive'].color, '#0f62fe');
    assert.strictEqual(contrast.Style.utilities['font_interactive'].color, '#b5179e');

  });

  it('should carry the theme radius into the radius utilities', function () {

    const carbon = systemFor(buildCarbonWhite());

    assert.ok(carbon.Style.utilities['br_radius_04'], 'br_radius_04 should exist');
    assert.strictEqual(carbon.Style.utilities['br_radius_04'].borderRadius, 4);

  });

  it('should carry the theme spacing into the padding utilities', function () {

    const carbon = systemFor(buildCarbonWhite());

    assert.ok(carbon.Style.utilities['p_a_spacing_05'], 'p_a_spacing_05 should exist');
    assert.strictEqual(carbon.Style.utilities['p_a_spacing_05'].padding, 16);

  });

  it('should carry the theme font size and derived line height', function () {

    const carbon = systemFor(buildCarbonWhite());

    assert.ok(carbon.Style.utilities['type_body01'], 'type_body01 should exist');
    assert.strictEqual(carbon.Style.utilities['type_body01'].fontSize, 14);
    assert.strictEqual(carbon.Style.utilities['type_body01'].lineHeight, 20);

  });

  it('should keep pill radius under the Carbon theme', function () {

    assert.strictEqual(
      systemFor(buildCarbonWhite()).Style.utilities['br_radius_max'].borderRadius,
      9999
    );

  });

  it('should render the same component differently under each theme', function () {

    // The strongest agnosticism check: identical element, different output.
    // A match here means a component ignored the theme and used a literal.
    const carbon = systemFor(buildCarbonWhite());
    const contrast = systemFor(buildContrastTheme());

    let underCarbon;
    let underContrast;
    act(function () {
      underCarbon = TestRenderer.create(
        React.createElement(carbon.Component.Tag, { label: 'tag' })
      );
    });
    act(function () {
      underContrast = TestRenderer.create(
        React.createElement(contrast.Component.Tag, { label: 'tag' })
      );
    });

    assert.notDeepStrictEqual(underCarbon.toJSON(), underContrast.toJSON());

    underCarbon.unmount();
    underContrast.unmount();

  });

  it('should expose no hardcoded Carbon blue in the interactive utilities', function () {

    // #0f62fe is Carbon Blue 60. Under the contrast theme the interactive
    // color is overridden to #b5179e, so the interactive utilities must not
    // carry the Carbon blue. This proves the component reads the theme
    // rather than hardcoding the Carbon palette.
    const contrast = systemFor(buildContrastTheme());

    assert.notStrictEqual(
      contrast.Style.utilities['font_interactive'].color,
      '#0f62fe'
    );
    assert.notStrictEqual(
      contrast.Style.utilities['background_interactive'].backgroundColor,
      '#0f62fe'
    );

  });

});


// ========================= TIER 1 - BUTTON TOKEN FAMILY =================== //

describe('button token family', function () {

  // The 15-token Carbon button family. Both REQUIRED_COLOR_TOKENS and
  // BACKGROUND_COLOR_TOKENS must carry every entry, or the drift this plan
  // exists to remove returns.
  const BUTTON_TOKENS = [
    'button_primary', 'button_primary_hover', 'button_primary_active',
    'button_secondary', 'button_secondary_hover', 'button_secondary_active',
    'button_tertiary', 'button_tertiary_hover', 'button_tertiary_active',
    'button_danger_primary', 'button_danger_hover', 'button_danger_active',
    'button_danger_secondary', 'button_disabled', 'button_separator'
  ];


  it('should generate a background utility for every button token', function () {

    const sys = systemFor(buildCarbonWhite());
    const utilities = sys.Style.utilities;

    for (let i = 0; i < BUTTON_TOKENS.length; i++) {
      const key = 'background_' + BUTTON_TOKENS[i];
      assert.ok(utilities[key],
        'missing utility "' + key + '"');
    }

  });


  it('should reject a theme missing a button token', function () {

    const built = buildCarbonWhite();
    const theme = { tokens: Object.assign({}, built.tokens) };
    delete theme.tokens['color.button_primary'];

    assert.throws(function () {
      createSystem(sharedLibs, {}, theme, 'sm');
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('button_primary') !== -1;
    });

  });


  it('should carry the button family in the public TOKENS export', function () {

    assert.ok(TOKENS.background, 'TOKENS.background is missing');

    for (let i = 0; i < BUTTON_TOKENS.length; i++) {
      assert.ok(TOKENS.background.indexOf(BUTTON_TOKENS[i]) !== -1,
        'TOKENS.background missing "' + BUTTON_TOKENS[i] + '"');
    }

  });


  it('should include text_disabled in TOKENS.fontColor', function () {

    assert.ok(TOKENS.fontColor.indexOf('text_disabled') !== -1,
      'TOKENS.fontColor missing text_disabled');

  });

});


// ========================= TIER 1 - STRICT TOKENS ======================== //

describe('STRICT_TOKENS', function () {

  it('should throw on an unknown utility key in strict mode', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');

    assert.throws(function () {
      // eslint-disable-next-line no-unused-expressions
      sys.Style.utilities['background_app_secondary'];
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('background_app_secondary') !== -1;
    });

  });


  it('should allow a declared utility key in strict mode', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');

    const util = sys.Style.utilities['background_interactive'];
    assert.ok(util, 'declared utility returned falsy');

  });


  it('should tolerate symbol keys in strict mode', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');

    // Symbol keys come from React and JS internals; a naive Proxy would throw
    // eslint-disable-next-line no-unused-expressions
    sys.Style.utilities[Symbol.iterator];
    // eslint-disable-next-line no-unused-expressions
    sys.Style.utilities[Symbol.toPrimitive];

    // No throw means pass
    assert.ok(true);

  });


  it('should return undefined for an unknown key in lenient mode', function () {

    const sys = createSystem(sharedLibs, {}, buildCarbonWhite(), 'sm');

    assert.strictEqual(sys.Style.utilities['background_nonexistent'], undefined);

  });

});
