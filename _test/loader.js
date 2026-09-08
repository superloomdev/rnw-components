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
import TestRenderer, { act } from 'react-test-renderer';
import utilsLoader from 'helper-utils';
import debugLoader from 'helper-debug';
import themerLoader from 'helper-themer';
import { createSystem, TOKENS } from 'rnw-components';
import { COMPONENTS, VARIANTS, FREEFORMS, PROVIDERS } from 'rnw-components/all';
import { buildCarbonWhite } from './harness/themes.js';


// ========================= DEPENDENCY CONTAINER =========================== //

const Utils = utilsLoader();
const Debug = debugLoader({ Utils: Utils });
const Themer = themerLoader({ Utils: Utils, Debug: Debug });


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


// ========================= BUILD COMPONENTS =============================== //

const Device = createDeviceStub(375, 812);
const Icons = createIconsStub();

const sharedLibs = {
  Utils: Utils,
  Debug: Debug,
  React: React,
  Device: Device,
  Themer: Themer,
  Icons: Icons
};


/********************************************************************
Build a system carrying the entire component roster. The suite walks
the full registry, so every namespace is registered from the
generated barrel.

@param {Object} built       - Themer.buildTheme() result with a flat
                              tokens map
@param {String} breakpoint   - Active breakpoint key

@return {Object} - System object from createSystem
*********************************************************************/
function buildFullSystem (built, breakpoint) {

  // Create the system, then register all four registry namespaces.
  // STRICT_TOKENS is on so every test runs against the strict Proxy, which
  // makes a dead token name fail loudly across the whole 245-component roster.
  const system = createSystem(sharedLibs, { STRICT_TOKENS: true }, built, breakpoint);

  system.addComponents(COMPONENTS);
  system.addVariants(VARIANTS);
  system.addFreeforms(FREEFORMS);
  system.addProviders(PROVIDERS);

  // Return the fully populated system
  return system;

}


// Build the themed registry at the sm breakpoint
const testTheme = buildCarbonWhite();
const system = buildFullSystem(testTheme, 'sm');


// ========================= EXPORTS ======================================== //

export {
  system,
  Utils,
  Debug,
  Themer,
  React,
  TestRenderer,
  act,
  Device,
  Icons,
  createDeviceStub,
  createIconsStub,
  createSystem,
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
