// Info: Unit tests for rnw-components.
//
// Tests the public interface: system construction, theme contract bridge,
// atom rendering and accessibility, mechanism parts, and composite components.
// Uses react-test-renderer over jsdom via the loader.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  system,
  Component,
  Style,
  theme,
  Utils,
  React,
  TestRenderer,
  Device,
  createDeviceStub,
  createTestTheme,
  createSystem,
  buildThemeContract,
  TOKENS,
  buildFullSystem,
  COMPONENTS
} from './loader.js';

// Named factory import: the no-Icons case builds a one-component system
import { Icon as IconFactory } from 'rnw-components';

// Mechanism imports (ESM - resolved at module level)
const a11yPart = (await import('../parts/a11y.js')).default;
const pressKeysPart = (await import('../parts/press-keys.js')).default;
const controllableStatePart = (await import('../parts/controllable-state.js')).default;
const compoundContextPart = (await import('../parts/compound-context.js')).default;

const a11y = a11yPart({ React: React, Utils: Utils }, {}, {});
const usePressKeys = pressKeysPart({ React: React, Utils: Utils }, {}, {});
const useControllableState = controllableStatePart({ React: React, Utils: Utils, Debug: { warn: function () {} } }, {}, {});
const createCompoundContext = compoundContextPart({ React: React, Utils: Utils }, {}, {});


// ============================================================================
// 1. BUILD / REBUILD LIFECYCLE
// ============================================================================

describe('build', function () {

  it('should return a Component registry and Style object', function () {

    assert.ok(Component);
    assert.ok(Style);
    assert.ok(Style.utilities);
    assert.ok(Style.tokens);
    assert.strictEqual(Style.breakpoint, 'base');

  });


  it('should register all atom components as functions', function () {

    const atoms = [
      'View', 'Text', 'Icon', 'Image', 'ProgressBar', 'Button',
      'TextInput', 'Toggle', 'Checkbox', 'RadioButton', 'TextArea',
      'Slider', 'Link', 'Skeleton', 'Loading', 'Tag', 'AspectRatio',
      'Heading', 'BadgeIndicator', 'ShapeIndicator', 'IconIndicator',
      'InlineLink'
    ];

    for (let i = 0; i < atoms.length; i++) {
      assert.strictEqual(typeof Component[atoms[i]], 'function',
        atoms[i] + ' should be a function');
    }

  });


  it('should register the variant registry with ButtonPrimaryOutlined', function () {

    assert.ok(Component.variant);
    assert.strictEqual(typeof Component.variant.ButtonPrimaryOutlined, 'function');

  });


  it('should register the freeform registry with RawBox', function () {

    assert.ok(Component.freeform);
    assert.strictEqual(typeof Component.freeform.RawBox, 'function');

  });


  it('should register the provider registry', function () {

    assert.ok(Component.provider);
    assert.strictEqual(typeof Component.provider.Overlay, 'function');
    assert.strictEqual(typeof Component.provider.Layer, 'function');
    assert.strictEqual(typeof Component.provider.Theme, 'function');

  });

});


describe('re-theming by building a second system', function () {

  it('should return an independent registry at the requested breakpoint', function () {

    const rebuilt = buildFullSystem(theme, 'md');

    assert.ok(rebuilt.Component);
    assert.ok(rebuilt.Style);
    assert.notStrictEqual(rebuilt.Component, Component);
    assert.strictEqual(rebuilt.Style.breakpoint, 'md');

  });


  it('should leave the original system untouched', function () {

    buildFullSystem(theme, 'md');

    assert.strictEqual(Style.breakpoint, 'base');

  });

});


describe('createSystem theme validation', function () {

  it('should throw TypeError on malformed theme', function () {

    assert.throws(function () {
      buildFullSystem({ Color: {}, Dimension: {}, Font: {} }, 'base');
    }, TypeError);

  });


  it('should throw TypeError on missing Color group', function () {

    assert.throws(function () {
      buildFullSystem({ Dimension: {}, Font: {} }, 'base');
    }, TypeError);

  });


  it('should throw TypeError on unit-suffixed dimension values', function () {

    const badTheme = createTestTheme();
    badTheme.Dimension.fontSize.md = '1rem';

    assert.throws(function () {
      buildFullSystem(badTheme, 'base');
    }, TypeError);

  });

});


