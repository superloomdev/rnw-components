// Info: Theme fixtures for rnw-components tests.
//
// Builds themes through the real Themer engine from the Carbon reference
// template. The built themes have a flat `tokens` map with dotted contract
// names (color.text_primary, spacing.spacing_05, etc.) ready for
// createSystem.

import themerLoader from 'helper-themer';
import utilsLoader from 'helper-utils';
import debugLoader from 'helper-debug';
import carbonV11Profile from 'helper-themer-template-carbon';

// Build the Themer engine instance
const Utils = utilsLoader();
const Debug = debugLoader({ Utils: Utils });
const Themer = themerLoader({ Utils: Utils, Debug: Debug });


// Build a Carbon white theme through the real engine
export function buildCarbonWhite () {
  return Themer.buildTheme(carbonV11Profile.schemes.white, [], 'native');
}


// Build a Carbon g100 (dark) theme through the real engine
export function buildCarbonG100 () {
  return Themer.buildTheme(carbonV11Profile.schemes.g100, [], 'native');
}


// Build a brand-over-white theme: the tasks layer from D16
export function buildBrandOverWhite () {
  const tasksLayer = {
    name: 'tasks',
    tokens: {
      'color.interactive': '#4f46e5',
      'color.button_primary': '#4f46e5',
      'color.button_primary_hover': '#4338ca',
      'color.button_primary_active': '#3730a3',
      'color.link_primary': '#4f46e5',
      'color.focus': '#4f46e5',
      'font.family.sans': 'Poppins',
      'shape.radius_04': 8,
      'shape.radius_08': 12
    }
  };
  return Themer.buildTheme(carbonV11Profile.schemes.white, [tasksLayer], 'native');
}


// Build a complete non-Carbon theme for the same contract: distinct hex per
// color token, proving no design language is hardcoded. Generate
// deterministically from a seed function, then override key colors.
export function buildContrastTheme () {

  // Start from the Carbon white template and override with non-Carbon values.
  // This proves the components carry no baked-in design language.
  const contrastLayer = {
    name: 'contrast',
    tokens: {
      'color.background': '#fffdf5',
      'color.text_primary': '#1a1a2e',
      'color.interactive': '#b5179e',
      'color.button_primary': '#b5179e',
      'color.button_primary_hover': '#9d0fb4',
      'color.button_primary_active': '#7d0a8e',
      'color.button_tertiary': '#b5179e',
      'color.text_secondary': '#52527a',
      'color.text_disabled': '#b0b0c0',
      'color.text_on_color': '#fffdf5',
      'color.layer_01': '#fef9e7',
      'color.border_subtle_01': '#e0d8c0',
      'color.border_interactive': '#b5179e',
      'color.focus': '#b5179e',
      'color.icon_interactive': '#b5179e',
      'color.link_primary': '#b5179e',
      'color.background_brand': '#b5179e',
      'color.support_success': '#2d8659',
      'color.support_error': '#c92a2a',
      'color.support_warning': '#e67700',
      'color.support_info': '#1971c2',
      'font.family.sans': 'Georgia',
      'shape.radius_04': 10,
      'shape.radius_08': 14
    }
  };
  return Themer.buildTheme(carbonV11Profile.schemes.white, [contrastLayer], 'native');
}


// Build an incomplete theme: white minus color.interactive and color.button_primary
export function buildIncompleteTheme () {

  // Build the full white theme, then remove two required tokens
  const built = Themer.buildTheme(carbonV11Profile.schemes.white, [], 'native');
  const tokens = Object.assign({}, built.tokens);
  delete tokens['color.interactive'];
  delete tokens['color.button_primary'];

  return {
    tokens: tokens,
    removed: ['color.interactive', 'color.button_primary']
  };
}


// Legacy compatibility: export a built white theme as the default test theme
export function createTestTheme () {
  return buildCarbonWhite();
}
