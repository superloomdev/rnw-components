// Info: Generator for theme.js from the parity oracle (Plan 0149, Step 4.2).
//
// This script reads the independent parity oracle and generates the
// data-only theme.js with Carbon profile exports. The values come
// from the pinned @carbon/react@1.115.0 upstream, not from Superloom.
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const oracle = JSON.parse(readFileSync(join(__dirname, 'parity-oracle.json'), 'utf8'));

// Map Carbon theme names to profile names
const profiles = [
  { name: 'white', polarity: 'light', exportName: 'white' },
  { name: 'g10', polarity: 'light', exportName: 'g10' },
  { name: 'g90', polarity: 'dark', exportName: 'g90' },
  { name: 'g100', polarity: 'dark', exportName: 'g100' }
];

function buildTemplate (profile) {

  const theme = oracle.themes[profile.name];

  // Build the tokens map with Carbon's exact values as literals
  const tokens = {};

  // Background tokens -> color.background, color.background_hover, etc.
  for (const [key, val] of Object.entries(theme.background)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Layer tokens -> color.layer_01, color.layer_02, etc.
  for (const [key, val] of Object.entries(theme.layers)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Text tokens -> color.text_primary, color.text_secondary, etc.
  for (const [key, val] of Object.entries(theme.text)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Border tokens -> color.border_subtle_01, etc.
  for (const [key, val] of Object.entries(theme.border)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Icon tokens -> color.icon_primary, etc.
  for (const [key, val] of Object.entries(theme.icon)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Interactive tokens -> color.interactive, color.focus, etc.
  for (const [key, val] of Object.entries(theme.interactive)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Support tokens -> color.support_error, etc.
  for (const [key, val] of Object.entries(theme.support)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Misc tokens
  for (const [key, val] of Object.entries(theme.misc)) {
    tokens['color.' + camelToSnake(key)] = val;
  }

  // Shadow tokens - store as shadow definitions
  for (const [key, val] of Object.entries(theme.shadows)) {
    if (typeof val === 'string') {
      // Carbon shadow strings like "0 1px 2px 0 rgba(0,0,0,0.3)"
      tokens['shadow.' + camelToSnake(key)] = val;
    }
  }

  // Type styles -> type_set tokens
  for (const [key, val] of Object.entries(oracle.type)) {
    if (val && typeof val === 'object') {
      tokens['type.' + key] = {
        type_set: true,
        font_size: val.fontSize,
        font_weight: val.fontWeight,
        line_height: val.lineHeight,
        letter_spacing: val.letterSpacing,
        font_family: val.fontFamily
      };
    }
  }

  // Layout tokens -> dimension tokens
  for (const [key, val] of Object.entries(oracle.layout)) {
    if (typeof val === 'string' || typeof val === 'number') {
      tokens['dimension.' + camelToSnake(key)] = val;
    }
  }

  // Motion tokens
  for (const [key, val] of Object.entries(oracle.motion)) {
    if (typeof val === 'string' || typeof val === 'number') {
      tokens['motion.' + camelToSnake(key)] = val;
    }
  }

  return {
    polarity: profile.polarity,
    scales: {
      base_font_size: 16
    },
    tokens: tokens
  };
}

function camelToSnake (str) {
  return str
    // Insert underscore between lowercase letter and digit: layer01 -> layer_01
    .replace(/([a-z])(\d)/g, '$1_$2')
    // Insert underscore between digit and uppercase letter: 01Active -> 01_active
    .replace(/(\d)([A-Z])/g, '$1_$2')
    // Insert underscore before uppercase: textPrimary -> text_primary
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

// Generate the theme.js file
let output = `// Info: Carbon theme profiles for the Superloom Themer (Plan 0149, Step 4.2).
//
// Data-only module. No React, no component factories, no side effects.
// Each export is a Themer template with exact Carbon values from the
// pinned @carbon/react@1.115.0 upstream (commit 7518c84f).
//
// Values are independent of Superloom's implementation output. They were
// extracted from @carbon/themes, @carbon/type, @carbon/motion, and
// @carbon/layout via the parity oracle generator.
//
// Usage:
//   import { white } from '@superloomdev/rnw-components/theme';
//   const built = Themer.buildTheme(white, [{ name: 'base' }], 'native');

`;

for (const profile of profiles) {
  const template = buildTemplate(profile);
  const tokenCount = Object.keys(template.tokens).length;

  output += `// ${profile.exportName} profile: ${profile.polarity} polarity, ${tokenCount} tokens\n`;
  output += `export const ${profile.exportName} = ${JSON.stringify(template, null, 2)};\n\n`;
}

// Add a convenience export for all profiles
output += `// All profiles as a named map\n`;
output += `export const profiles = { white, g10, g90, g100 };\n`;

const outPath = join(__dirname, '..', '..', 'theme.js');
writeFileSync(outPath, output);

console.log('Generated theme.js');
console.log('Profiles: white, g10, g90, g100');
for (const profile of profiles) {
  const template = buildTemplate(profile);
  console.log(`  ${profile.exportName}: ${Object.keys(template.tokens).length} tokens`);
}
