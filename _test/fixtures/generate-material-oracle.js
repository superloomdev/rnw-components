// Info: Material Design 3 geometry oracle generator.
//
// Parses pinned @material/web token files to extract authoritative geometry
// values for Material Design 3 components. The oracle records the exact
// package version and a method for every component entry.
//
// Run: node --import ./harness/register.js fixtures/generate-material-oracle.js
//
// Idempotent: two consecutive runs produce byte-identical JSON except the
// timestamp in _meta.generated.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Resolve the pinned @material/web version -----------------------------
const materialPkg = JSON.parse(
  readFileSync(join(__dirname, '..', 'node_modules', '@material/web', 'package.json'), 'utf8')
);
const materialVersion = materialPkg.version;

// --- Source directory ------------------------------------------------------
const TOKENS_DIR = join(__dirname, '..', 'node_modules', '@material/web', 'tokens', 'versions', 'v0_192');

// --- Value pattern (the whole parse) ---------------------------------------
// '<token-name>': if($exclude-hardcoded-values, null, <number>px)
const VALUE_PATTERN = /'([a-z-]+)':\s*if\(\$exclude-hardcoded-values,\s*null,\s*([0-9.]+)px\)/;

// Shape reference: map.get($deps, 'md-sys-shape', '<corner-name>')
const SHAPE_REF_PATTERN = /map\.get\(\$deps,\s*'md-sys-shape',\s*'([a-z-]+)'\)/;

// --- Component file mapping (written as data, not inferred) ----------------
const COMPONENT_FILES = {
  button: '_md-comp-filled-button.scss',
  tag: '_md-comp-assist-chip.scss',
  checkbox: '_md-comp-checkbox.scss',
  iconSwitch: '_md-comp-switch.scss',
  textInput: '_md-comp-filled-text-field.scss',
  notification: '_md-comp-banner.scss'
};

// --- Self-check constants (measured 2026-09-14) ----------------------------
const SELF_CHECK = {
  filledButtonHeight: 40,
  assistChipHeight: 32,
  switchTrackHeight: 32,
  switchStateLayerSize: 40,
  checkboxContainerSize: 18,
  checkboxIconSize: 18,
  checkboxStateLayerSize: 40,
  shapeCornerNone: 0,
  shapeCornerExtraSmall: 4,
  shapeCornerSmall: 8,
  shapeCornerMedium: 12,
  shapeCornerFull: 9999
};

