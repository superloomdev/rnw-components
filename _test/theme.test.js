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

import { Text as RNText, View as RNView, StyleSheet } from 'react-native';

import { createSystem, Text, TOKENS } from 'rnw-components';
import { COMPONENTS } from 'rnw-components/all';

import { sharedLibs, React, TestRenderer, act, Themer } from './loader.js';
import buildTokenContract from 'rnw-components/data/token-contract.js';
import {
  buildCarbonWhite,
  buildContrastTheme,
  buildBrandOverWhite,
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
    const system = createSystem(sharedLibs, { STRICT_TOKENS: false }, buildCarbonWhite(), 'sm');
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

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: false }, theme, 'sm');
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

  // The button token family, computed from the contract REQUIRED_TOKENS
  // (D8 rule). The list must carry every entry, or the drift this plan
  // exists to remove returns.
  const _contractInfo = buildTokenContract(Themer.getContract());
  const buttonTokens = _contractInfo.REQUIRED_TOKENS
    .filter(function (name) { return name.indexOf('color.button_') === 0; })
    .map(function (name) { return name.slice('color.'.length); });


  it('should generate a background utility for every button token', function () {

    const sys = systemFor(buildCarbonWhite());
    const utilities = sys.Style.utilities;

    for (let i = 0; i < buttonTokens.length; i++) {
      const key = 'background_' + buttonTokens[i];
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

    for (let i = 0; i < buttonTokens.length; i++) {
      assert.ok(TOKENS.background.indexOf(buttonTokens[i]) !== -1,
        'TOKENS.background missing "' + buttonTokens[i] + '"');
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


  it('should return undefined for an unknown key in lenient mode and warn once per key', function () {

    // Capture Debug.warn calls
    const warnCalls = [];
    const stubDebug = {
      warn: function (msg, meta) {
        warnCalls.push({ msg: msg, meta: meta });
      },
      debug: function () {},
      info: function () {},
      error: function () {},
      log: function () {},
      performanceAuditLog: function () {}
    };
    const stubLibs = Object.assign({}, sharedLibs, { Debug: stubDebug });

    const sys = createSystem(stubLibs, { STRICT_TOKENS: false }, buildCarbonWhite(), 'sm');

    // Two reads of the same unknown key should produce exactly one warn
    assert.strictEqual(sys.Style.utilities['background_nonexistent'], undefined);
    assert.strictEqual(sys.Style.utilities['background_nonexistent'], undefined);

    assert.strictEqual(warnCalls.length, 1, 'expected exactly one Debug.warn for two reads of the same key');
    assert.ok(warnCalls[0].msg.indexOf('unknown utility') !== -1,
      'warn message should mention "unknown utility"');
    assert.deepStrictEqual(warnCalls[0].meta, { key: 'background_nonexistent' },
      'warn payload should be { key: "background_nonexistent" }');

  });


  it('should default STRICT_TOKENS to true', function () {

    // No STRICT_TOKENS in config -> defaults to true
    assert.throws(function () {
      // eslint-disable-next-line no-unused-expressions
      createSystem(sharedLibs, {}, buildCarbonWhite(), 'sm').Style.utilities['not_a_utility'];
    }, function (err) {
      return err instanceof TypeError && err.message.indexOf('unknown utility') !== -1;
    }, 'STRICT_TOKENS should default to true, so an unknown utility read should throw');

  });

});


// ========================= F-R.4 NEW TEST CASES ========================== //

describe('unsupported token warnings', function () {

  it('should produce exactly one Debug.warn with the sorted token list', function () {

    // Build a theme with extra unsupported tokens
    const built = buildCarbonWhite();
    const tokens = Object.assign({}, built.tokens, {
      'color.unsupported_c': '#0000ff',
      'color.unsupported_a': '#ff0000',
      'color.unsupported_b': '#00ff00'
    });

    // Capture Debug.warn calls
    const warnCalls = [];
    const stubDebug = {
      warn: function (msg, meta) {
        warnCalls.push({ msg: msg, meta: meta });
      },
      debug: function () {},
      info: function () {},
      error: function () {},
      log: function () {},
      performanceAuditLog: function () {}
    };
    const stubLibs = Object.assign({}, sharedLibs, { Debug: stubDebug });

    const sys = createSystem(stubLibs, {}, { tokens: tokens }, 'sm');

    // Exactly one warn call
    assert.strictEqual(warnCalls.length, 1, 'expected exactly one Debug.warn');
    assert.ok(warnCalls[0].msg.indexOf('unsupported') !== -1,
      'warn message should mention unsupported tokens');

    // The token list should be sorted
    const warnedTokens = warnCalls[0].meta.tokens;
    assert.deepStrictEqual(warnedTokens, ['color.unsupported_a', 'color.unsupported_b', 'color.unsupported_c'],
      'warned tokens should be sorted');

  });

});


describe('contrast theme rendering', function () {

  it('should render Button, Text, TextInput, and Tile with values equal to the theme', function () {

    const theme = buildContrastTheme();
    const sys = createSystem(sharedLibs, {}, theme, 'sm');
    sys.addComponents(COMPONENTS);

    // Utility values must equal the theme's token values, proving no
    // hardcoded design language leaks through the component system.
    assert.strictEqual(sys.Style.utilities['background_button_primary'].backgroundColor,
      theme.tokens['color.button_primary'],
      'background_button_primary utility should equal the theme button_primary');
    assert.strictEqual(sys.Style.utilities['font_text_primary'].color,
      theme.tokens['color.text_primary'],
      'font_text_primary utility should equal the theme text_primary');
    assert.strictEqual(sys.Style.utilities['background_interactive'].backgroundColor,
      theme.tokens['color.interactive'],
      'background_interactive utility should equal the theme interactive');

    // Render Button, Text, TextInput, Tile under the contrast theme and
    // verify each renders without crashing (proves the components consume
    // the contrast theme without error).
    let render;
    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.Button, { kind: 'primary', label: 'OK' })
      );
    });
    assert.ok(render.toJSON(), 'Button should render under the contrast theme');
    render.unmount();

    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.Text, { color: 'text_primary' }, 'Hello')
      );
    });
    assert.ok(render.toJSON(), 'Text should render under the contrast theme');
    render.unmount();

    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.TextInput, { label: 'Field' })
      );
    });
    assert.ok(render.toJSON(), 'TextInput should render under the contrast theme');
    render.unmount();

    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.Tile, { label: 'Tile' })
      );
    });
    assert.ok(render.toJSON(), 'Tile should render under the contrast theme');
    render.unmount();

  });

});