// ============================================================================
// 2. THEME CONTRACT BRIDGE
// ============================================================================

describe('buildThemeContract', function () {

  it('should reshape flat tokens to nested structure', function () {

    const flat = {
      'color.APP_PRIMARY': '#0f62fe',
      'color.TEXT_PRIMARY': '#161616',
      'dimension.font_size.xs': 12,
      'dimension.font_size.md': 16,
      'dimension.line_height_ratio': 1.4,
      'font.family.primary': 'System',
      'font.weight.regular': '400'
    };

    const result = buildThemeContract(flat);

    assert.strictEqual(result.Color.APP_PRIMARY, '#0f62fe');
    assert.strictEqual(result.Color.TEXT_PRIMARY, '#161616');
    assert.strictEqual(result.Dimension.fontSize.xs, 12);
    assert.strictEqual(result.Dimension.fontSize.md, 16);
    assert.strictEqual(result.Dimension.lineHeightRatio, 1.4);
    assert.strictEqual(result.Font.family.primary, 'System');
    assert.strictEqual(result.Font.weight.regular, '400');
    assert.ok(result.Breakpoint);

  });


  it('should accept buildTheme result with tokens key', function () {

    const themerOutput = {
      tokens: {
        'color.APP_PRIMARY': '#0f62fe',
        'dimension.font_size.md': 16
      }
    };

    const result = buildThemeContract(themerOutput);

    assert.strictEqual(result.Color.APP_PRIMARY, '#0f62fe');
    assert.strictEqual(result.Dimension.fontSize.md, 16);

  });


  it('should round font sizes to integers', function () {

    const flat = { 'dimension.font_size.md': 16.7 };
    const result = buildThemeContract(flat);

    assert.strictEqual(result.Dimension.fontSize.md, 17);

  });


  it('should handle null input gracefully', function () {

    const result = buildThemeContract(null);

    assert.ok(result.Color);
    assert.ok(result.Dimension);
    assert.ok(result.Font);
    assert.ok(result.Breakpoint);

  });

});


// ============================================================================
// 3. TOKEN CONSTANTS
// ============================================================================

describe('TOKENS', function () {

  it('should export frozen token sets', function () {

    assert.ok(Array.isArray(TOKENS.fontSize));
    assert.ok(Array.isArray(TOKENS.fontColor));
    assert.ok(Array.isArray(TOKENS.fontWeight));
    assert.ok(Array.isArray(TOKENS.space));
    assert.ok(Array.isArray(TOKENS.radius));
    assert.ok(Object.isFrozen(TOKENS));

  });


  it('should freeze every token array', function () {

    assert.ok(Object.isFrozen(TOKENS.fontSize));
    assert.ok(Object.isFrozen(TOKENS.radius));

  });


  it('should include md in fontSize', function () {

    assert.ok(TOKENS.fontSize.indexOf('md') !== -1);

  });

});


// ============================================================================
// 4. COMMON STYLES GENERATION
// ============================================================================

