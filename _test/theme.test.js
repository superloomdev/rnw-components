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

import { createSystem, buildThemeContract, Text } from 'rnw-components-carbon';
import { Text as RNText, StyleSheet } from 'react-native';
import { COMPONENTS } from 'rnw-components-carbon/all';

import {
  createCarbonTheme,
  createContrastTheme,
  createIncompleteTheme
} from './harness/themes.js';

import { sharedLibs, React, TestRenderer, TOKENS } from './loader.js';


describe('bridge path preservation', function () {

  it('should preserve siblings in every dotted token group', function () {
    const flat = {};
    const groups = { color: 'Color', dimension: 'Dimension', font: 'Font', type: 'TypeSet', shadow: 'Shadow', motion: 'Motion', layer: 'Layer' };
    for (const prefix of Object.keys(groups)) {
      flat[prefix + '.roles.primary'] = 1;
      flat[prefix + '.roles.secondary'] = 2;
    }
    const result = buildThemeContract(flat);
    for (const group of Object.values(groups)) {
      assert.deepEqual(result[group].roles, { primary: 1, secondary: 2 });
    }
  });

  it('should reject scalar and nested path collisions in either order', function () {
    for (const flat of [
      { 'color.roles': 'scalar', 'color.roles.primary': 'child' },
      { 'color.roles.primary': 'child', 'color.roles': 'scalar' }
    ]) {
      assert.throws(function () { buildThemeContract(flat); }, /colliding token path/);
    }
  });

  it('should reject unsafe and empty path segments', function () {
    for (const key of ['color.__proto__.value', 'font.constructor.prototype.value', 'color..value']) {
      assert.throws(function () { buildThemeContract({ [key]: 1 }); }, /invalid token path/);
    }
    assert.equal(Object.prototype.value, undefined);
  });

  it('should not mutate composite input tokens or share default breakpoints', function () {
    const type = Object.freeze({ fontSize: 14, lineHeight: 20 });
    const flat = { 'type.body01': type };
    const result = buildThemeContract(flat);
    assert.deepEqual(result.TypeSet.body01, type);
    assert.throws(function () {
      buildThemeContract({ ...flat, 'type.body01.fontWeight': 600 });
    }, /colliding token path/);
    result.Breakpoint.base = 10;
    assert.equal(buildThemeContract(null).Breakpoint.base, 0);
  });

});

describe('type-set rendering and strict lookup', function () {

  it('should preserve the complete type set unless weight is explicitly overridden', function () {
    const theme = createCarbonTheme();
    theme.Font.family.primary = 'System';
    theme.TypeSet = { body01: { fontSize: 14, lineHeight: 20, letterSpacing: 0.16, fontWeight: 600, fontFamily: 'primary' } };
    const system = createSystem(sharedLibs, { STRICT_TOKENS: true }, theme, 'base');
    system.addComponents({ Text });
    for (const [props, expected] of [[{}, 600], [{ weight: 'bold' }, '700']]) {
      const renderer = TestRenderer.create(React.createElement(system.Component.Text, { typeSet: 'body01', ...props }, 'Sample'));
      const style = StyleSheet.flatten(renderer.root.findByType(RNText).props.style);
      assert.equal(style.fontWeight, expected);
      assert.equal(style.fontSize, 14);
      assert.equal(style.lineHeight, 20);
      assert.equal(style.letterSpacing, 0.16);
      renderer.unmount();
    }
  });

  it('should reject unknown dynamic size and color tokens in strict mode', function () {
    const system = createSystem(sharedLibs, { STRICT_TOKENS: true }, createCarbonTheme(), 'base');
    system.addComponents({ Text });
    for (const props of [{ size: 'missing' }, { color: 'missing' }, { weight: 'missing' }, { typeSet: 'missing' }]) {
      assert.throws(function () {
        TestRenderer.create(React.createElement(system.Component.Text, props, 'Sample'));
      }, /unknown utility/);
    }
  });

  it('should use legacy metrics for an unknown type set only in lenient mode', function () {
    const system = createSystem(sharedLibs, {}, createCarbonTheme(), 'base');
    system.addComponents({ Text });
    const renderer = TestRenderer.create(React.createElement(system.Component.Text, { typeSet: 'missing' }, 'Sample'));
    const style = StyleSheet.flatten(renderer.root.findByType(RNText).props.style);
    assert.equal(style.fontSize, system.Style.utilities.font_size_md.fontSize);
    renderer.unmount();
  });

});

