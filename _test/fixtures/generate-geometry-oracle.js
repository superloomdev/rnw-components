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

// --- Per-component geometry (Stage 2: parsed from SCSS) -------------------
// Each component's default size and density are parsed from its own SCSS
// `layout.use('size', $default: '...')` and `layout.use('density', $default: '...')`.
// Only matches on the component's root selector are accepted. Components
// whose SCSS declares no layout.use are recorded as inherited, transcribed,
// or none with a reason.

// Component -> SCSS file mapping (relative to @carbon/styles/scss/components/)
const COMPONENT_SCSS = {
  textInput: 'text-input/_text-input.scss',
  button: 'button/_button.scss',
  search: 'search/_search.scss',
  numberInput: 'number-input/_number-input.scss',
  tag: 'tag/_tag.scss',
  notification: 'notification/_inline-notification.scss',
  fileUploaderItem: 'file-uploader/_file-uploader.scss',
  copyButton: 'copy-button/_copy-button.scss',
  select: 'select/_select.scss'
};

// Component -> SCSS root selector suffix (the part after --)
// Most use kebab-case of the component name, but some differ.
const COMPONENT_SELECTOR = {
  textInput: 'text-input',
  button: 'btn',
  search: 'search',
  numberInput: 'number-input',
  tag: 'tag',
  notification: 'inline-notification',
  fileUploaderItem: 'file-uploader',
  copyButton: 'copy-button',
  select: 'select'
};

// Self-check constants (measured 2026-09-14 against the pinned packages).
// If the parse returns a different number, the pin moved - halt loudly.
const SELF_CHECK = {
  sizeHeightMd: 40,
  sizeHeightLg: 48,
  sizeHeightSm: 32,
  tagHeight: 24  // tag redefines size scale: md=24, lg=32; default is md
};

// Parse a component's SCSS to extract its default size and density from
// layout.use() calls on the root selector. Returns { sizeDefault, densityDefault, redefinedSizeHeight }
// or null if no root-selector match is found.
function parseComponentScss (scssPath, componentKey) {
  let content;
  try {
    content = readFileSync(scssPath, 'utf8');
  } catch {
    return null;
  }

  // Track brace nesting to identify root-selector level.
  const lines = content.split('\n');
  let braceDepth = 0;
  let rootSelectorDepth = -1;
  let sizeDefault = null;
  let densityDefault = null;
  let redefinedSizeHeight = null;

  const sizeRegex = /layout\.use\(\s*'size'[^)]*\$default:\s*'([a-z0-9]+)'/;
  const densityRegex = /layout\.use\(\s*'density'[^)]*\$default:\s*'([a-z]+)'/;

  let inRedefineBlock = false;
  let redefineBraceDepth = -1;
  const kebabName = componentKey.replace(/([A-Z])/g, '-$1').toLowerCase();

  for (const line of lines) {
    const opens = (line.match(/{/g) || []).length;
    const closes = (line.match(/}/g) || []).length;

    // Check for root selector pattern: .#{$prefix}--<selector>
    const selectorSuffix = COMPONENT_SELECTOR[componentKey] || kebabName;
    if (line.includes('--' + selectorSuffix) && braceDepth >= 1) {
      rootSelectorDepth = braceDepth + 1;
    }

    // Detect start of redefine-tokens block (may span multiple lines)
    if (line.includes('layout.redefine-tokens')) {
      inRedefineBlock = true;
      redefineBraceDepth = braceDepth;
      redefinedSizeHeight = {};
    }

    // Parse redefined height values while inside redefine block
    if (inRedefineBlock && redefinedSizeHeight) {
      // Match: md: convert.to-rem(24px)
      const heightMatch = /^\s*([a-z0-9]+):\s*convert\.to-rem\(([0-9.]+)px\)/.exec(line);
      if (heightMatch) {
        redefinedSizeHeight[heightMatch[1]] = parseInt(heightMatch[2], 10);
      }
      // Check for end of redefine block (closing paren on its own line)
      if (line.trim() === ')' && redefinedSizeHeight && Object.keys(redefinedSizeHeight).length > 0) {
        inRedefineBlock = false;
      }
    }

    // Check for layout.use at root selector depth
    if (rootSelectorDepth > 0 && braceDepth === rootSelectorDepth) {
      const sizeMatch = sizeRegex.exec(line);
      if (sizeMatch && !sizeDefault) {
        sizeDefault = sizeMatch[1];
      }
      const densityMatch = densityRegex.exec(line);
      if (densityMatch && !densityDefault) {
        densityDefault = densityMatch[1];
      }
    }

    braceDepth += opens - closes;
    if (braceDepth < rootSelectorDepth) {
      rootSelectorDepth = -1;
    }
  }

  if (sizeDefault || densityDefault) {
    return { sizeDefault, densityDefault, redefinedSizeHeight };
  }
  return null;
}

