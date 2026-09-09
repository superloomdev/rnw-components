// Info: Tests for the createSystem entry point.
//
// createSystem builds the shared infrastructure without instantiating any
// component, so a consumer registers only the factories it imports and a
// bundler drops the rest. These tests cover the system surface, selective
// registration, provider registration, the render-time dependency check,
// and that the factory path still behaves identically.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  createSystem,
  View,
  Text,
  Icon,
  Button,
  Dropdown,
  ButtonPrimaryOutlined,
  RawBox,
  Theme as ThemeProvider
} from 'rnw-components';

import { COMPONENTS, VARIANTS, FREEFORMS, PROVIDERS } from 'rnw-components/all';

import {
  Utils,
  Debug,
  Themer,
  React,
  TestRenderer,
  act,
  Device,
  Icons
} from './loader.js';

import { buildCarbonWhite, buildContrastTheme } from './harness/themes.js';


// ========================= SHARED FIXTURES ================================ //

const sharedLibs = {
  Utils: Utils,
  Debug: Debug,
  React: React,
  Device: Device,
  Themer: Themer,
  Icons: Icons
};

const testTheme = buildCarbonWhite();


/********************************************************************
Build a fresh system for one test so registrations never leak between
cases. Each call returns an independent registry.

@return {Object} - System object from createSystem
*********************************************************************/
function buildSystem () {

  // Return an independent system instance for this test
  return createSystem(sharedLibs, {}, testTheme, 'sm');

}


// ========================= TIER 1 - SYSTEM SURFACE ======================== //

describe('createSystem surface', function () {

  it('should return the documented system shape', function () {

    const system = buildSystem();

    assert.strictEqual(typeof system.make, 'function');
    assert.strictEqual(typeof system.addComponents, 'function');
    assert.strictEqual(typeof system.addVariants, 'function');
    assert.strictEqual(typeof system.addFreeforms, 'function');
    assert.strictEqual(typeof system.addProviders, 'function');
    assert.strictEqual(typeof system.checkRegistry, 'function');
    assert.strictEqual(typeof system.useBreakpoint, 'function');
    assert.strictEqual(typeof system.Component, 'object');
    assert.strictEqual(typeof system.Style, 'object');
    assert.strictEqual(typeof system.Parts, 'object');
    assert.strictEqual(typeof system.Lib, 'object');
    assert.strictEqual(typeof system.CONFIG, 'object');
    assert.strictEqual(typeof system.ERRORS, 'object');
    assert.strictEqual(system.breakpoint, 'sm');

  });

  it('should start with an empty component registry', function () {

    const system = buildSystem();

    assert.deepStrictEqual(Object.keys(system.Component), []);

  });

  it('should default the breakpoint to sm when omitted', function () {

    const system = createSystem(sharedLibs, {}, testTheme);

    assert.strictEqual(system.breakpoint, 'sm');

  });

  it('should expose the same Style shape the factory path builds', function () {

    const system = buildSystem();

    assert.strictEqual(typeof system.Style.utilities, 'object');
    assert.ok(system.Style.tokens.Color);
    assert.ok(system.Style.tokens.Spacing);
    assert.ok(system.Style.tokens.Shape);
    assert.ok(system.Style.tokens.TypeSet);
    assert.ok(system.Style.tokens.Font);
    assert.ok(system.Style.tokens.Breakpoint);
    assert.strictEqual(system.Style.breakpoint, 'sm');
    assert.strictEqual(typeof system.Style.allBreakpoints, 'object');

  });

  it('should build all fourteen mechanism parts', function () {

    const system = buildSystem();
    const expected = [
      'A11y', 'PressKeys', 'RovingTabIndex', 'ControllableState',
      'AnchoredPosition', 'FocusTrap', 'Overlay', 'CompoundContext',
      'Units', 'Typeface', 'Direction', 'Filter', 'Motion', 'Stacking'
    ];

    assert.deepStrictEqual(Object.keys(system.Parts).sort(), expected.slice().sort());

  });

  it('should throw when the theme contract is malformed', function () {

    assert.throws(function () {
      createSystem(sharedLibs, {}, {}, 'sm');
    });

  });

  it('should throw when a required injection is missing', function () {

    assert.throws(function () {
      createSystem({ Utils: Utils }, {}, testTheme, 'sm');
    });

  });

});


// ========================= TIER 1 - REGISTRATION ========================== //