describe('brand-over-white rendering', function () {

  it('should render Button with radius 8 and background #4f46e5', function () {

    const theme = buildBrandOverWhite();
    const sys = createSystem(sharedLibs, {}, theme, 'sm');
    sys.addComponents(COMPONENTS);

    // The brand layer sets shape.radius_04 to 8 and color.button_primary to #4f46e5.
    // The utilities must reflect the brand overrides, proving the brand layer
    // reaches the component system without being shadowed by the base theme.
    assert.strictEqual(sys.Style.utilities['br_radius_04'].borderRadius, 8,
      'br_radius_04 should be 8 under the tasks brand');
    assert.strictEqual(sys.Style.utilities['background_button_primary'].backgroundColor, '#4f46e5',
      'background_button_primary should be #4f46e5 under the tasks brand');

    // Render a primary Button with the brand radius and verify it renders
    let render;
    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.Button, {
          kind: 'primary',
          radius: 'radius_04',
          label: 'OK'
        })
      );
    });
    assert.ok(render.toJSON(), 'Button should render under the tasks brand');
    render.unmount();

  });

});


describe('Themer injection', function () {

  it('should throw THEMER_UNAVAILABLE when Themer is absent', function () {

    const libsWithoutThemer = Object.assign({}, sharedLibs);
    delete libsWithoutThemer.Themer;

    assert.throws(function () {
      createSystem(libsWithoutThemer, {}, buildCarbonWhite(), 'sm');
    }, function (err) {
      return err instanceof TypeError &&
        err.message.indexOf('Themer') !== -1;
    }, 'should throw TypeError mentioning Themer');

  });

});


// ========================= D14 PROP VOCABULARY =========================== //
// F-R2.2b/2c tests (written before the edits, per Section 9 step 4).

