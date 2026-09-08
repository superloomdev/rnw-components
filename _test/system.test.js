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
  React,
  TestRenderer,
  Device,
  Icons,
  createTestTheme
} from './loader.js';


// ========================= SHARED FIXTURES ================================ //

const sharedLibs = {
  Utils: Utils,
  Debug: Debug,
  React: React,
  Device: Device,
  Icons: Icons
};

const testTheme = createTestTheme();


/********************************************************************
Build a fresh system for one test so registrations never leak between
cases. Each call returns an independent registry.

@return {Object} - System object from createSystem
*********************************************************************/
function buildSystem () {

  // Return an independent system instance for this test
  return createSystem(sharedLibs, {}, testTheme, 'base');

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
    assert.strictEqual(system.breakpoint, 'base');

  });

  it('should start with an empty component registry', function () {

    const system = buildSystem();

    assert.deepStrictEqual(Object.keys(system.Component), []);

  });

  it('should default the breakpoint to base when omitted', function () {

    const system = createSystem(sharedLibs, {}, testTheme);

    assert.strictEqual(system.breakpoint, 'base');

  });

  it('should expose the same Style shape the factory path builds', function () {

    const system = buildSystem();

    assert.strictEqual(typeof system.Style.utilities, 'object');
    assert.strictEqual(system.Style.tokens, testTheme);
    assert.strictEqual(system.Style.breakpoint, 'base');
    assert.strictEqual(typeof system.Style.allBreakpoints, 'object');

  });

  it('should build all twelve mechanism parts', function () {

    const system = buildSystem();
    const expected = [
      'A11y', 'PressKeys', 'RovingTabIndex', 'ControllableState',
      'AnchoredPosition', 'FocusTrap', 'Overlay', 'CompoundContext',
      'Units', 'Typeface', 'Direction', 'Filter'
    ];

    assert.deepStrictEqual(Object.keys(system.Parts).sort(), expected.slice().sort());

  });

  it('should throw when the theme contract is malformed', function () {

    assert.throws(function () {
      createSystem(sharedLibs, {}, {}, 'base');
    });

  });

  it('should throw when a required injection is missing', function () {

    assert.throws(function () {
      createSystem({ Utils: Utils }, {}, testTheme, 'base');
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

    const tree = TestRenderer.create(React.createElement(TextComponent, {}, 'hello'));

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

    const tree = TestRenderer.create(
      React.createElement(system.Component.variant.ButtonPrimaryOutlined, {
        title: 'Cancel',
        onPress: function () {}
      })
    ).toJSON();

    assert.ok(tree);
    assert.strictEqual(tree.props.role, 'button');

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

    const tree = TestRenderer.create(
      React.createElement(system.Component.freeform.RawBox, {
        style: { padding: 4 }
      })
    ).toJSON();

    assert.ok(tree);

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

  it('should resolve base for the stubbed 375px viewport', function () {

    const system = buildSystem();
    let captured = null;

    function Probe () {
      captured = system.useBreakpoint(testTheme);
      return null;
    }

    const tree = TestRenderer.create(React.createElement(Probe));

    assert.strictEqual(captured, 'base');

    tree.unmount();

  });

  it('should carry every breakpoint utility set on Style', function () {

    const system = buildSystem();

    assert.deepStrictEqual(
      Object.keys(system.Style.allBreakpoints).sort(),
      ['base', 'lg', 'md', 'sm', 'xl']
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

    const tree = TestRenderer.create(
      React.createElement(system.Component.Dropdown, {
        items: [{ id: 'a', label: 'Alpha' }],
        triggerLabel: 'Pick one',
        accessibilityLabel: 'Pick one'
      })
    );

    assert.ok(tree.toJSON());

    tree.unmount();

  });

  it('should resolve siblings regardless of registration order', function () {

    const system = buildSystem();

    system.addComponents({ Dropdown: Dropdown });
    system.addComponents({ Text: Text, Icon: Icon });

    const tree = TestRenderer.create(
      React.createElement(system.Component.Dropdown, {
        items: [{ id: 'a', label: 'Alpha' }],
        triggerLabel: 'Pick one',
        accessibilityLabel: 'Pick one'
      })
    );

    assert.ok(tree.toJSON());

    tree.unmount();

  });

  it('should render a button through the system registry', function () {

    const system = buildSystem();
    system.addComponents({ Button: Button, Text: Text });

    const tree = TestRenderer.create(
      React.createElement(system.Component.Button, {
        onPress: function () {},
        accessibilityLabel: 'Save'
      }, 'Save')
    );

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

    const fromSystem = TestRenderer.create(
      React.createElement(system.Component.Text, {}, 'same')
    );
    const fromFactory = TestRenderer.create(
      React.createElement(loaderModule.Component.Text, {}, 'same')
    );

    assert.deepStrictEqual(fromSystem.toJSON(), fromFactory.toJSON());

    fromSystem.unmount();
    fromFactory.unmount();

  });

});


// ========================= TIER 1 - COLOR TOKEN CONTRACT ================== //

describe('createSystem color token contract', function () {

  // Each required token is removed on its own so a regression that drops one
  // token from the required list is caught by exactly one failing case.
  const REQUIRED = [
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

  it('should require exactly thirty-seven color tokens', function () {

    assert.strictEqual(REQUIRED.length, 37);

  });

  it('should throw for each individually absent token', function () {

    for (let i = 0; i < REQUIRED.length; i++) {
      const theme = createTestTheme();
      delete theme.Color[REQUIRED[i]];

      assert.throws(
        function () {
          createSystem(sharedLibs, {}, theme, 'base');
        },
        TypeError,
        'no throw when ' + REQUIRED[i] + ' was absent'
      );
    }

  });

  it('should name the absent token in the message', function () {

    const theme = createTestTheme();
    delete theme.Color.BORDER;

    try {
      createSystem(sharedLibs, {}, theme, 'base');
      assert.fail('accepted a theme with no BORDER');
    } catch (error) {
      assert.ok(error.message.indexOf('BORDER') !== -1);
    }

  });

  it('should accept a theme carrying extra tokens beyond the required set', function () {

    // The gate checks presence, never absence. A richer theme is valid.
    const theme = createTestTheme();
    theme.Color.BRAND_ACCENT = '#123456';

    assert.ok(createSystem(sharedLibs, {}, theme, 'base').Style.utilities);

  });

  it('should still reject a non-object Color group', function () {

    const theme = createTestTheme();
    theme.Color = null;

    assert.throws(function () {
      createSystem(sharedLibs, {}, theme, 'base');
    }, TypeError);

  });

  it('should report every absent token in one throw', function () {

    const theme = createTestTheme();
    delete theme.Color.SURFACE;
    delete theme.Color.BORDER;

    try {
      createSystem(sharedLibs, {}, theme, 'base');
      assert.fail('accepted a theme missing two tokens');
    } catch (error) {
      assert.ok(error.message.indexOf('SURFACE') !== -1);
      assert.ok(error.message.indexOf('BORDER') !== -1);
    }

  });

  it('should carry the error catalog type in the message', function () {

    const theme = createTestTheme();
    delete theme.Color.TEXT_MUTED;

    try {
      createSystem(sharedLibs, {}, theme, 'base');
      assert.fail('accepted a theme with no TEXT_MUTED');
    } catch (error) {
      assert.ok(error.message.indexOf('theme-missing-color-token') !== -1);
    }

  });

  it('should not mutate the theme it was given', function () {

    const theme = createTestTheme();
    const before = JSON.stringify(theme);
    createSystem(sharedLibs, {}, theme, 'base');

    assert.strictEqual(JSON.stringify(theme), before);

  });

});