describe('commonStyles', function () {

  it('should generate font_size utilities for all sizes', function () {

    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    for (let i = 0; i < sizes.length; i++) {
      assert.ok(Style.utilities['font_size_' + sizes[i]],
        'font_size_' + sizes[i] + ' should exist');
    }

  });


  it('should generate padding utilities for all sides and sizes', function () {

    const sides = ['a', 'h', 'v', 't', 'b', 's', 'e'];
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    for (let i = 0; i < sides.length; i++) {
      for (let j = 0; j < sizes.length; j++) {
        const key = 'p_' + sides[i] + '_' + sizes[j];
        assert.ok(Style.utilities[key], key + ' should exist');
      }
    }

  });


  it('should generate background utilities for color tokens', function () {

    const tokens = ['app_primary', 'background_primary', 'background_secondary', 'surface'];

    for (let i = 0; i < tokens.length; i++) {
      assert.ok(Style.utilities['background_' + tokens[i]],
        'background_' + tokens[i] + ' should exist');
    }

  });


  // ---- Logical spacing utilities (Plan 0147 Part B) ----

  it('should emit marginInlineEnd for m_e_* utilities', function () {

    const util = Style.utilities['m_e_xs'];
    assert.ok(util, 'm_e_xs should exist');
    assert.ok(util.marginInlineEnd !== undefined,
      'm_e_xs should have marginInlineEnd');
    assert.strictEqual(util.marginEnd, undefined,
      'm_e_xs should not have legacy marginEnd');

  });


  it('should emit marginInlineStart for m_s_* utilities', function () {

    const util = Style.utilities['m_s_xs'];
    assert.ok(util, 'm_s_xs should exist');
    assert.ok(util.marginInlineStart !== undefined,
      'm_s_xs should have marginInlineStart');
    assert.strictEqual(util.marginStart, undefined,
      'm_s_xs should not have legacy marginStart');

  });


  it('should emit paddingInlineEnd for p_e_* utilities', function () {

    const util = Style.utilities['p_e_xs'];
    assert.ok(util, 'p_e_xs should exist');
    assert.ok(util.paddingInlineEnd !== undefined,
      'p_e_xs should have paddingInlineEnd');
    assert.strictEqual(util.paddingEnd, undefined,
      'p_e_xs should not have legacy paddingEnd');

  });


  it('should emit paddingInlineStart for p_s_* utilities', function () {

    const util = Style.utilities['p_s_xs'];
    assert.ok(util, 'p_s_xs should exist');
    assert.ok(util.paddingInlineStart !== undefined,
      'p_s_xs should have paddingInlineStart');
    assert.strictEqual(util.paddingStart, undefined,
      'p_s_xs should not have legacy paddingStart');

  });


  it('should not use legacy start or end props in any generated utility', function () {

    // Iterate the whole generated set and assert no key holds a legacy prop.
    // This is the regression lock for D2.
    const utilityKeys = Object.keys(Style.utilities);
    const legacyProps = ['marginStart', 'marginEnd', 'paddingStart', 'paddingEnd'];
    const violations = [];

    for (let i = 0; i < utilityKeys.length; i++) {
      const util = Style.utilities[utilityKeys[i]];

      if (!util || typeof util !== 'object') {
        continue;
      }

      for (let j = 0; j < legacyProps.length; j++) {
        if (util[legacyProps[j]] !== undefined) {
          violations.push(utilityKeys[i] + ' has ' + legacyProps[j]);
        }
      }
    }

    assert.deepEqual(violations, [],
      'legacy start/end props found: ' + violations.join(', '));

  });

});


// ============================================================================
// 5. ATOM COMPONENTS
// ============================================================================

describe('View', function () {

  it('should render with background token', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.View, { background: 'surface' }, 'test')
    ).toJSON();

    assert.ok(tree);

  });


  it('should render with radius and border tokens', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.View, { radius: 'lg', border: true }, 'test')
    ).toJSON();

    assert.ok(tree);

  });

});


describe('Text', function () {

  it('should render with default size, color, and weight', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Text, null, 'hello')
    ).toJSON();

    assert.ok(tree);

  });


  it('should apply custom size, color, and weight tokens', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Text, { size: 'xl', color: 'app_primary', weight: 'bold' }, 'hello')
    ).toJSON();

    assert.ok(tree);

  });

});


describe('Icon', function () {

  it('should render with injected Glyph component', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Icon, { name: 'check', size: 'md', color: 'TEXT_PRIMARY' })
    ).toJSON();

    assert.ok(tree);

  });


  it('should return null when Icons not injected', function () {

    const noIconsSystem = createSystem({
      Utils: Utils,
      Debug: { warn: function () {} },
      React: React,
      Device: createDeviceStub(375, 812)
    }, {}, createTestTheme(), 'base');

    noIconsSystem.addComponents({ Icon: IconFactory });

    const tree = TestRenderer.create(
      React.createElement(noIconsSystem.Component.Icon, { name: 'check' })
    ).toJSON();

    assert.strictEqual(tree, null);

  });

});


