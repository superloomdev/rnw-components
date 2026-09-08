// Info: Tree-shaking enforcement gate for the createSystem entry point.
//
// The whole point of createSystem is that a consumer importing a handful of
// named components ships only those factories. That property is invisible in
// unit tests and silently regresses the moment something in components.js
// makes the whole roster reachable from a named export. This suite bundles two
// throwaway entry points with esbuild - one importing the registration barrel,
// one importing five components by name - and asserts the module counts, so a
// regression fails CI instead of quietly shipping a 40x larger bundle.
//
// esbuild is already a dev dependency here; the L3 visual suite uses it.

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';


// ========================= CONSTANTS ====================================== //

// Directory for the throwaway entry points and their bundles
const SCRATCH = path.join(import.meta.dirname, '.treeshake-scratch');

// Shared esbuild flags. The node:module alias is required because helper-utils
// reaches for createRequire to load JSON, which a browser bundle cannot do.
const ESBUILD_FLAGS = [
  '--bundle',
  '--format=esm',
  '--platform=browser',
  '--alias:react-native=react-native-web',
  '--alias:node:module=./harness/node-module-stub.js'
];

// The five components the createSystem probe imports by name
const PROBE_COMPONENTS = ['View', 'Text', 'Button', 'Icon', 'Dropdown'];

// The barrel pulls in every component; a named subset pulls in the five
// named imports plus component/commonStyles.js as shared infrastructure.
const EXPECTED_BARREL_MODULES = 247;
const EXPECTED_SUBSET_MODULES = PROBE_COMPONENTS.length + 1;

// A subset bundle must be at most this fraction of the barrel bundle
const MAX_SIZE_RATIO = 0.35;


// ========================= HELPERS ======================================== //

/********************************************************************
Bundle one entry point with esbuild and return the output text.

@param {String} entryName - File name inside the scratch directory
@param {String} source    - Entry point source to bundle

@return {String} - Bundle contents
*********************************************************************/
function bundleEntry (entryName, source) {

  // Write the throwaway entry point into the scratch directory
  const entryPath = path.join(SCRATCH, entryName);
  const outPath = path.join(SCRATCH, entryName.replace('.js', '.bundle.js'));
  fs.writeFileSync(entryPath, source, 'utf8');

  // Bundle it from _test so node_modules resolves the full dependency set
  execFileSync(
    'npx',
    ['esbuild', entryPath].concat(ESBUILD_FLAGS, ['--outfile=' + outPath]),
    { cwd: import.meta.dirname, stdio: 'pipe' }
  );

  // Return the bundle text for inspection
  return fs.readFileSync(outPath, 'utf8');

}


/********************************************************************
Count the component modules esbuild included in a bundle. esbuild
emits one `// <relative path>` banner per included module.

@param {String} bundle - Bundle contents

@return {Number} - Count of included component modules
*********************************************************************/
function countComponentModules (bundle) {

  // Match one banner comment per bundled component module
  const matches = bundle.match(/^\/\/ \.\.\/component\//gm);

  // Return zero when the bundle contains no component modules at all
  return matches === null ? 0 : matches.length;

}


/********************************************************************
List the component module paths esbuild included in a bundle.

@param {String} bundle - Bundle contents

@return {Array} - Sorted relative paths such as 'atom/text.js'
*********************************************************************/
function listComponentModules (bundle) {

  // Collect every subdirectory-qualified component module banner
  const matches = bundle.match(/^\/\/ \.\.\/component\/[a-z]+\/[A-Za-z0-9]+\.js/gm) || [];

  // Strip the banner prefix and sort for a stable comparison
  return matches
    .map(function (line) {
      return line.replace('// ../component/', '');
    })
    .sort();

}


// ========================= FIXTURES ======================================= //

let barrelBundle;
let subsetBundle;

before(function () {

  // Create a clean scratch directory for this run
  fs.rmSync(SCRATCH, { recursive: true, force: true });
  fs.mkdirSync(SCRATCH, { recursive: true });

  // Bundle the barrel path, which reaches every component
  barrelBundle = bundleEntry(
    'probe-barrel.js',
    'import { createSystem } from \'rnw-components\';\n'
    + 'import { COMPONENTS } from \'rnw-components/all\';\n'
    + 'globalThis.__probe = [typeof createSystem, Object.keys(COMPONENTS).length];\n'
  );

  // Bundle a named subset of five components
  const named = ['createSystem'].concat(PROBE_COMPONENTS).join(', ');
  subsetBundle = bundleEntry(
    'probe-subset.js',
    'import { ' + named + ' } from \'rnw-components\';\n'
    + 'globalThis.__probe = [' + named + '].length;\n'
  );

});

after(function () {

  // Remove the scratch directory so no probe artifact survives the run
  fs.rmSync(SCRATCH, { recursive: true, force: true });

});


// ========================= TIER 1 - TREE-SHAKING GATE ===================== //

describe('tree-shaking', function () {

  it('should bundle every component through the registration barrel', function () {

    assert.strictEqual(countComponentModules(barrelBundle), EXPECTED_BARREL_MODULES);

  });

  it('should bundle only the named imports for a subset consumer', function () {

    assert.strictEqual(countComponentModules(subsetBundle), EXPECTED_SUBSET_MODULES);

  });

  it('should include exactly the five requested component modules', function () {

    const expected = [
      'atom/button.js',
      'atom/icon.js',
      'atom/text.js',
      'atom/view.js',
      'molecule/dropdown.js'
    ];

    assert.deepStrictEqual(listComponentModules(subsetBundle), expected);

  });

  it('should drop an unimported component that the barrel includes', function () {

    // acceptTerms is never imported by the subset probe and is reachable only
    // through the barrel. Present in one bundle and absent from the other
    // proves the barrel was not pulled in transitively.
    assert.ok(
      barrelBundle.indexOf('acceptTerms') !== -1,
      'acceptTerms missing from the barrel bundle, so the probe is not measuring the barrel'
    );

    assert.ok(
      subsetBundle.indexOf('acceptTerms') === -1,
      'acceptTerms leaked into the subset bundle, so the barrel was reached transitively'
    );

  });

  it('should not reach the barrel from the package root', function () {

    // Importing named components must never pull all.js into the graph.
    assert.ok(
      subsetBundle.indexOf('../all.js') === -1,
      'all.js was bundled by a named-import consumer'
    );

  });

  it('should keep the subset bundle far smaller than the barrel bundle', function () {

    const ratio = subsetBundle.length / barrelBundle.length;

    assert.ok(
      ratio <= MAX_SIZE_RATIO,
      'subset bundle is ' + Math.round(ratio * 100) + '% of the barrel bundle, '
      + 'expected at most ' + Math.round(MAX_SIZE_RATIO * 100) + '%'
    );

  });

});