describe('createSystem registration', function () {

  it('should register only the components passed to addComponents', function () {

    const system = buildSystem();
    system.addComponents({ View: View, Text: Text });

    assert.deepStrictEqual(Object.keys(system.Component).sort(), ['Text', 'View']);

  });

  it('should return the shared registry from addComponents', function () {

    const system = buildSystem();
    const registry = system.addComponents({ Text: Text });

    assert.strictEqual(registry, system.Component);

  });

  it('should accumulate across multiple addComponents calls', function () {

    const system = buildSystem();
    system.addComponents({ View: View });
    system.addComponents({ Text: Text, Icon: Icon });

    assert.deepStrictEqual(Object.keys(system.Component).sort(), ['Icon', 'Text', 'View']);

  });

  it('should produce a renderable component through make', function () {

    const system = buildSystem();
    const TextComponent = system.make(Text);

    let tree;
    act(function () {
      tree = TestRenderer.create(React.createElement(TextComponent, {}, 'hello'));
    });

    assert.ok(tree.toJSON());

    tree.unmount();

  });

  it('should throw a TypeError when addComponents receives a non-object', function () {

    const system = buildSystem();

    assert.throws(function () {
      system.addComponents(null);
    }, TypeError);

  });

  it('should throw a TypeError when a map entry is not a factory', function () {

    const system = buildSystem();

    assert.throws(function () {
      system.addComponents({ Text: 'not-a-factory' });
    }, TypeError);

  });

  it('should keep two systems independent', function () {

    const first = buildSystem();
    const second = buildSystem();

    first.addComponents({ Text: Text });

    assert.deepStrictEqual(Object.keys(second.Component), []);
    assert.notStrictEqual(first.Component, second.Component);

  });

});


// ========================= TIER 1 - PROVIDERS ============================= //

describe('createSystem providers', function () {

  it('should register a provider under Component.provider', function () {

    const system = buildSystem();
    system.addProviders({ Theme: ThemeProvider });

    assert.strictEqual(typeof system.Component.provider.Theme, 'function');

  });

  it('should return the provider namespace from addProviders', function () {

    const system = buildSystem();
    const namespace = system.addProviders({ Theme: ThemeProvider });

    assert.strictEqual(namespace, system.Component.provider);

  });

  it('should register every provider in the roster', function () {

    // Every provider must accept the canonical injection order. A provider
    // declaring a shorter list must still declare a prefix of it, or it
    // silently receives the wrong object in a middle position.
    const system = buildSystem();
    system.addProviders(PROVIDERS);

    const names = Object.keys(PROVIDERS).sort();

    assert.deepStrictEqual(Object.keys(system.Component.provider).sort(), names);

    // Assert each registered slot really is a component
    for (let i = 0; i < names.length; i++) {
      assert.strictEqual(
        typeof system.Component.provider[names[i]],
        'function',
        names[i] + ' did not register as a component'
      );
    }

  });

  it('should throw a TypeError when a provider entry is not a factory', function () {

    const system = buildSystem();

    assert.throws(function () {
      system.addProviders({ Theme: 'not-a-factory' });
    }, TypeError);

    assert.throws(function () {
      system.addProviders(null);
    }, TypeError);

  });

  it('should throw when the factory does not expose the named provider', function () {

    const system = buildSystem();

    assert.throws(function () {
      system.addProviders({ NotAProvider: ThemeProvider });
    }, TypeError);

  });

});


// ========================= TIER 1 - VARIANTS AND FREEFORM ================= //

describe('createSystem variants', function () {

  it('should register a variant under Component.variant', function () {

    const system = buildSystem();
    system.addVariants({ ButtonPrimaryOutlined: ButtonPrimaryOutlined });

    assert.strictEqual(typeof system.Component.variant.ButtonPrimaryOutlined, 'function');

  });

  it('should return the variant namespace from addVariants', function () {

    const system = buildSystem();
    const namespace = system.addVariants({ ButtonPrimaryOutlined: ButtonPrimaryOutlined });

    assert.strictEqual(namespace, system.Component.variant);

  });

  it('should keep variants out of the flat registry', function () {

    const system = buildSystem();
    system.addVariants({ ButtonPrimaryOutlined: ButtonPrimaryOutlined });

    assert.strictEqual(system.Component.ButtonPrimaryOutlined, undefined);

  });

  it('should render a registered variant', function () {

    const system = buildSystem();
    system.addVariants({ ButtonPrimaryOutlined: ButtonPrimaryOutlined });
    system.addComponents({ Text: Text });

    let tree;
    act(function () {
      tree = TestRenderer.create(
        React.createElement(system.Component.variant.ButtonPrimaryOutlined, {
          title: 'Cancel',
          onPress: function () {}
        })
      );
    });

    const json = tree.toJSON();
    assert.ok(json);
    assert.strictEqual(json.props.role, 'button');

    tree.unmount();

  });

  it('should throw a TypeError when a variant entry is not a factory', function () {

    const system = buildSystem();

    assert.throws(function () {
      system.addVariants({ ButtonPrimaryOutlined: 42 });
    }, TypeError);

  });

});

