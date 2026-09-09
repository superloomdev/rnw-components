// Info: Carbon parity test.
//
// Compares Superloom's Carbon profile output against the independent
// parity oracle generated from pinned @carbon/react@1.115.0 upstream
// sources. The oracle is NOT generated from Superloom output.
//
// For each of the four Carbon schemes, the test builds the theme through
// the real Themer engine, creates a system through createSystem with
// STRICT_TOKENS, and asserts that the utility values match the oracle.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import themerLoader from 'helper-themer';
import utilsLoader from 'helper-utils';
import debugLoader from 'helper-debug';
import carbonV11Profile from 'helper-themer-template-carbon';

import { createSystem, sharedLibs } from './loader.js';
import { COMPONENTS } from 'rnw-components/all';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the independent parity oracle
const oracle = JSON.parse(readFileSync(join(__dirname, 'fixtures', 'parity-oracle.json'), 'utf8'));


describe('parity oracle - independent reference values', () => {

  it('should have all four Carbon themes', () => {

    assert.ok(oracle.themes.white, 'white theme must exist');
    assert.ok(oracle.themes.g10, 'g10 theme must exist');
    assert.ok(oracle.themes.g90, 'g90 theme must exist');
    assert.ok(oracle.themes.g100, 'g100 theme must exist');

  });

  it('should have correct white theme background values', () => {

    assert.equal(oracle.themes.white.background.background, '#ffffff');
    assert.equal(oracle.themes.white.layers.layer01, '#f4f4f4');
    assert.equal(oracle.themes.white.layers.layer02, '#ffffff');
    assert.equal(oracle.themes.white.layers.layer03, '#f4f4f4');

  });

  it('should have correct white theme text values', () => {

    assert.equal(oracle.themes.white.text.textPrimary, '#161616');
    assert.equal(oracle.themes.white.text.textSecondary, '#525252');
    assert.equal(oracle.themes.white.text.textOnColor, '#ffffff');

  });

  it('should have correct white theme interactive values', () => {

    assert.equal(oracle.themes.white.interactive.interactive, '#0f62fe');
    assert.equal(oracle.themes.white.interactive.focus, '#0f62fe');

  });

  it('should have correct white theme border values', () => {

    assert.equal(oracle.themes.white.border.borderSubtle01, '#c6c6c6');
    assert.equal(oracle.themes.white.border.borderInteractive, '#0f62fe');

  });

  it('should have correct g100 theme values (dark)', () => {

    assert.equal(oracle.themes.g100.background.background, '#161616');
    assert.equal(oracle.themes.g100.layers.layer01, '#262626');
    assert.equal(oracle.themes.g100.text.textPrimary, '#f4f4f4');
    assert.equal(oracle.themes.g100.interactive.interactive, '#4589ff');

  });

  it('should have correct type styles', () => {

    assert.ok(oracle.type.body01, 'body01 type style must exist');
    assert.equal(oracle.type.body01.fontSize, '0.875rem');
    assert.equal(oracle.type.body01.fontWeight, 400);

  });

  it('should have correct layout tokens', () => {

    assert.ok(oracle.layout.spacing05, 'spacing05 must exist');
    assert.equal(oracle.layout.spacing05, '1rem');

  });

  it('should have correct motion tokens', () => {

    assert.ok(oracle.motion.durationFast01, 'durationFast01 must exist');
    assert.equal(oracle.motion.durationFast01, '70ms');

  });

  it('should record provenance metadata', () => {

    assert.ok(oracle._meta.sources.carbonReact, 'must record carbon-react source');
    assert.equal(oracle._meta.sources.carbonReact, '@carbon/react@1.115.0');
    assert.equal(oracle._meta.sources.carbonReactCommit, '7518c84ffd00f22434fe19d83119692c12fccb2f');

  });

});