// --- Parse a token file for a specific token name --------------------------
function parseTokenValue (scssPath, tokenName) {
  let content;
  try {
    content = readFileSync(scssPath, 'utf8');
  } catch {
    return null;
  }

  const pattern = new RegExp(
    "'" + tokenName + "':\\s*if\\(\\$exclude-hardcoded-values,\\s*null,\\s*([0-9.]+)px\\)"
  );
  const match = pattern.exec(content);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

// --- Parse shape reference -------------------------------------------------
function parseShapeRef (scssPath) {
  let content;
  try {
    content = readFileSync(scssPath, 'utf8');
  } catch {
    return null;
  }

  const match = SHAPE_REF_PATTERN.exec(content);
  if (match) {
    return match[1];
  }
  return null;
}

// --- Parse shape value from _md-sys-shape.scss ------------------------------
function parseShapeValue (cornerName) {
  const shapePath = join(TOKENS_DIR, '_md-sys-shape.scss');
  return parseTokenValue(shapePath, cornerName);
}

// --- Build the oracle ------------------------------------------------------
const oracle = {
  _meta: {
    generated: new Date().toISOString(),
    sources: {
      'material-web': '@material/web@' + materialVersion
    },
    description: 'Authoritative geometry values from pinned @material/web token files. Not generated from Superloom output.'
  },
  shape: {},
  components: {}
};

// Parse shape values
oracle.shape = {
  cornerNone: parseShapeValue('corner-none'),
  cornerExtraSmall: parseShapeValue('corner-extra-small'),
  cornerSmall: parseShapeValue('corner-small'),
  cornerMedium: parseShapeValue('corner-medium'),
  cornerFull: parseShapeValue('corner-full')
};

// --- Parse each component --------------------------------------------------
for (const [componentKey, scssFile] of Object.entries(COMPONENT_FILES)) {
  const scssPath = join(TOKENS_DIR, scssFile);

  // Special cases first
  if (componentKey === 'textInput') {
    // O4 gap: MD3 filled text field has no container-height token
    oracle.components[componentKey] = {
      method: 'none',
      source: '@material/web/tokens/versions/v0_192/' + scssFile,
      reason: 'MD3 filled text field height is not expressed as a token in this pin'
    };
    continue;
  }

  if (componentKey === 'notification') {
    // Banner has container-height but only for specific layouts, not a single default
    oracle.components[componentKey] = {
      method: 'none',
      source: '@material/web/tokens/versions/v0_192/' + scssFile,
      reason: 'MD3 banner height is content-driven with multiple layout variants, not a single size token'
    };
    continue;
  }

  // Parse container-height (or component-specific height token)
  let heightToken, heightValue;
  if (componentKey === 'checkbox') {
    heightToken = 'container-size';
  } else if (componentKey === 'iconSwitch') {
    heightToken = 'track-height';
  } else {
    heightToken = 'container-height';
  }
  heightValue = parseTokenValue(scssPath, heightToken);

  if (heightValue !== null) {
    const entry = {
      heightToken: heightToken,
      height: heightValue,
      source: '@material/web/tokens/versions/v0_192/' + scssFile,
      method: 'parsed'
    };

    // Parse additional fields per component
    if (componentKey === 'button') {
      // Parse shape
      const shapeRef = parseShapeRef(scssPath);
      if (shapeRef) {
        entry.shapeRef = shapeRef;
        entry.shapeValue = parseShapeValue(shapeRef);
      }
    }

    if (componentKey === 'tag') {
      // Parse shape
      const shapeRef = parseShapeRef(scssPath);
      if (shapeRef) {
        entry.shapeRef = shapeRef;
        entry.shapeValue = parseShapeValue(shapeRef);
      }
    }

    if (componentKey === 'checkbox') {
      entry.iconSize = parseTokenValue(scssPath, 'icon-size');
      entry.stateLayerSize = parseTokenValue(scssPath, 'state-layer-size');
    }

    if (componentKey === 'iconSwitch') {
      entry.trackHeight = parseTokenValue(scssPath, 'track-height');
      entry.stateLayerSize = parseTokenValue(scssPath, 'state-layer-size');
      const shapeRef = parseShapeRef(scssPath);
      if (shapeRef) {
        entry.shapeRef = shapeRef;
        entry.shapeValue = parseShapeValue(shapeRef);
      }
    }

    oracle.components[componentKey] = entry;
  } else {
    // No container-height found
    oracle.components[componentKey] = {
      method: 'none',
      source: '@material/web/tokens/versions/v0_192/' + scssFile,
      reason: 'No ' + heightToken + ' token found in component file'
    };
  }
}

// --- Components with no Material counterpart --------------------------------
const LEDGER_COMPONENTS = [
  'search', 'numberInput', 'passwordInput', 'fileUploaderItem',
  'copyButton', 'bottomNavigation', 'select'
];
for (const componentKey of LEDGER_COMPONENTS) {
  oracle.components[componentKey] = {
    method: 'none',
    reason: 'no Material component token file'
  };
}

// --- Self-check: assert the measured known-good values --------------------
function assertSelfCheck (name, actual, expected) {
  if (actual !== expected) {
    console.error('SELF-CHECK FAILED: ' + name + ' = ' + actual + ' (expected ' + expected + ')');
    console.error('The pinned @material/web package version may have changed. Halt and report.');
    process.exit(1);
  }
}

assertSelfCheck('filled-button container-height', oracle.components.button.height, SELF_CHECK.filledButtonHeight);
assertSelfCheck('assist-chip container-height', oracle.components.tag.height, SELF_CHECK.assistChipHeight);
assertSelfCheck('switch track-height', oracle.components.iconSwitch.trackHeight, SELF_CHECK.switchTrackHeight);
assertSelfCheck('switch state-layer-size', oracle.components.iconSwitch.stateLayerSize, SELF_CHECK.switchStateLayerSize);
assertSelfCheck('checkbox container-size', oracle.components.checkbox.height, SELF_CHECK.checkboxContainerSize);
assertSelfCheck('checkbox icon-size', oracle.components.checkbox.iconSize, SELF_CHECK.checkboxIconSize);
assertSelfCheck('checkbox state-layer-size', oracle.components.checkbox.stateLayerSize, SELF_CHECK.checkboxStateLayerSize);
assertSelfCheck('shape corner-none', oracle.shape.cornerNone, SELF_CHECK.shapeCornerNone);
assertSelfCheck('shape corner-extra-small', oracle.shape.cornerExtraSmall, SELF_CHECK.shapeCornerExtraSmall);
assertSelfCheck('shape corner-small', oracle.shape.cornerSmall, SELF_CHECK.shapeCornerSmall);
assertSelfCheck('shape corner-medium', oracle.shape.cornerMedium, SELF_CHECK.shapeCornerMedium);
assertSelfCheck('shape corner-full', oracle.shape.cornerFull, SELF_CHECK.shapeCornerFull);

// --- Write the oracle fixture ----------------------------------------------
const outPath = join(__dirname, 'material-geometry-oracle.json');
writeFileSync(outPath, JSON.stringify(oracle, null, 2));

console.log('Generated material-geometry-oracle.json');
console.log('Source: @material/web@' + materialVersion);
console.log('Shape tokens:', Object.keys(oracle.shape).length);
console.log('Component entries:', Object.keys(oracle.components).length);
const parsedCount = Object.values(oracle.components).filter(c => c.method === 'parsed').length;
const noneCount = Object.values(oracle.components).filter(c => c.method === 'none').length;
console.log('Parsed:', parsedCount, '/ None:', noneCount);
