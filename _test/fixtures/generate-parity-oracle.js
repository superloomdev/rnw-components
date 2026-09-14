// Info: Independent Carbon parity oracle generator
//
// This script generates the independent expected-values fixture by reading
// the pinned @carbon/themes, @carbon/type, @carbon/motion, and @carbon/layout
// packages. It does NOT read Superloom's implementation output.
//
// The generated fixture is the reference oracle that parity.test.js compares
// against. A golden file generated from Superloom output would not be a
// reference; this file uses only upstream Carbon sources.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the pinned Carbon theme packages (named exports, not default)
const whiteModule = await import('@carbon/themes/js/generated/themes/white.js');
const g10Module = await import('@carbon/themes/js/generated/themes/g10.js');
const g90Module = await import('@carbon/themes/js/generated/themes/g90.js');
const g100Module = await import('@carbon/themes/js/generated/themes/g100.js');

// The themes export tokens as named exports on the module namespace
const whiteTheme = whiteModule.default || whiteModule;
const g10Theme = g10Module.default || g10Module;
const g90Theme = g90Module.default || g90Module;
const g100Theme = g100Module.default || g100Module;

// Read type tokens
const typeModule = await import('@carbon/type');
const typeTokens = typeModule.default || typeModule;

// Read motion tokens
const motionModule = await import('@carbon/motion');
const motionTokens = motionModule.default || motionModule;

// Read layout tokens
const layoutModule = await import('@carbon/layout');
const layoutTokens = layoutModule.default || layoutModule;

// Build the oracle
const oracle = {
  _meta: {
    generated: new Date().toISOString(),
    sources: {
      themes: '@carbon/themes@11.80.0 (via @carbon/react@1.115.0)',
      type: '@carbon/type@11.66.0 (via @carbon/react@1.115.0)',
      motion: '@carbon/motion@11.51.0 (via @carbon/react@1.115.0)',
      layout: '@carbon/layout@11.58.0 (via @carbon/react@1.115.0)',
      carbonReact: '@carbon/react@1.115.0',
      carbonReactCommit: '7518c84ffd00f22434fe19d83119692c12fccb2f'
    },
    description: 'Independent expected values from pinned Carbon upstream. Not generated from Superloom output.'
  },
  themes: {
    white: extractThemeTokens(whiteTheme),
    g10: extractThemeTokens(g10Theme),
    g90: extractThemeTokens(g90Theme),
    g100: extractThemeTokens(g100Theme)
  },
  type: extractTypeTokens(typeTokens),
  motion: extractMotionTokens(motionTokens),
  layout: extractLayoutTokens(layoutTokens)
};

function extractThemeTokens (theme) {

  const tokens = {};

  // Core color tokens by category
  const categories = {
    background: ['background', 'backgroundHover', 'backgroundActive', 'backgroundSelected', 'backgroundSelectedHover', 'backgroundInverse', 'backgroundInverseHover'],
    layers: ['layer01', 'layer02', 'layer03', 'layerActive01', 'layerActive02', 'layerActive03', 'layerHover01', 'layerHover02', 'layerHover03', 'layerSelected01', 'layerSelected02', 'layerSelected03', 'layerSelectedHover01', 'layerSelectedHover02', 'layerSelectedHover03', 'layerSelectedInverse'],
    text: ['textPrimary', 'textSecondary', 'textTertiary', 'textOnColor', 'textOnColorDisabled', 'textInverse', 'textDisabled', 'textHelper', 'textPlaceholder', 'textOnColorSelected'],
    border: ['borderSubtle01', 'borderSubtle02', 'borderSubtle03', 'borderStrong01', 'borderStrong02', 'borderStrong03', 'borderInverse', 'borderInverseSubtle', 'borderInteractive', 'borderDisabled'],
    icon: ['iconPrimary', 'iconSecondary', 'iconTertiary', 'iconOnColor', 'iconOnColorDisabled', 'iconInverse', 'iconDisabled', 'iconInteractive'],
    interactive: ['interactive', 'interactiveHover', 'interactiveActive', 'interactiveSelected', 'interactiveSelectedHover', 'focus', 'focusInset', 'focusInverse', 'highlight', 'highlightInverse'],
    support: ['supportError', 'supportErrorInverse', 'supportWarning', 'supportWarningInverse', 'supportSuccess', 'supportSuccessInverse', 'supportInfo', 'supportInfoInverse', 'supportCautionMajor', 'supportCautionMinor'],
    misc: ['overlay', 'shuttle', 'shuttleHover', 'shuttleActive', 'shuttleSelected', 'shuttleSelectedHover', 'skeletonBackground', 'skeletonElement', 'aiAuraStart', 'aiAuraEnd', 'aiAuraHoverStart', 'aiAuraHoverEnd', 'aiOverlay', 'aiPopoverBackground', 'aiBorderStart', 'aiBorderEnd', 'aiBorderStrong', 'aiInnerShadow', 'aiDropShadow']
  };

  for (const [category, names] of Object.entries(categories)) {
    tokens[category] = {};
    for (const name of names) {
      if (theme[name] !== undefined) {
        tokens[category][name] = theme[name];
      }
    }
  }

  // Shadow tokens
  tokens.shadows = {};
  for (const key of Object.keys(theme)) {
    if (key.startsWith('shadow') || key.includes('Shadow')) {
      tokens.shadows[key] = theme[key];
    }
  }

  return tokens;
}

function extractTypeTokens (type) {

  const tokens = {};
  const typeKeys = Object.keys(type);

  // Type styles (body01, heading01, etc.)
  for (const key of typeKeys) {
    const val = type[key];
    if (val && typeof val === 'object') {
      tokens[key] = {
        fontSize: val.fontSize,
        fontWeight: val.fontWeight,
        lineHeight: val.lineHeight,
        letterSpacing: val.letterSpacing,
        fontFamily: val.fontFamily
      };
    }
  }

  return tokens;
}

function extractMotionTokens (motion) {

  const tokens = {};
  const motionKeys = Object.keys(motion);

  for (const key of motionKeys) {
    const val = motion[key];
    if (typeof val === 'string' || typeof val === 'number') {
      tokens[key] = val;
    } else if (val && typeof val === 'object') {
      tokens[key] = val;
    }
  }

  return tokens;
}

function extractLayoutTokens (layout) {

  const tokens = {};
  const layoutKeys = Object.keys(layout);

  for (const key of layoutKeys) {
    const val = layout[key];
    if (typeof val === 'string' || typeof val === 'number') {
      tokens[key] = val;
    }
  }

  return tokens;
}

// Write the oracle fixture
const outPath = join(__dirname, 'parity-oracle.json');
writeFileSync(outPath, JSON.stringify(oracle, null, 2));

console.log('Generated parity-oracle.json');
console.log('Themes: white, g10, g90, g100');
console.log('Theme token count per theme:', Object.keys(oracle.themes.white).length, 'categories');
console.log('Type styles:', Object.keys(oracle.type).length);
console.log('Motion tokens:', Object.keys(oracle.motion).length);
console.log('Layout tokens:', Object.keys(oracle.layout).length);