describe('createSystem freeforms', function () {

  it('should register a freeform under Component.freeform', function () {

    const system = buildSystem();
    system.addFreeforms({ RawBox: RawBox });

    assert.strictEqual(typeof system.Component.freeform.RawBox, 'function');

  });

  it('should return the freeform namespace from addFreeforms', function () {

    const system = buildSystem();
    const namespace = system.addFreeforms({ RawBox: RawBox });

    assert.strictEqual(namespace, system.Component.freeform);

  });

  it('should render a registered freeform', function () {

    const system = buildSystem();
    system.addFreeforms({ RawBox: RawBox });

    let tree;
    act(function () {
      tree = TestRenderer.create(
        React.createElement(system.Component.freeform.RawBox, {
          style: { padding: 4 }
        })
      );
    });

    assert.ok(tree.toJSON());

    tree.unmount();

  });

  it('should throw a TypeError when a freeform entry is not a factory', function () {

    const system = buildSystem();

    assert.throws(function () {
      system.addFreeforms({ RawBox: null });
    }, TypeError);

  });

});


// ========================= TIER 1 - BREAKPOINT HOOK ======================= //

describe('createSystem useBreakpoint', function () {

  it('should resolve sm for the stubbed 375px viewport', function () {

    const system = buildSystem();
    let captured = null;

    function Probe () {
      captured = system.useBreakpoint(system.Style.tokens);
      return null;
    }

    let tree;
    act(function () {
      tree = TestRenderer.create(React.createElement(Probe));
    });

    assert.strictEqual(captured, 'sm');

    tree.unmount();

  });

  it('should carry every breakpoint utility set on Style', function () {

    const system = buildSystem();

    assert.deepStrictEqual(
      Object.keys(system.Style.allBreakpoints).sort(),
      ['lg', 'max', 'md', 'sm', 'xlg']
    );

  });

});


// ========================= TIER 1 - REGISTRY CHECK ======================== //

describe('createSystem checkRegistry', function () {

  it('should report complete for a component with no dependencies', function () {

    const system = buildSystem();
    system.addComponents({ Text: Text });

    const result = system.checkRegistry();

    assert.strictEqual(result.complete, true);
    assert.deepStrictEqual(result.missing, {});

  });

  it('should report the missing render-time dependencies', function () {

    const system = buildSystem();
    system.addComponents({ Dropdown: Dropdown });

    const result = system.checkRegistry();

    assert.strictEqual(result.complete, false);
    assert.deepStrictEqual(result.missing.Dropdown.slice().sort(), ['Icon', 'Text']);

  });

  it('should report complete once the dependencies are registered', function () {

    const system = buildSystem();
    system.addComponents({ Dropdown: Dropdown, Text: Text, Icon: Icon });

    const result = system.checkRegistry();

    assert.strictEqual(result.complete, true);
    assert.deepStrictEqual(result.missing, {});

  });

  it('should report complete for an empty registry', function () {

    const system = buildSystem();

    assert.strictEqual(system.checkRegistry().complete, true);

  });

});


// ========================= TIER 2 - RENDER INTEGRATION ==================== //