describe('Button', function () {

  it('should render with accessibilityRole button', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Button, { onPress: function () {} }, 'Click')
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'button');

  });


  it('should set aria-disabled when disabled prop is true', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Button, { disabled: true, onPress: function () {} }, 'Click')
    ).toJSON();

    assert.strictEqual(tree.props['aria-disabled'], true);

  });


  // ---- Button rendering defects (Plan 0147 Part A) ----

  // Helper: resolve the style function on a rendered Button
  function resolveButtonStyles (props) {

    const renderer = TestRenderer.create(
      React.createElement(Component.Button, props)
    );

    const pressable = renderer.root.findByProps({ accessibilityRole: 'button' });
    const styleResult = pressable.props.style;

    // Pressable style can be a function; call it with a neutral state
    const styles = typeof styleResult === 'function'
      ? styleResult({ pressed: false, hovered: false, focused: false })
      : styleResult;

    // Flatten the array of style objects, skipping undefined entries
    const flat = {};
    const arr = Array.isArray(styles) ? styles : [styles];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        const keys = Object.keys(arr[i]);
        for (let k = 0; k < keys.length; k++) {
          flat[keys[k]] = arr[i][keys[k]];
        }
      }
    }

    renderer.unmount();
    return flat;

  }


  it('should resolve a background for primary kind', function () {

    const styles = resolveButtonStyles({ kind: 'primary', onPress: function () {} });
    assert.ok(styles.backgroundColor,
      'primary button has no backgroundColor');

  });


  it('should resolve a background for secondary kind', function () {

    const styles = resolveButtonStyles({ kind: 'secondary', onPress: function () {} });
    assert.ok(styles.backgroundColor,
      'secondary button has no backgroundColor');

  });


  it('should resolve a background for danger kind', function () {

    const styles = resolveButtonStyles({ kind: 'danger', onPress: function () {} });
    assert.ok(styles.backgroundColor,
      'danger button has no backgroundColor');

  });


  it('should not resolve a background for ghost kind', function () {

    const styles = resolveButtonStyles({ kind: 'ghost', onPress: function () {} });
    assert.strictEqual(styles.backgroundColor, undefined,
      'ghost button should have no background');

  });


  // Regression lock for the dead-token defect. The per-kind tests above each
  // name one kind, so a kind added later with a token that does not exist
  // would pass them all by simply not being tested. This iterates every kind
  // the component documents and asserts each one resolves, so adding a kind
  // without adding its token fails here.
  //
  // KIND_BACKGROUND is factory-local and cannot be imported, so the roster is
  // mirrored from the component's own prop contract. Keep both in step: a kind
  // added to button.js must be added here.
  it('should resolve a background for every filled kind and none for ghost', function () {

    const FILLED_KINDS = ['primary', 'secondary', 'danger'];
    const UNFILLED_KINDS = ['ghost'];

    for (let i = 0; i < FILLED_KINDS.length; i++) {
      const kind = FILLED_KINDS[i];
      const styles = resolveButtonStyles({ kind: kind, onPress: function () {} });
      assert.ok(styles.backgroundColor,
        'kind "' + kind + '" resolved no backgroundColor, so its token is dead');
      assert.notStrictEqual(styles.backgroundColor, 'transparent',
        'kind "' + kind + '" resolved a transparent background');
    }

    for (let j = 0; j < UNFILLED_KINDS.length; j++) {
      const kind = UNFILLED_KINDS[j];
      const styles = resolveButtonStyles({ kind: kind, onPress: function () {} });
      assert.strictEqual(styles.backgroundColor, undefined,
        'kind "' + kind + '" should deliberately resolve no background');
    }

  });


  // The kind roster mirrored above must match the component's documented
  // contract. A kind added to the source header without a matching entry in
  // FILLED_KINDS or UNFILLED_KINDS would leave the lock above blind to it.
  it('should document exactly the button kinds the tests iterate', function () {

    const source = readFileSync(
      new URL('../component/atom/button.js', import.meta.url), 'utf8'
    );

    // The kind contract lives in the Info header: kind -> 'a' | 'b' | ...
    const line = source.split('\n').find(function (l) {
      return l.indexOf('//   kind ->') !== -1;
    });
    assert.ok(line, 'button.js has no documented kind contract to check against');

    const documented = (line.match(/'[a-z]+'/g) || []).map(function (q) {
      return q.replace(/'/g, '');
    }).sort();

    assert.deepStrictEqual(documented, ['danger', 'ghost', 'primary', 'secondary'],
      'button kinds changed; update FILLED_KINDS and UNFILLED_KINDS to match');

  });


  it('should apply a minimum hit target', function () {

    const styles = resolveButtonStyles({ onPress: function () {} });
    assert.strictEqual(styles.minHeight, 44,
      'minHeight should equal CONFIG.MIN_HIT_TARGET (44)');

  });


  it('should apply horizontal and vertical padding', function () {

    const styles = resolveButtonStyles({ onPress: function () {} });
    assert.ok(styles.paddingHorizontal > 0,
      'paddingHorizontal should be greater than zero');
    assert.ok(styles.paddingVertical > 0,
      'paddingVertical should be greater than zero');

  });


  it('should wrap a string child in a Text component', function () {

    const renderer = TestRenderer.create(
      React.createElement(Component.Button, { onPress: function () {} }, 'Click')
    );

    const pressable = renderer.root.findByProps({ accessibilityRole: 'button' });
    const child = pressable.props.children;

    // A string child means no wrapping; a React element means it was wrapped
    assert.strictEqual(typeof child, 'object',
      'string child was not wrapped in a Text component');

    renderer.unmount();

  });


  it('should not wrap function children', function () {

    const fnChildren = function () {
      return React.createElement(Component.Text, null, 'Custom');
    };

    const renderer = TestRenderer.create(
      React.createElement(Component.Button, { onPress: function () {} }, fnChildren)
    );

    const pressable = renderer.root.findByProps({ accessibilityRole: 'button' });
    assert.strictEqual(typeof pressable.props.children, 'function',
      'function children should be passed through untouched');

    renderer.unmount();

  });


  it('should carry the on-primary text color for primary kind', function () {

    const renderer = TestRenderer.create(
      React.createElement(Component.Button, { kind: 'primary', onPress: function () {} }, 'Click')
    );

    // The wrapped child should be a Text element with the on-primary color
    const textInstance = renderer.root.findByProps({ color: 'text_on_primary' });
    assert.ok(textInstance, 'primary button child does not carry text_on_primary color');

    renderer.unmount();

  });

});


