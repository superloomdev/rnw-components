// Info: Test loader for rnw-components.
//
// Builds the component library with stub injections and exports everything
// needed by the test suite. DOM bootstrap and react-native -> react-native-web
// resolution are handled by the --import and --loader flags in the test script.
//
// createSystem is the package's only entry point. The suite needs the whole
// roster, so buildFullSystem registers all four namespaces from the generated
// barrel. A test that needs a subset calls createSystem directly.
//
// This file is the single source of truth for test dependencies.
// process.env is ONLY read here.

import React from 'react';
import TestRenderer from 'react-test-renderer';
import utilsLoader from 'helper-utils';
import debugLoader from 'helper-debug';
import { createSystem, buildThemeContract, TOKENS } from 'rnw-components';
import { COMPONENTS, VARIANTS, FREEFORMS, PROVIDERS } from 'rnw-components/all';


// ========================= DEPENDENCY CONTAINER =========================== //

const Utils = utilsLoader();
const Debug = debugLoader({ Utils: Utils });


// ========================= TEST STUBS ===================================== //

// Device stub: emitter-stub pattern with viewport subscription support
function createDeviceStub (width, height) {

  const listeners = [];
  let current = { width: width, height: height };

  return {

    getPlatform: function () {
      return { success: true, platform: 'web', error: null };
    },

    getViewport: function () {
      return { success: true, width: current.width, height: current.height, error: null };
    },

    onViewportChange: function (callback) {
      listeners.push(callback);
      return {
        success: true,
        unsubscribe: function () {
          const idx = listeners.indexOf(callback);
          if (idx !== -1) {
            listeners.splice(idx, 1);
          }
        },
        error: null
      };
    },

    // Test helper: simulate a viewport change event
    _emit: function (dims) {
      current = { width: dims.width, height: dims.height };
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](dims);
      }
    },

    // Test helper: count active listeners
    _listenerCount: function () {
      return listeners.length;
    },

    getSafeAreaInsets: function () {
      return { success: true, top: 0, bottom: 0, left: 0, right: 0, error: null };
    }

  };

}


// Icons stub: renders a proper React element so test-renderer can handle it
function createIconsStub () {

  return {
    Glyph: function GlyphStub (props) {
      return React.createElement('span', {
        'data-icon': props.name,
        'data-size': props.size,
        'data-color': props.color
      });
    }
  };

}


// ========================= THEME CONTRACT ================================= //

function createTestTheme () {

  return {
    Color: {
      APP_PRIMARY: '#0f62fe',
      APP_PRIMARY_HOVERED: '#0353e9',
      APP_PRIMARY_PRESSED: '#0043d9',
      APP_PRIMARY_DISABLED: '#a6c8ff',
      APP_PRIMARY_SUBTLE: '#edf5ff',
      TEXT_PRIMARY: '#161616',
      TEXT_SECONDARY: '#525252',
      TEXT_MUTED: '#6f6f6f',
      TEXT_DISABLED: '#a8a8a8',
      TEXT_ON_PRIMARY: '#ffffff',
      BACKGROUND_PRIMARY: '#ffffff',
      BACKGROUND_SECONDARY: '#f4f4f4',
      SURFACE: '#ffffff',
      BORDER: '#e0e0e0',
      BORDER_STRONG: '#8d8d8d',
      BORDER_SUBTLE: '#e0e0e0',
      STATUS_SUCCESS: '#0e6027',
      STATUS_SUCCESS_SUBTLE: '#e8f5e9',
      STATUS_DANGER: '#da1e28',
      STATUS_DANGER_SUBTLE: '#fff1f1',
      STATUS_WARNING: '#8e6a00',
      STATUS_WARNING_SUBTLE: '#fcf4d6',
      STATUS_INFO: '#0043ce',
      STATUS_INFO_SUBTLE: '#edf5ff',
      BUTTON_PRIMARY: '#0f62fe',
      BUTTON_PRIMARY_HOVER: '#0353e9',
      BUTTON_PRIMARY_ACTIVE: '#0043d9',
      BUTTON_SECONDARY: '#393939',
      BUTTON_SECONDARY_HOVER: '#4c4c4c',
      BUTTON_SECONDARY_ACTIVE: '#636363',
      BUTTON_TERTIARY: '#0f62fe',
      BUTTON_TERTIARY_HOVER: '#0353e9',
      BUTTON_TERTIARY_ACTIVE: '#0043d9',
      BUTTON_DANGER_PRIMARY: '#da1e28',
      BUTTON_DANGER_HOVER: '#b0191f',
      BUTTON_DANGER_ACTIVE: '#8a1116',
      BUTTON_DANGER_SECONDARY: '#da1e28',
      BUTTON_DISABLED: '#c6c6c6',
      BUTTON_SEPARATOR: '#e0e0e0'
    },
    Dimension: {
      fontSize: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24 },
      space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
      radius: { sm: 4, md: 8, lg: 12, xl: 16, pill: 999 },
      lineHeightRatio: 1.4
    },
    Font: {
      family: { primary: 'System', secondary: 'System' },
      weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    },
    Breakpoint: {
      base: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1280
    }
  };

}


// ========================= BUILD COMPONENTS =============================== //

const Device = createDeviceStub(375, 812);
const Icons = createIconsStub();

const sharedLibs = {
  Utils: Utils,
  Debug: Debug,
  React: React,
  Device: Device,
  Icons: Icons
};


/********************************************************************
Build a system carrying the entire component roster. The suite walks
the full registry, so every namespace is registered from the
generated barrel.

@param {Object} theme_contract - Theme contract to build against
@param {String} breakpoint     - Active breakpoint key

@return {Object} - System object from createSystem
*********************************************************************/
function buildFullSystem (theme_contract, breakpoint) {

  // Create the system, then register all four registry namespaces.
  // STRICT_TOKENS is on so every test runs against the strict Proxy, which
  // makes a dead token name fail loudly across the whole 245-component roster.
  const system = createSystem(sharedLibs, { STRICT_TOKENS: true }, theme_contract, breakpoint);

  system.addComponents(COMPONENTS);
  system.addVariants(VARIANTS);
  system.addFreeforms(FREEFORMS);
  system.addProviders(PROVIDERS);

  // Return the fully populated system
  return system;

}


// Build the themed registry at the base breakpoint
const testTheme = createTestTheme();
const system = buildFullSystem(testTheme, 'base');


// ========================= EXPORTS ======================================== //

export {
  system,
  Utils,
  Debug,
  React,
  TestRenderer,
  Device,
  Icons,
  createDeviceStub,
  createIconsStub,
  createTestTheme,
  createSystem,
  buildThemeContract,
  TOKENS,
  COMPONENTS,
  VARIANTS,
  FREEFORMS,
  PROVIDERS,
  sharedLibs,
  buildFullSystem
};

export const Component = system.Component;
export const Style = system.Style;
export const theme = testTheme;