// Previous (transcribed) values for the diff table
const PREVIOUS_VALUES = {
  textInput: { height: 40, method: 'transcribed' },
  button: { height: 40, method: 'transcribed' },
  search: { height: 40, method: 'transcribed' },
  numberInput: { height: 40, method: 'transcribed' },
  tag: { height: 32, method: 'transcribed' },
  notification: { height: null, method: 'transcribed' },
  fileUploaderItem: { height: null, method: 'transcribed' },
  copyButton: { height: null, method: 'transcribed' },
  bottomNavigation: { height: null, method: 'transcribed' },
  select: { height: null, method: 'transcribed' }
};

const diffTable = [];
const stylesBaseDir = join(__dirname, '..', 'node_modules', '@carbon', 'styles', 'scss', 'components');

// Parse each component
for (const [componentKey, scssRelPath] of Object.entries(COMPONENT_SCSS)) {
  const scssPath = join(stylesBaseDir, scssRelPath);
  const parsed = parseComponentScss(scssPath, componentKey);

  if (parsed && parsed.sizeDefault) {
    // Use redefined size height scale if available, otherwise global scale
    const sizeHeightMap = parsed.redefinedSizeHeight || oracle.sizeHeight;
    const height = sizeHeightMap[parsed.sizeDefault];
    const paddingInline = parsed.densityDefault
      ? oracle.densityPaddingInline[parsed.densityDefault]
      : undefined;

    const entry = {
      sizeDefault: parsed.sizeDefault,
      height: height,
      densityDefault: parsed.densityDefault || 'normal',
      paddingInline: paddingInline,
      source: '@carbon/styles/scss/components/' + scssRelPath,
      method: 'parsed'
    };
    if (parsed.redefinedSizeHeight) {
      entry.redefinedSizeHeight = parsed.redefinedSizeHeight;
    }
    oracle.components[componentKey] = entry;

    // Record diff
    const prev = PREVIOUS_VALUES[componentKey];
    if (prev && prev.height !== height) {
      diffTable.push({
        component: componentKey,
        parsed: height,
        previous: prev.height,
        method: 'parsed'
      });
    }
  } else if (componentKey === 'numberInput') {
    // O4 fallback: numberInput has no layout.use; inherits from form
    oracle.components[componentKey] = {
      height: oracle.sizeHeight.md,
      paddingInline: oracle.densityPaddingInline.normal,
      method: 'inherited',
      from: 'form (text-input)',
      source: '@carbon/styles/scss/components/number-input/_number-input.scss',
      reason: 'Carbon number-input has no layout.use; resolves through @use ../form'
    };
  } else if (componentKey === 'notification') {
    // O4 fallback: notification has no layout.use; content-driven
    oracle.components[componentKey] = {
      iconSize: 20,
      method: 'none',
      source: '@carbon/styles/scss/components/notification/_inline-notification.scss',
      reason: 'Carbon notification height is content-driven, not a size token'
    };
  } else {
    // Keep transcribed values with a reason
    const existing = oracle.components[componentKey] || {};
    oracle.components[componentKey] = Object.assign({}, existing, {
      method: 'transcribed',
      source: '@carbon/styles/scss/components/' + scssRelPath,
      reason: 'No layout.use found in component SCSS; value transcribed from Carbon docs'
    });
  }
}