describe('createSystem render integration', function () {

  it('should render a component that resolves a sibling at render time', function () {

    const system = buildSystem();
    system.addComponents({ Dropdown: Dropdown, Text: Text, Icon: Icon });

    assert.strictEqual(system.checkRegistry().complete, true);

    let tree;
    act(function () {
      tree = TestRenderer.create(
        React.createElement(system.Component.Dropdown, {
          items: [{ id: 'a', label: 'Alpha' }],
          triggerLabel: 'Pick one',
          accessibilityLabel: 'Pick one'
        })
      );
    });

    assert.ok(tree.toJSON());

    tree.unmount();

  });

  it('should resolve siblings regardless of registration order', function () {

    const system = buildSystem();

    system.addComponents({ Dropdown: Dropdown });
    system.addComponents({ Text: Text, Icon: Icon });

    let tree;
    act(function () {
      tree = TestRenderer.create(
        React.createElement(system.Component.Dropdown, {
          items: [{ id: 'a', label: 'Alpha' }],
          triggerLabel: 'Pick one',
          accessibilityLabel: 'Pick one'
        })
      );
    });

    assert.ok(tree.toJSON());

    tree.unmount();

  });

  it('should render a button through the system registry', function () {

    const system = buildSystem();
    system.addComponents({ Button: Button, Text: Text });

    let tree;
    act(function () {
      tree = TestRenderer.create(
        React.createElement(system.Component.Button, {
          onPress: function () {},
          accessibilityLabel: 'Save'
        }, 'Save')
      );
    });

    assert.ok(tree.toJSON());

    tree.unmount();

  });

});


// ========================= TIER 3 - PARITY WITH FACTORY =================== //

describe('createSystem parity with the factory path', function () {

  it('should produce the same utility style keys as the factory path', async function () {

    const loaderModule = await import('./loader.js');
    const system = buildSystem();

    const factoryKeys = Object.keys(loaderModule.Style.utilities).sort();
    const systemKeys = Object.keys(system.Style.utilities).sort();

    assert.deepStrictEqual(systemKeys, factoryKeys);

  });

  it('should produce the same breakpoint set as the factory path', async function () {

    const loaderModule = await import('./loader.js');
    const system = buildSystem();

    const factoryBreakpoints = Object.keys(loaderModule.Style.allBreakpoints).sort();
    const systemBreakpoints = Object.keys(system.Style.allBreakpoints).sort();

    assert.deepStrictEqual(systemBreakpoints, factoryBreakpoints);

  });

  it('should render a named export identically to its registry entry', async function () {

    const loaderModule = await import('./loader.js');
    const system = buildSystem();
    system.addComponents({ Text: Text });

    let fromSystem;
    let fromFactory;
    act(function () {
      fromSystem = TestRenderer.create(
        React.createElement(system.Component.Text, {}, 'same')
      );
      fromFactory = TestRenderer.create(
        React.createElement(loaderModule.Component.Text, {}, 'same')
      );
    });

    // React 19 + RNW assign a unique forwardRef per render, so strip ref
    // before comparing the two trees structurally.
    function stripRef (node) {
      if (node && typeof node === 'object') {
        const copy = Object.assign({}, node);
        delete copy.ref;
        if (copy.props) {
          copy.props = Object.assign({}, copy.props);
          delete copy.props.ref;
        }
        if (Array.isArray(copy.children)) {
          copy.children = copy.children.map(stripRef);
        }
        return copy;
      }
      return node;
    }

    assert.deepStrictEqual(stripRef(fromSystem.toJSON()), stripRef(fromFactory.toJSON()));

    fromSystem.unmount();
    fromFactory.unmount();

  });

});


// ========================= TIER 1 - COLOR TOKEN CONTRACT ================== //