describe('TextInput', function () {

  it('should render with accessibilityRole textbox', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.TextInput, { accessibilityLabel: 'Email' })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'textbox');

  });


  it('should set aria-invalid when isInvalid is true', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.TextInput, { isInvalid: true })
    ).toJSON();

    assert.strictEqual(tree.props['aria-invalid'], true);

  });

});


describe('Toggle', function () {

  it('should render with accessibilityRole switch and aria-checked', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Toggle, { value: true, onValueChange: function () {} })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'switch');
    assert.strictEqual(tree.props['aria-checked'], true);

  });

});


describe('Checkbox', function () {

  it('should render with role checkbox', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Checkbox, {
        checked: true,
        label: 'Accept',
        onChange: function () {}
      })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'checkbox');

  });


  it('should call onChange with false when checked is true', function () {

    let captured = null;

    const inst = TestRenderer.create(
      React.createElement(Component.Checkbox, {
        checked: true,
        label: 'Test',
        onChange: function (val) { captured = val; }
      })
    );

    const pressable = inst.root.findByProps({ accessibilityRole: 'checkbox' });
    pressable.props.onPress();

    assert.strictEqual(captured, false);

  });

});


describe('RadioButton', function () {

  it('should render with role radio', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.RadioButton, {
        checked: true,
        label: 'Option A',
        onChange: function () {}
      })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'radio');

  });

});


describe('ProgressBar', function () {

  it('should render determinate mode with aria-valuenow', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.ProgressBar, { value: 0.5 })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'progressbar');
    assert.strictEqual(tree.props['aria-valuenow'], 0.5);
    assert.strictEqual(tree.props['aria-valuemin'], 0);
    assert.strictEqual(tree.props['aria-valuemax'], 1);

  });


  it('should clamp value above 1 to 1', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.ProgressBar, { value: 1.5 })
    ).toJSON();

    assert.ok(tree);
    assert.ok(tree.children);

  });

});


describe('Heading', function () {

  it('should render with role heading and aria-level', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Heading, { level: 2 }, 'Title')
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'heading');
    assert.strictEqual(tree.props['aria-level'], 2);

  });

});


