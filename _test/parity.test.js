// Info: Carbon parity test (Plan 0149, Step 4.1).
//
// This test compares Superloom's Carbon profile output against the
// independent parity oracle generated from pinned @carbon/react@1.115.0
// upstream sources. The oracle is NOT generated from Superloom output.
//
// During Step 4.1, the Carbon profile data does not yet exist (Step 4.2
// creates it). This test records the expected state: the profile is not
// yet available, so the oracle exists but the comparison is blocked.
//
// After Step 4.2 ships the profile, this test will compare actual emitted
// values against the oracle and report mismatches.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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


describe('parity oracle - Superloom profile comparison', () => {

  let profiles;

  it('should import the Carbon profile from ./theme', async () => {

    profiles = await import('rnw-components/theme');
    assert.ok(profiles.white, 'white profile must exist');
    assert.ok(profiles.g10, 'g10 profile must exist');
    assert.ok(profiles.g90, 'g90 profile must exist');
    assert.ok(profiles.g100, 'g100 profile must exist');

  });

  it('should match white profile background values against the oracle', () => {

    const w = profiles.white.tokens;
    assert.equal(w['color.background'], oracle.themes.white.background.background);
    assert.equal(w['color.layer_01'], oracle.themes.white.layers.layer01);
    assert.equal(w['color.layer_02'], oracle.themes.white.layers.layer02);
    assert.equal(w['color.layer_03'], oracle.themes.white.layers.layer03);

  });

  it('should match white profile text values against the oracle', () => {

    const w = profiles.white.tokens;
    assert.equal(w['color.text_primary'], oracle.themes.white.text.textPrimary);
    assert.equal(w['color.text_secondary'], oracle.themes.white.text.textSecondary);
    assert.equal(w['color.text_on_color'], oracle.themes.white.text.textOnColor);

  });

  it('should match white profile interactive values against the oracle', () => {

    const w = profiles.white.tokens;
    assert.equal(w['color.interactive'], oracle.themes.white.interactive.interactive);
    assert.equal(w['color.focus'], oracle.themes.white.interactive.focus);

  });

  it('should match white profile border values against the oracle', () => {

    const w = profiles.white.tokens;
    assert.equal(w['color.border_subtle_01'], oracle.themes.white.border.borderSubtle01);
    assert.equal(w['color.border_interactive'], oracle.themes.white.border.borderInteractive);

  });

  it('should match g100 profile values against the oracle', () => {

    const g = profiles.g100.tokens;
    assert.equal(g['color.background'], oracle.themes.g100.background.background);
    assert.equal(g['color.layer_01'], oracle.themes.g100.layers.layer01);
    assert.equal(g['color.text_primary'], oracle.themes.g100.text.textPrimary);
    assert.equal(g['color.interactive'], oracle.themes.g100.interactive.interactive);

  });

  it('should match g10 profile values against the oracle', () => {

    const t = profiles.g10.tokens;
    assert.equal(t['color.background'], oracle.themes.g10.background.background);
    assert.equal(t['color.layer_01'], oracle.themes.g10.layers.layer01);
    assert.equal(t['color.text_primary'], oracle.themes.g10.text.textPrimary);

  });

  it('should match g90 profile values against the oracle', () => {

    const t = profiles.g90.tokens;
    assert.equal(t['color.background'], oracle.themes.g90.background.background);
    assert.equal(t['color.layer_01'], oracle.themes.g90.layers.layer01);
    assert.equal(t['color.text_primary'], oracle.themes.g90.text.textPrimary);

  });

});