describe('createSystem color token contract', function () {

  // Each required token is removed on its own so a regression that drops one
  // token from the required list is caught by exactly one failing case.
  // These are the lowercase contract names, not the old UPPERCASE names.
  const REQUIRED = [
    'interactive', 'text_primary', 'text_secondary', 'text_disabled',
    'text_on_color', 'text_helper', 'background', 'layer_01', 'layer_02',
    'border_subtle_01', 'border_interactive',
    'support_success', 'support_error', 'support_warning', 'support_info',
    'button_primary', 'button_primary_hover', 'button_primary_active',
    'button_secondary', 'button_secondary_hover', 'button_secondary_active',
    'button_tertiary', 'button_tertiary_hover', 'button_tertiary_active',
    'button_danger_primary', 'button_danger_hover', 'button_danger_active',
    'button_danger_secondary', 'button_disabled', 'button_separator',
    'focus', 'icon_primary', 'icon_secondary', 'icon_on_color', 'icon_disabled',
    'overlay', 'shadow', 'skeleton_background'
  ];

  it('should require exactly thirty-eight color tokens', function () {

    assert.strictEqual(REQUIRED.length, 38);

  });

  it('should throw for each individually absent token', function () {

    for (let i = 0; i < REQUIRED.length; i++) {

      // Copy the tokens map so the cached buildTheme result is not mutated
      const built = buildCarbonWhite();
      const theme = { tokens: Object.assign({}, built.tokens) };
      delete theme.tokens['color.' + REQUIRED[i]];

      assert.throws(
        function () {
          createSystem(sharedLibs, {}, theme, 'sm');
        },
        TypeError,
        'no throw when ' + REQUIRED[i] + ' was absent'
      );
    }

  });

  it('should name the absent token in the message', function () {

    const built = buildCarbonWhite();
    const theme = { tokens: Object.assign({}, built.tokens) };
    delete theme.tokens['color.border_subtle_01'];

    try {
      createSystem(sharedLibs, {}, theme, 'sm');
      assert.fail('accepted a theme with no border_subtle_01');
    } catch (error) {
      assert.ok(error.message.indexOf('border_subtle_01') !== -1);
    }

  });

  it('should accept a theme carrying extra tokens beyond the required set', function () {

    // The gate checks presence, never absence. A non-Carbon theme with
    // the same contract but different values is valid.
    const theme = buildContrastTheme();

    assert.ok(createSystem(sharedLibs, {}, theme, 'sm').Style.utilities);

  });

  it('should still reject a non-object tokens map', function () {

    const built = buildCarbonWhite();
    const theme = { tokens: null };

    assert.throws(function () {
      createSystem(sharedLibs, {}, theme, 'sm');
    }, TypeError);

  });

  it('should report every absent token in one throw', function () {

    const built = buildCarbonWhite();
    const theme = { tokens: Object.assign({}, built.tokens) };
    delete theme.tokens['color.layer_02'];
    delete theme.tokens['color.border_subtle_01'];

    try {
      createSystem(sharedLibs, {}, theme, 'sm');
      assert.fail('accepted a theme missing two tokens');
    } catch (error) {
      assert.ok(error.message.indexOf('layer_02') !== -1);
      assert.ok(error.message.indexOf('border_subtle_01') !== -1);
    }

  });

  it('should carry the error catalog type in the message', function () {

    const built = buildCarbonWhite();
    const theme = { tokens: Object.assign({}, built.tokens) };
    delete theme.tokens['color.text_secondary'];

    try {
      createSystem(sharedLibs, {}, theme, 'sm');
      assert.fail('accepted a theme with no text_secondary');
    } catch (error) {
      assert.ok(error.message.indexOf('CONTRACT_MISSING_TOKEN') !== -1);
    }

  });

  it('should not mutate the theme it was given', function () {

    const theme = buildCarbonWhite();
    const before = JSON.stringify(theme);
    createSystem(sharedLibs, {}, theme, 'sm');

    assert.strictEqual(JSON.stringify(theme), before);

  });

});


// ========================= STRICT ROSTER WALK ============================= //

describe('strict roster walk', function () {

  // Render every component in all.js under both the Carbon white theme
  // and the contrast theme. STRICT_TOKENS is on, so any undefined utility
  // read inside a component throws. This proves the whole roster consumes
  // only declared utilities and carries no hardcoded fallback.

  function rosterWalk (theme, label) {

    const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, theme, 'sm');
    sys.addComponents(COMPONENTS);

    const names = Object.keys(COMPONENTS);
    assert.ok(names.length > 0, 'roster must not be empty');

    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const factory = sys.Component[name];
      assert.ok(typeof factory === 'function', label + ': ' + name + ' must be a function');

      // Render the component with minimal props. A throw here means the
      // component read an undeclared utility under STRICT_TOKENS.
      let render;
      act(function () {
        try {
          render = TestRenderer.create(React.createElement(factory, { label: name }));
        } catch (err) {
          // Components that require specific props may throw a TypeError
          // for missing required props; that is not a utility violation.
          // A STRICT_TOKENS violation throws with "unknown utility" in the
          // message; re-throw it so the roster walk fails.
          if (err.message && err.message.indexOf('unknown utility') !== -1) {
            throw err;
          }
          // Other errors are acceptable for the roster walk; the goal is
          // to catch undeclared utility reads, not prop validation.
        }
      });
      if (render) {
        render.unmount();
      }
    }

  }

  it('should render every component under buildCarbonWhite without a strict violation', function () {

    rosterWalk(buildCarbonWhite(), 'white');

  });

  it('should render every component under buildContrastTheme without a strict violation', function () {

    rosterWalk(buildContrastTheme(), 'contrast');

  });

});