// ========================= HELPERS ======================================== //

/********************************************************************
Build a system on a theme and register the whole flat component set.

@param {Object} theme - Theme contract

@return {Object} - System object from createSystem
*********************************************************************/
function systemFor (theme) {

  const system = createSystem(sharedLibs, {}, theme, 'base');
  system.addComponents(COMPONENTS);

  // Return the populated system for the caller to inspect
  return system;

}


// ========================= TIER 1 - CONTRACT ENFORCEMENT ================== //

describe('theme contract enforcement', function () {

  it('should build on a complete Carbon theme', function () {

    assert.ok(systemFor(createCarbonTheme()).Style.utilities);

  });

  it('should build on a complete non-Carbon theme', function () {

    assert.ok(systemFor(createContrastTheme()).Style.utilities);

  });

  it('should throw when a required Color token is absent', function () {

    const fixture = createIncompleteTheme();

    assert.throws(function () {
      createSystem(sharedLibs, {}, fixture.theme, 'base');
    }, TypeError);

  });

  it('should name every absent token in a single throw', function () {

    const fixture = createIncompleteTheme();

    try {
      createSystem(sharedLibs, {}, fixture.theme, 'base');
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

  it('should reject an empty-string Color token', function () {

    const theme = createCarbonTheme();
    theme.Color.BORDER = '';

    assert.throws(function () {
      createSystem(sharedLibs, {}, theme, 'base');
    }, TypeError);

  });

  it('should reject a non-string Color token', function () {

    const theme = createCarbonTheme();
    theme.Color.SURFACE = 16;

    assert.throws(function () {
      createSystem(sharedLibs, {}, theme, 'base');
    }, TypeError);

  });

});


// ========================= TIER 1 - THEME AGNOSTICISM ===================== //

describe('theme agnosticism', function () {

  it('should carry the theme color into the font utilities', function () {

    const carbon = systemFor(createCarbonTheme());
    const contrast = systemFor(createContrastTheme());

    assert.strictEqual(carbon.Style.utilities['font_app_primary'].color, '#0f62fe');
    assert.strictEqual(contrast.Style.utilities['font_app_primary'].color, '#7c3aed');

  });

  it('should carry the theme radius into the radius utilities', function () {

    // Carbon is square by specification; the contrast theme is rounded
    const carbon = systemFor(createCarbonTheme());
    const contrast = systemFor(createContrastTheme());

    assert.strictEqual(carbon.Style.utilities['br_md'].borderRadius, 0);
    assert.strictEqual(contrast.Style.utilities['br_md'].borderRadius, 10);

  });

  it('should carry the theme spacing into the padding utilities', function () {

    const carbon = systemFor(createCarbonTheme());
    const contrast = systemFor(createContrastTheme());

    assert.strictEqual(carbon.Style.utilities['p_a_md'].padding, 12);
    assert.strictEqual(contrast.Style.utilities['p_a_md'].padding, 10);

  });

  it('should carry the theme font size and derived line height', function () {

    const carbon = systemFor(createCarbonTheme());
    const contrast = systemFor(createContrastTheme());

    assert.strictEqual(carbon.Style.utilities['font_size_md'].fontSize, 16);
    assert.strictEqual(contrast.Style.utilities['font_size_md'].fontSize, 15);
    assert.notStrictEqual(
      carbon.Style.utilities['font_size_md'].lineHeight,
      contrast.Style.utilities['font_size_md'].lineHeight
    );

  });

  it('should keep pill radius under the Carbon theme', function () {

    // Carbon v11 tags are pill-shaped, so pill is not squared
    assert.strictEqual(
      systemFor(createCarbonTheme()).Style.utilities['br_pill'].borderRadius,
      999
    );

  });

  it('should render the same component differently under each theme', function () {

    // The strongest agnosticism check: identical element, different output.
    // A match here means a component ignored the theme and used a literal.
    const carbon = systemFor(createCarbonTheme());
    const contrast = systemFor(createContrastTheme());

    const underCarbon = TestRenderer.create(
      React.createElement(carbon.Component.Tag, {}, 'tag')
    );
    const underContrast = TestRenderer.create(
      React.createElement(contrast.Component.Tag, {}, 'tag')
    );

    assert.notDeepStrictEqual(underCarbon.toJSON(), underContrast.toJSON());

    underCarbon.unmount();
    underContrast.unmount();

  });

  it('should expose no hardcoded Carbon blue under the contrast theme', function () {

    // #0f62fe is Carbon Blue 60. Under a theme that never declares it, it must
    // not appear anywhere in the generated utilities.
    const contrast = systemFor(createContrastTheme());

    assert.strictEqual(
      JSON.stringify(contrast.Style.utilities).toLowerCase().indexOf('#0f62fe'),
      -1
    );

  });

});


// ========================= TIER 1 - BUTTON TOKEN FAMILY =================== //

describe('button token family', function () {

  // The 15-token Carbon button family. Both REQUIRED_COLOR_TOKENS and
  // BACKGROUND_COLOR_TOKENS must carry every entry, or the drift this plan
  // exists to remove returns.
  const BUTTON_TOKENS = [
    'BUTTON_PRIMARY', 'BUTTON_PRIMARY_HOVER', 'BUTTON_PRIMARY_ACTIVE',
    'BUTTON_SECONDARY', 'BUTTON_SECONDARY_HOVER', 'BUTTON_SECONDARY_ACTIVE',
    'BUTTON_TERTIARY', 'BUTTON_TERTIARY_HOVER', 'BUTTON_TERTIARY_ACTIVE',
    'BUTTON_DANGER_PRIMARY', 'BUTTON_DANGER_HOVER', 'BUTTON_DANGER_ACTIVE',
    'BUTTON_DANGER_SECONDARY', 'BUTTON_DISABLED', 'BUTTON_SEPARATOR'
  ];


  it('should generate a background utility for every BUTTON_* token', function () {

    const sys = systemFor(createCarbonTheme());
    const utilities = sys.Style.utilities;

    for (let i = 0; i < BUTTON_TOKENS.length; i++) {
      const key = 'background_' + BUTTON_TOKENS[i].toLowerCase();
      assert.ok(utilities[key],
        'missing utility "' + key + '"');
    }

  });


  it('should reject a theme missing a BUTTON_* token', function () {

    const theme = createCarbonTheme();
    delete theme.Color.BUTTON_PRIMARY;

    assert.throws(function () {
      createSystem(sharedLibs, {}, theme, 'base');
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('BUTTON_PRIMARY') !== -1;
    });

  });


  it('should carry the button family in the public TOKENS export', function () {

    assert.ok(TOKENS.background, 'TOKENS.background is missing');

    for (let i = 0; i < BUTTON_TOKENS.length; i++) {
      const lower = BUTTON_TOKENS[i].toLowerCase();
      assert.ok(TOKENS.background.indexOf(lower) !== -1,
        'TOKENS.background missing "' + lower + '"');
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

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, createCarbonTheme(), 'base');

    assert.throws(function () {
      // eslint-disable-next-line no-unused-expressions
      sys.Style.utilities['background_app_secondary'];
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('background_app_secondary') !== -1;
    });

  });


  it('should allow a declared utility key in strict mode', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, createCarbonTheme(), 'base');

    const util = sys.Style.utilities['background_app_primary'];
    assert.ok(util, 'declared utility returned falsy');

  });


  it('should tolerate symbol keys in strict mode', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, createCarbonTheme(), 'base');

    // Symbol keys come from React and JS internals; a naive Proxy would throw
    // eslint-disable-next-line no-unused-expressions
    sys.Style.utilities[Symbol.iterator];
    // eslint-disable-next-line no-unused-expressions
    sys.Style.utilities[Symbol.toPrimitive];

    // No throw means pass
    assert.ok(true);

  });


  it('should return undefined for an unknown key in lenient mode', function () {

    const sys = createSystem(sharedLibs, {}, createCarbonTheme(), 'base');

    assert.strictEqual(sys.Style.utilities['background_nonexistent'], undefined);

  });

});