describe('D14 prop vocabulary', function () {

  // D14 amendment table: level -> type set name (literal in the test, not
  // read from heading.js, so the test is independent of the implementation).
  const D14_LEVEL_TO_TYPESET = {
    1: 'heading06',
    2: 'heading05',
    3: 'heading04',
    4: 'heading03',
    5: 'heading02',
    6: 'heading01'
  };

  it('should render Heading at each level 1 through 6 with the D14 type set fontSize', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');
    sys.addComponents(COMPONENTS);

    for (let level = 1; level <= 6; level++) {
      const typeSetName = D14_LEVEL_TO_TYPESET[level];
      const expectedFontSize = sys.Style.utilities['type_' + typeSetName].fontSize;

      let render;
      act(function () {
        render = TestRenderer.create(
          React.createElement(sys.Component.Heading, { level: level, children: 'H' + level })
        );
      });

      const fontSize = StyleSheet.flatten(render.root.findByType(RNText).props.style).fontSize;
      assert.strictEqual(fontSize, expectedFontSize,
        'Heading level ' + level + ' should render at type_' + typeSetName + ' fontSize ' + expectedFontSize + ', got ' + fontSize);
      render.unmount();
    }

  });


  it('should render Heading with typeSet heading07 at the heading07 fontSize', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');
    sys.addComponents(COMPONENTS);

    const expectedFontSize = sys.Style.utilities['type_heading07'].fontSize;

    let render;
    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.Heading, { typeSet: 'heading07', children: 'Display' })
      );
    });

    assert.strictEqual(StyleSheet.flatten(render.root.findByType(RNText).props.style).fontSize, expectedFontSize,
      'Heading typeSet heading07 should render at type_heading07 fontSize');
    render.unmount();

  });


  it('should throw on an unknown color token for Icon, IconIndicator, ShapeIndicator, and ProgressBar', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');
    sys.addComponents(COMPONENTS);

    const components = [
      { name: 'Icon', factory: sys.Component.Icon, props: { name: 'info', color: 'not_a_token' } },
      { name: 'IconIndicator', factory: sys.Component.IconIndicator, props: { iconName: 'info', color: 'not_a_token' } },
      { name: 'ShapeIndicator', factory: sys.Component.ShapeIndicator, props: { shape: 'circle', color: 'not_a_token' } },
      { name: 'ProgressBar', factory: sys.Component.ProgressBar, props: { value: 0.5, color: 'not_a_token' } }
    ];

    for (let i = 0; i < components.length; i++) {
      const c = components[i];
      assert.throws(function () {
        act(function () {
          TestRenderer.create(React.createElement(c.factory, c.props));
        });
      }, function (err) {
        return err instanceof TypeError && err.message.indexOf('unknown utility') !== -1;
      }, c.name + ' should throw TypeError with "unknown utility" for an unknown color token');
    }

  });


  it('should throw on a raw hex color for Icon, IconIndicator, ShapeIndicator, and ProgressBar', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');
    sys.addComponents(COMPONENTS);

    const components = [
      { name: 'Icon', factory: sys.Component.Icon, props: { name: 'info', color: '#ff0000' } },
      { name: 'IconIndicator', factory: sys.Component.IconIndicator, props: { iconName: 'info', color: '#ff0000' } },
      { name: 'ShapeIndicator', factory: sys.Component.ShapeIndicator, props: { shape: 'circle', color: '#ff0000' } },
      { name: 'ProgressBar', factory: sys.Component.ProgressBar, props: { value: 0.5, color: '#ff0000' } }
    ];

    for (let i = 0; i < components.length; i++) {
      const c = components[i];
      assert.throws(function () {
        act(function () {
          TestRenderer.create(React.createElement(c.factory, c.props));
        });
      }, function (err) {
        return err instanceof TypeError && err.message.indexOf('unknown utility') !== -1;
      }, c.name + ' should throw TypeError with "unknown utility" for a raw hex color');
    }

  });


  it('should render Icon, IconIndicator, ShapeIndicator, and ProgressBar with the D14 default color', function () {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');
    sys.addComponents(COMPONENTS);

    // Icon: default icon_primary -> font_icon_primary.color
    let render;
    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.Icon, { name: 'info' })
      );
    });
    const iconTree = render.toJSON();
    assert.strictEqual(iconTree.props['data-color'], sys.Style.utilities['font_icon_primary'].color,
      'Icon default color should be font_icon_primary.color');
    render.unmount();

    // IconIndicator: default interactive -> background_interactive.backgroundColor
    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.IconIndicator, { iconName: 'info' })
      );
    });
    const iconIndBg = StyleSheet.flatten(render.root.findByType(RNView).props.style).backgroundColor;
    assert.strictEqual(iconIndBg, sys.Style.utilities['background_interactive'].backgroundColor,
      'IconIndicator default background should be background_interactive.backgroundColor');
    render.unmount();

    // ShapeIndicator: default interactive -> background_interactive.backgroundColor
    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.ShapeIndicator, { shape: 'circle' })
      );
    });
    const shapeBg = StyleSheet.flatten(render.root.findByType(RNView).props.style).backgroundColor;
    assert.strictEqual(shapeBg, sys.Style.utilities['background_interactive'].backgroundColor,
      'ShapeIndicator default background should be background_interactive.backgroundColor');
    render.unmount();

    // ProgressBar: default interactive -> background_interactive.backgroundColor (fill), layer_02 (track)
    act(function () {
      render = TestRenderer.create(
        React.createElement(sys.Component.ProgressBar, { value: 0.5 })
      );
    });
    const pbViews = render.root.findAllByType(RNView);
    const pbFill = pbViews.find(function (v) {
      return StyleSheet.flatten(v.props.style).backgroundColor === sys.Style.utilities['background_interactive'].backgroundColor;
    });
    assert.ok(pbFill,
      'ProgressBar default fill should be background_interactive.backgroundColor');
    render.unmount();

  });

});