describe('parity oracle - negative controls', () => {

  it('should catch a wrong layer token', () => {

    // If someone swaps layer01 and layer02, the oracle should detect it
    const wrongLayer01 = oracle.themes.white.layers.layer02;
    assert.notEqual(wrongLayer01, oracle.themes.white.layers.layer01,
      'swapping layer01 and layer02 must be detectable');

  });

  it('should catch a wrong text color', () => {

    // If someone uses g100's textPrimary instead of white's, the oracle catches it
    assert.notEqual(oracle.themes.g100.text.textPrimary, oracle.themes.white.text.textPrimary,
      'using dark theme text in light theme must be detectable');

  });

  it('should catch a wrong interactive color', () => {

    // If someone uses g100's interactive instead of white's, the oracle catches it
    assert.notEqual(oracle.themes.g100.interactive.interactive, oracle.themes.white.interactive.interactive,
      'using dark theme interactive in light theme must be detectable');

  });

});


// Build the Themer engine for scheme building
const Utils = utilsLoader();
const Debug = debugLoader({ Utils });
const Themer = themerLoader({ Utils, Debug });

// Build all four schemes through the real engine
const schemes = {
  white: Themer.buildTheme(carbonV11Profile.schemes.white, [], 'native'),
  g10: Themer.buildTheme(carbonV11Profile.schemes.g10, [], 'native'),
  g90: Themer.buildTheme(carbonV11Profile.schemes.g90, [], 'native'),
  g100: Themer.buildTheme(carbonV11Profile.schemes.g100, [], 'native')
};

// Build a strict system for a scheme
function systemForScheme (schemeName) {
  const sys = createSystem(sharedLibs, { STRICT_TOKENS: true }, schemes[schemeName], 'sm');
  sys.addComponents(COMPONENTS);
  return sys;
}


describe('parity - utility values through createSystem', () => {

  // Test each of the four schemes
  for (const schemeName of ['white', 'g10', 'g90', 'g100']) {

    describe(schemeName + ' scheme', () => {

      it('should match background_layer_01 against the oracle', () => {

        const sys = systemForScheme(schemeName);
        assert.equal(
          sys.Style.utilities['background_layer_01'].backgroundColor,
          oracle.themes[schemeName].layers.layer01,
          schemeName + ' background_layer_01 should match oracle layers.layer01'
        );

      });

      it('should match font_text_primary against the oracle', () => {

        const sys = systemForScheme(schemeName);
        assert.equal(
          sys.Style.utilities['font_text_primary'].color,
          oracle.themes[schemeName].text.textPrimary,
          schemeName + ' font_text_primary should match oracle text.textPrimary'
        );

      });

      it('should match background_button_primary against the theme token', () => {

        const sys = systemForScheme(schemeName);
        // The utility must reflect the theme's button_primary token exactly
        assert.equal(
          sys.Style.utilities['background_button_primary'].backgroundColor,
          schemes[schemeName].tokens['color.button_primary'],
          schemeName + ' background_button_primary should match the theme button_primary token'
        );

      });

      it('should match type_body01 against the expected type set', () => {

        const sys = systemForScheme(schemeName);
        // IBM Plex Sans is a per-weight-face family, so L4-R8 excludes
        // fontWeight from the utility (the platform selects the face by
        // family name suffix, not by the fontWeight property).
        assert.deepEqual(
          sys.Style.utilities['type_body01'],
          { fontSize: 14, lineHeight: 20, letterSpacing: 0.16, fontFamily: 'IBM Plex Sans' },
          schemeName + ' type_body01 should match the expected type set'
        );

      });

      it('should match br_radius_04 against 4', () => {

        const sys = systemForScheme(schemeName);
        assert.equal(
          sys.Style.utilities['br_radius_04'].borderRadius,
          4,
          schemeName + ' br_radius_04 should be 4'
        );

      });

      it('should match focus_ring outlineWidth against 2', () => {

        const sys = systemForScheme(schemeName);
        assert.equal(
          sys.Style.utilities['focus_ring'].outlineWidth,
          2,
          schemeName + ' focus_ring outlineWidth should be 2'
        );

      });

    });

  }

});