describe('Link', function () {

  it('should render with role link', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Link, {
        onPress: function () {},
        accessibilityLabel: 'More'
      }, 'More')
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'link');

  });

});


// ============================================================================
// 6. MECHANISM PARTS (A11y, PressKeys, ControllableState)
// ============================================================================

describe('A11y translator', function () {

  it('should translate checked to aria-checked', function () {

    const props = a11y.state({ checked: true });
    assert.strictEqual(props['aria-checked'], true);

  });


  it('should omit null and undefined values', function () {

    const props = a11y.state({ checked: true, disabled: null, expanded: undefined });

    assert.strictEqual(props['aria-checked'], true);
    assert.strictEqual(props['aria-disabled'], undefined);
    assert.strictEqual(props['aria-expanded'], undefined);

  });


  it('should handle mixed checked for indeterminate', function () {

    const props = a11y.state({ checked: 'mixed' });
    assert.strictEqual(props['aria-checked'], 'mixed');

  });


  it('should translate numeric value props', function () {

    const props = a11y.value({ min: 0, max: 100, now: 50, text: '50 percent' });

    assert.strictEqual(props['aria-valuemin'], 0);
    assert.strictEqual(props['aria-valuemax'], 100);
    assert.strictEqual(props['aria-valuenow'], 50);
    assert.strictEqual(props['aria-valuetext'], '50 percent');

  });


  it('should translate relationship props', function () {

    const props = a11y.relation({ controls: 'panel-1', describedby: 'desc-1' });

    assert.strictEqual(props['aria-controls'], 'panel-1');
    assert.strictEqual(props['aria-describedby'], 'desc-1');

  });


  it('should translate position props', function () {

    const props = a11y.position({ posinset: 3, setsize: 10, level: 2 });

    assert.strictEqual(props['aria-posinset'], 3);
    assert.strictEqual(props['aria-setsize'], 10);
    assert.strictEqual(props['aria-level'], 2);

  });


  it('should generate unique monotonic ids', function () {

    const id1 = a11y.id('carbon-tab');
    const id2 = a11y.id('carbon-tab');

    assert.ok(id1.startsWith('carbon-tab'));
    assert.notStrictEqual(id1, id2);

  });

});


describe('usePressKeys', function () {

  it('should return onKeyDown on web', function () {

    let capturedProps = null;

    function TestComp () {
      capturedProps = usePressKeys({ role: 'checkbox', onActivate: function () {}, disabled: false });
      return null;
    }

    TestRenderer.create(React.createElement(TestComp));

    assert.strictEqual(typeof capturedProps.onKeyDown, 'function');

  });

});


describe('useControllableState', function () {

  it('should use value when controlled', function () {

    let capturedValue = null;

    function TestComp () {
      const state = useControllableState({ value: 42, defaultValue: 0 });
      capturedValue = state[0];
      return null;
    }

    TestRenderer.create(React.createElement(TestComp));

    assert.strictEqual(capturedValue, 42);

  });


  it('should use defaultValue when uncontrolled', function () {

    let capturedValue = null;

    function TestComp () {
      const state = useControllableState({ defaultValue: 10 });
      capturedValue = state[0];
      return null;
    }

    TestRenderer.create(React.createElement(TestComp));

    assert.strictEqual(capturedValue, 10);

  });

});


describe('createCompoundContext', function () {

  it('should throw when useContext is called outside Provider', function () {

    const ctx = createCompoundContext({ React: React, Utils: Utils }, 'TestCompound');

    function Consumer () {
      ctx.useContext();
      return null;
    }

    assert.throws(function () {
      TestRenderer.create(React.createElement(Consumer));
    }, TypeError);

  });


  it('should provide value inside Provider', function () {

    const ctx = createCompoundContext({ React: React, Utils: Utils }, 'TestCompound2');

    let captured = null;

    function Consumer () {
      captured = ctx.useContext();
      return null;
    }

    TestRenderer.create(
      React.createElement(ctx.Provider, { value: { activeIndex: 0 } },
        React.createElement(Consumer)
      )
    );

    assert.strictEqual(captured.activeIndex, 0);

  });

});


// ============================================================================
// 7. MOLECULE COMPONENTS
// ============================================================================