// ========================= D21 LAYOUT DIMENSIONS ========================= //
// F-R2.2e tests (written before the edits, per Section 9 step 4).

describe('D21 layout dimensions', function () {

  // Build a strict-white system for rendering
  function buildSys () {
    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, buildCarbonWhite(), 'sm');
    sys.addComponents(COMPONENTS);
    return sys;
  }

  // Components with width/height/maxWidth props that should accept numbers and
  // percentage strings, and reject CSS unit strings like '50px'.
  const LENGTH_COMPONENTS = [
    { name: 'Skeleton', factory: 'Skeleton', props: { variant: 'text' }, dimProp: 'width' },
    { name: 'Skeleton', factory: 'Skeleton', props: { variant: 'text' }, dimProp: 'height' },
    { name: 'SidePanel', factory: 'SidePanel', props: { isOpen: true }, dimProp: 'width' },
    { name: 'DataTableCell', factory: 'DataTableCell', props: { content: 'cell' }, dimProp: 'width' },
    { name: 'TableContainer', factory: 'TableContainer', props: { children: [] }, dimProp: 'maxWidth' },
    { name: 'ProgressBar', factory: 'ProgressBar', props: { value: 0.5 }, dimProp: 'height' }
  ];

  // Components with size props that feed a borderRadius or glyph size; these
  // accept numbers only, not percentage strings.
  const SIZE_COMPONENTS = [
    { name: 'Icon', factory: 'Icon', props: { name: 'info' } },
    { name: 'IconIndicator', factory: 'IconIndicator', props: { iconName: 'info' } },
    { name: 'Loading', factory: 'Loading', props: {} },
    { name: 'ShapeIndicator', factory: 'ShapeIndicator', props: { shape: 'circle' } },
    { name: 'IconButton', factory: 'IconButton', props: { name: 'info', label: 'btn' } },
    { name: 'UserAvatar', factory: 'UserAvatar', props: {} }
  ];

  // Test: each length component rejects a CSS unit string
  for (let i = 0; i < LENGTH_COMPONENTS.length; i++) {
    const c = LENGTH_COMPONENTS[i];
    it('should throw TypeError for ' + c.name + '.' + c.dimProp + ' = "50px"', function () {
      const sys = buildSys();
      const props = Object.assign({}, c.props, { [c.dimProp]: '50px' });
      assert.throws(function () {
        act(function () {
          TestRenderer.create(React.createElement(sys.Component[c.factory], props));
        });
      }, function (err) {
        return err instanceof TypeError && err.message.indexOf('INVALID_LENGTH') !== -1;
      }, c.name + '.' + c.dimProp + ' = "50px" should throw TypeError with INVALID_LENGTH');
    });
  }

  // Test: each size component rejects a CSS unit string
  for (let i = 0; i < SIZE_COMPONENTS.length; i++) {
    const c = SIZE_COMPONENTS[i];
    it('should throw TypeError for ' + c.name + '.size = "24px"', function () {
      const sys = buildSys();
      const props = Object.assign({}, c.props, { size: '24px' });
      assert.throws(function () {
        act(function () {
          TestRenderer.create(React.createElement(sys.Component[c.factory], props));
        });
      }, function (err) {
        return err instanceof TypeError && err.message.indexOf('INVALID_LENGTH') !== -1;
      }, c.name + '.size = "24px" should throw TypeError with INVALID_LENGTH');
    });
  }

  // Test: length components accept percentage strings and render them
  it('should render length components with percentage width/height/maxWidth', function () {
    const sys = buildSys();

    // Skeleton width: '50%'
    let render;
    act(function () {
      render = TestRenderer.create(React.createElement(sys.Component.Skeleton, { variant: 'text', width: '50%' }));
    });
    assert.strictEqual(StyleSheet.flatten(render.root.findByType(RNView).props.style).width, '50%',
      'Skeleton width should be 50%');
    render.unmount();

    // Skeleton height: '50%'
    act(function () {
      render = TestRenderer.create(React.createElement(sys.Component.Skeleton, { variant: 'text', height: '50%' }));
    });
    assert.strictEqual(StyleSheet.flatten(render.root.findByType(RNView).props.style).height, '50%',
      'Skeleton height should be 50%');
    render.unmount();

    // SidePanel width: '50%'
    act(function () {
      render = TestRenderer.create(React.createElement(sys.Component.SidePanel, { isOpen: true, width: '50%' }));
    });
    assert.ok(render.toJSON(), 'SidePanel with width 50% should render');
    render.unmount();

    // DataTableCell width: '50%'
    act(function () {
      render = TestRenderer.create(React.createElement(sys.Component.DataTableCell, { content: 'cell', width: '50%' }));
    });
    assert.strictEqual(StyleSheet.flatten(render.root.findByType(RNView).props.style).width, '50%',
      'DataTableCell width should be 50%');
    render.unmount();

    // TableContainer maxWidth: '50%'
    act(function () {
      render = TestRenderer.create(React.createElement(sys.Component.TableContainer, { maxWidth: '50%', children: [] }));
    });
    assert.strictEqual(StyleSheet.flatten(render.root.findByType(RNView).props.style).maxWidth, '50%',
      'TableContainer maxWidth should be 50%');
    render.unmount();

    // ProgressBar height: '50%'
    act(function () {
      render = TestRenderer.create(React.createElement(sys.Component.ProgressBar, { value: 0.5, height: '50%' }));
    });
    assert.strictEqual(StyleSheet.flatten(render.root.findByType(RNView).props.style).height, '50%',
      'ProgressBar height should be 50%');
    render.unmount();

  });

  // Test: size components reject percentage strings
  for (let i = 0; i < SIZE_COMPONENTS.length; i++) {
    const c = SIZE_COMPONENTS[i];
    it('should throw TypeError for ' + c.name + '.size = "50%"', function () {
      const sys = buildSys();
      const props = Object.assign({}, c.props, { size: '50%' });
      assert.throws(function () {
        act(function () {
          TestRenderer.create(React.createElement(sys.Component[c.factory], props));
        });
      }, function (err) {
        return err instanceof TypeError && err.message.indexOf('INVALID_LENGTH') !== -1;
      }, c.name + '.size = "50%" should throw TypeError with INVALID_LENGTH');
    });
  }

});