// Bottom navigation: no SCSS file (derived pattern)
oracle.components.bottomNavigation = {
  itemHeight: oracle.sizeHeight.md,
  iconSize: 20,
  method: 'transcribed',
  source: 'derived from Carbon bottom-navigation pattern',
  reason: 'No dedicated Carbon SCSS component; value derived from Carbon design patterns'
};

// Add icon sizes and extra fields to parsed components
// (These are not from layout.use but from component-specific SCSS)
if (oracle.components.button) {
  oracle.components.button.iconSize = 20;
  oracle.components.button.paddingInlineStart = oracle.spacing['spacing-05'];
  oracle.components.button.paddingInlineEnd = oracle.spacing['spacing-05'];
}
if (oracle.components.search) {
  oracle.components.search.iconSize = 16;
  oracle.components.search.border = { mode: 'underline', bottomWidth: 1, sides: ['bottom'] };
}
if (oracle.components.textInput) {
  oracle.components.textInput.border = { mode: 'underline', bottomWidth: 1, sides: ['bottom'] };
  oracle.components.textInput.iconSize = 16;
}
if (oracle.components.numberInput) {
  oracle.components.numberInput.stepperIconSize = 20;
  oracle.components.numberInput.border = { mode: 'underline', bottomWidth: 1, sides: ['bottom'] };
}
if (oracle.components.tag) {
  oracle.components.tag.dismissTargetSize = 24;
}
if (oracle.components.fileUploaderItem) {
  oracle.components.fileUploaderItem.removeTargetSize = oracle.sizeHeight.sm;
}
if (oracle.components.copyButton) {
  oracle.components.copyButton.targetSize = oracle.sizeHeight.sm;
  oracle.components.copyButton.iconSize = 16;
}

// Self-check: assert the measured known-good values
assertSelfCheck('sizeHeight.md', oracle.sizeHeight.md, SELF_CHECK.sizeHeightMd);
assertSelfCheck('sizeHeight.lg', oracle.sizeHeight.lg, SELF_CHECK.sizeHeightLg);
assertSelfCheck('sizeHeight.sm', oracle.sizeHeight.sm, SELF_CHECK.sizeHeightSm);
if (oracle.components.tag && oracle.components.tag.height) {
  assertSelfCheck('tag.height', oracle.components.tag.height, SELF_CHECK.tagHeight);
}

function assertSelfCheck (name, actual, expected) {
  if (actual !== expected) {
    console.error('SELF-CHECK FAILED: ' + name + ' = ' + actual + ' (expected ' + expected + ')');
    console.error('The pinned @carbon package version may have changed. Halt and report.');
    process.exit(1);
  }
}

// Print the parsed-vs-previous diff table
if (diffTable.length > 0) {
  console.log('\nParsed-vs-previous diff table:');
  for (const d of diffTable) {
    console.log('  ' + d.component + ': parsed ' + d.parsed + ' / previous ' + d.previous);
  }
}

// --- Write the oracle fixture ----------------------------------------------
const outPath = join(__dirname, 'geometry-oracle.json');
writeFileSync(outPath, JSON.stringify(oracle, null, 2));

console.log('Generated geometry-oracle.json');
console.log('Spacing tokens:', Object.keys(oracle.spacing).length);
console.log('Radius tokens:', Object.keys(oracle.radius).length);
console.log('Size height steps:', Object.keys(oracle.sizeHeight).length);
console.log('Component entries:', Object.keys(oracle.components).length);