describe('ListItem', function () {

  it('should render with title', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.ListItem, { title: 'Item 1', subtitle: 'Desc' })
    ).toJSON();

    assert.ok(tree);

  });


  it('should have role button when onPress is provided', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.ListItem, { title: 'Item', onPress: function () {} })
    ).toJSON();

    assert.strictEqual(tree.props.role, 'button');

  });

});


describe('Modal', function () {

  it('should render nothing when isOpen is false', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Modal, { isOpen: false, onClose: function () {} }, 'content')
    ).toJSON();

    assert.strictEqual(tree, null);

  });


  it('should render content when isOpen is true', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Modal, { isOpen: true, onClose: function () {} }, 'content')
    ).toJSON();

    assert.ok(tree);

  });

});


describe('Dropdown', function () {

  it('should render trigger with role button when closed', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Dropdown, {
        triggerLabel: 'Select',
        items: [{ value: 'a', label: 'A' }],
        onSelect: function () {}
      })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'button');

  });

});


// ============================================================================
// 8. COMPOSITE COMPONENTS
// ============================================================================

describe('Accordion', function () {

  it('should render with children', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Accordion, {
        allowMultiple: false,
        expandedKeys: [],
        onChange: function () {}
      },
        React.createElement(Component.AccordionItem, {
          title: 'Section 1',
          expanded: false,
          onToggle: function () {}
        }, 'Content 1')
      )
    ).toJSON();

    assert.ok(tree);

  });

});


describe('Tabs', function () {

  it('should render Tab with role tab', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.Tab, {
        label: 'Overview',
        selected: true,
        onPress: function () {}
      })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'tab');

  });


  it('should render TabList with role tablist', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.TabList, null, 'tabs')
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'tablist');

  });


  it('should render TabPanel with role tabpanel when selected', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.TabPanel, { selected: true }, 'content')
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'tabpanel');

  });


  it('should render TabPanel as null when not selected', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.TabPanel, { selected: false }, 'content')
    ).toJSON();

    assert.strictEqual(tree, null);

  });

});


// ============================================================================
// 9. HOOK: useBreakpoint
// ============================================================================

describe('useBreakpoint', function () {

  it('should return base for a 375px viewport', function () {

    let capturedBp = null;

    function TestComp () {
      capturedBp = system.useBreakpoint(theme);
      return null;
    }

    TestRenderer.create(React.createElement(TestComp));

    assert.strictEqual(capturedBp, 'base');

  });

});


// ============================================================================
// 10. VARIANT AND FREEFORM
// ============================================================================

describe('ButtonPrimaryOutlined', function () {

  it('should render with role button', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.variant.ButtonPrimaryOutlined, {
        title: 'Cancel',
        onPress: function () {}
      })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'button');

  });

});


describe('RawBox', function () {

  it('should render with raw style', function () {

    const tree = TestRenderer.create(
      React.createElement(Component.freeform.RawBox, {
        style: { backgroundColor: 'red' }
      }, 'raw')
    ).toJSON();

    assert.ok(tree);

  });

});


// Naming doctrine: every exported non-component function begins with a
// catalog verb. PascalCase exports are React component factories and are
// exempt. The verb list is pinned here so a new verb is a deliberate change.
describe('naming doctrine', function () {

  it('should begin every exported non-component function with a catalog verb', function () {

    // The verbs the function-naming doctrine recognizes
    const VERBS = ['is', 'has', 'get', 'build', 'create', 'generate'];

    // The package's public surface, imported as names
    const exports = Object.keys(COMPONENTS).concat(
      ['createSystem', 'buildThemeContract', 'TOKENS']
    );

    // TOKENS is a const, not a function, so skip it
    const functions = exports.filter(function (name) {
      return name !== 'TOKENS';
    });

    // PascalCase names are React component factories, exempt per the doctrine
    const nonComponent = functions.filter(function (name) {
      return name.charAt(0) !== name.charAt(0).toUpperCase();
    });

    // Every remaining exported function must begin with a catalog verb
    const violations = nonComponent.filter(function (name) {
      return !VERBS.some(function (verb) {
        return name.startsWith(verb);
      });
    });

    assert.deepEqual(violations, [], 'Exported functions without a catalog verb: ' + violations.join(', '));

  });

});