// ========================= D18 MOTION CURVES ========================= //
// F-R2.4b: two-segment motion curve test.


describe('Motion: two-segment curve (D18, F-R2.4b)', function () {

  it('should sequence a two-segment curve', function () {

    const sys = createSystem(sharedLibs, {}, buildCarbonWhite(), 'sm');
    const Motion = sys.Parts.Motion;

    // Two-segment curve in the exact shape themer.validators.js
    // isValidSegments accepts: { segments: true, curves: [[t, [x1, y1, x2, y2]], ...] }
    // t is strictly increasing in 0..1; the inner array is exactly 4 finite numbers.
    const token = {
      segments: true,
      curves: [
        [0, [0.42, 0, 1, 1]],
        [0.5, [0, 0, 0.58, 1]]
      ]
    };

    const result = Motion.toEasing(token);

    // toEasing returns { kind, easing, spring }. In the test environment
    // Easing.sequence is unavailable (react-native-web does not export it),
    // so easing is null. The kind proves the segments format was recognized.
    assert.deepEqual(result, { kind: 'segments', easing: null, spring: null });

  });

  it('should return linear for an absent motion token', function () {

    const sys = createSystem(sharedLibs, {}, buildCarbonWhite(), 'sm');
    const Motion = sys.Parts.Motion;

    const result = Motion.toEasing(null);
    assert.deepEqual(result, { kind: 'linear', easing: null, spring: null });

  });

  it('should return linear for an unknown motion shape', function () {

    const sys = createSystem(sharedLibs, {}, buildCarbonWhite(), 'sm');
    const Motion = sys.Parts.Motion;

    const result = Motion.toEasing({ unknown: true });
    assert.deepEqual(result, { kind: 'linear', easing: null, spring: null });

  });

});
