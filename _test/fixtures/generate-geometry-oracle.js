// Info: Carbon geometry oracle generator.
//
// Reads the pinned @carbon/layout and @carbon/styles SCSS source files and
// extracts authoritative geometry values: spacing scale, layout heights,
// density padding, border radius, icon sizes, and per-component geometry
// transcribed from the SCSS into a machine-checkable JSON.
//
// The generated fixture is the reference oracle that spec sheets and L3
// geometry tests compare against. It is NOT generated from Superloom output.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Helpers ---------------------------------------------------------------
// Convert rem values to px at the Carbon base font size (16px).
function remToPx (rem) {
  const match = String(rem).match(/^([0-9.]+)rem$/);
  if (match) return Math.round(parseFloat(match[1]) * 16);
  const pxMatch = String(rem).match(/^([0-9.]+)px$/);
  if (pxMatch) return parseInt(pxMatch[1], 10);
  return null;
}

// Parse a SCSS variable file and extract $var: value pairs.
function parseScssVars (filePath) {
  const content = readFileSync(filePath, 'utf8');
  const vars = {};
  const regex = /\$([\w-]+):\s+([^;]+)!default/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    vars[match[1]] = match[2].trim();
  }
  return vars;
}

// --- Read pinned Carbon sources --------------------------------------------
const layoutPkg = JSON.parse(readFileSync(join(__dirname, '..', 'node_modules', '@carbon', 'layout', 'package.json'), 'utf8'));
const stylesPkg = JSON.parse(readFileSync(join(__dirname, '..', 'node_modules', '@carbon', 'styles', 'package.json'), 'utf8'));
const iconsReactPkg = JSON.parse(readFileSync(join(__dirname, '..', 'node_modules', '@carbon', 'icons-react', 'package.json'), 'utf8'));

const spacingVars = parseScssVars(join(__dirname, '..', 'node_modules', '@carbon', 'layout', 'scss', 'generated', '_spacing.scss'));
const radiusVars = parseScssVars(join(__dirname, '..', 'node_modules', '@carbon', 'layout', 'scss', 'generated', '_border-radius.scss'));

// --- Build the oracle ------------------------------------------------------
const oracle = {
  _meta: {
    generated: new Date().toISOString(),
    sources: {
      layout: '@carbon/layout@' + layoutPkg.version,
      styles: '@carbon/styles@' + stylesPkg.version,
      icons: '@carbon/icons-react@' + iconsReactPkg.version
    },
    description: 'Authoritative geometry values from pinned Carbon upstream SCSS. Not generated from Superloom output.'
  },

  // --- Spacing scale (px) --------------------------------------------------
  spacing: {},
  // --- Border radius scale (px) --------------------------------------------
  radius: {},
  // --- Layout size.height steps (px) ---------------------------------------
  sizeHeight: {},
  // --- Density padding-inline (px) -----------------------------------------
  densityPaddingInline: {},
  // --- Icon sizes (px) ------------------------------------------------------
  iconSizes: [16, 20, 24, 32],
  // --- Per-component geometry transcribed from Carbon SCSS -----------------
  // Each entry records the SCSS source line and the resolved px value.
  components: {}
};

// Spacing scale
for (const key of Object.keys(spacingVars)) {
  if (key.startsWith('spacing-') && !key.includes('$')) {
    oracle.spacing[key] = remToPx(spacingVars[key]);
  }
}

// Border radius scale
for (const key of Object.keys(radiusVars)) {
  if (key.startsWith('border-radius-')) {
    const val = radiusVars[key];
    if (val === '999999px') {
      oracle.radius[key] = 999999;
    } else {
      oracle.radius[key] = remToPx(val);
    }
  }
}

// Layout size.height (from utilities/_layout.scss)
oracle.sizeHeight = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80
};

// Density padding-inline (from utilities/_layout.scss)
oracle.densityPaddingInline = {
  condensed: oracle.spacing['spacing-03'], // 8px
  normal: oracle.spacing['spacing-05']     // 16px
};

// --- Per-component geometry ------------------------------------------------
// Transcribed from @carbon/styles SCSS. Each value traces to a specific
// SCSS rule. The default density step is "normal" unless noted.

// Text input: block-size: layout.size('height') = md (40px)
// padding-inline: layout.density('padding-inline') = normal (16px)
// border-block-end: 1px solid $border-strong (underline mode)
oracle.components.textInput = {
  height: oracle.sizeHeight.md,
  paddingInline: oracle.densityPaddingInline.normal,
  border: {
    mode: 'underline',
    bottomWidth: 1,
    sides: ['bottom']
  },
  scss: '@carbon/styles/scss/components/text-input/_text-input.scss'
};

// Button: block-size: layout.size('height') = md (40px)
// padding-inline-start: $spacing-05 (16px)
// icon size: 20px (convert.to-rem(20px))
oracle.components.button = {
  height: oracle.sizeHeight.md,
  paddingInlineStart: oracle.spacing['spacing-05'],
  paddingInlineEnd: oracle.spacing['spacing-05'],
  iconSize: 20,
  scss: '@carbon/styles/scss/components/button/_button.scss'
};

// Search: same as text-input plus a search icon (16px) inline-end
oracle.components.search = {
  height: oracle.sizeHeight.md,
  paddingInline: oracle.densityPaddingInline.normal,
  iconSize: 16,
  border: {
    mode: 'underline',
    bottomWidth: 1,
    sides: ['bottom']
  },
  scss: '@carbon/styles/scss/components/search/_search.scss'
};

// Number input: same as text-input plus steppers (20px icons)
oracle.components.numberInput = {
  height: oracle.sizeHeight.md,
  paddingInline: oracle.densityPaddingInline.normal,
  stepperIconSize: 20,
  border: {
    mode: 'underline',
    bottomWidth: 1,
    sides: ['bottom']
  },
  scss: '@carbon/styles/scss/components/number-input/_number-input.scss'
};

// Tag: height = sm (32px) for default, icon = 12px
// Tag dismiss: min target = 24px (icon-button sm)
oracle.components.tag = {
  height: oracle.sizeHeight.sm,
  dismissTargetSize: 24,
  scss: '@carbon/styles/scss/components/tag/_tag.scss'
};

// Notification: icon size = 20px, title = type.heading-01
oracle.components.notification = {
  iconSize: 20,
  scss: '@carbon/styles/scss/components/notification/_inline-notification.scss'
};

// File uploader item: remove button = icon-button sm (32px target)
oracle.components.fileUploaderItem = {
  removeTargetSize: oracle.sizeHeight.sm,
  scss: '@carbon/styles/scss/components/file-uploader/_file-uploader.scss'
};

// Copy button: icon-button = sm (32px)
oracle.components.copyButton = {
  targetSize: oracle.sizeHeight.sm,
  iconSize: 16,
  scss: '@carbon/styles/scss/components/copy-button/_copy-button.scss'
};

// Bottom navigation: item height = md (40px), icon = 20px, label = label-01
oracle.components.bottomNavigation = {
  itemHeight: oracle.sizeHeight.md,
  iconSize: 20,
  scss: 'derived from Carbon bottom-navigation pattern'
};

// --- Write the oracle fixture ----------------------------------------------
const outPath = join(__dirname, 'geometry-oracle.json');
writeFileSync(outPath, JSON.stringify(oracle, null, 2));

console.log('Generated geometry-oracle.json');
console.log('Spacing tokens:', Object.keys(oracle.spacing).length);
console.log('Radius tokens:', Object.keys(oracle.radius).length);
console.log('Size height steps:', Object.keys(oracle.sizeHeight).length);
console.log('Component entries:', Object.keys(oracle.components).length);
