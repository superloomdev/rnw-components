// Info: Spec sheet validation tests.
//
// Validates that the component spec sheet values match the Carbon geometry
// oracle. The oracle is generated from pinned @carbon/styles SCSS, so any
// departure from Carbon's authoritative values is caught here.
//
// This test file is a permanent gate: it prevents arbitrary "looks right"
// values from entering the spec sheet.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the spec sheet and oracle
const spec = (await import('../data/component-spec.js')).default;
const oracle = JSON.parse(
  readFileSync(join(__dirname, 'fixtures', 'geometry-oracle.json'), 'utf8')
);

// --- Spec sheet structural validation -------------------------------------

describe('spec sheet - structural validation', () => {

  it('should be a frozen object', () => {
    assert.ok(Object.isFrozen(spec), 'component-spec.js must be frozen');
  });

  it('every spec entry should be frozen', () => {
    for (const [name, entry] of Object.entries(spec)) {
      assert.ok(Object.isFrozen(entry), `spec.${name} must be frozen`);
    }
  });

  it('every state map should be frozen', () => {
    for (const [name, entry] of Object.entries(spec)) {
      if (entry.states) {
        assert.ok(Object.isFrozen(entry.states), `spec.${name}.states must be frozen`);
        for (const [state, tokens] of Object.entries(entry.states)) {
          assert.ok(Object.isFrozen(tokens), `spec.${name}.states.${state} must be frozen`);
        }
      }
    }
  });

});

// --- Spec values vs Carbon geometry oracle --------------------------------

describe('spec sheet - Carbon geometry oracle validation', () => {

  it('textInput height should match Carbon layout.size md (40px)', () => {
    assert.equal(spec.textInput.height, oracle.sizeHeight.md,
      'textInput.height must match Carbon layout.size("height") at md step');
  });

  it('textInput paddingInline should match Carbon density normal (16px)', () => {
    assert.equal(spec.textInput.paddingInline, oracle.densityPaddingInline.normal,
      'textInput.paddingInline must match Carbon density("padding-inline") at normal step');
  });

  it('button height should match Carbon layout.size md (40px)', () => {
    assert.equal(spec.button.height, oracle.sizeHeight.md,
      'button.height must match Carbon layout.size("height") at md step');
  });

  it('button iconSize should match Carbon button icon (20px)', () => {
    assert.equal(spec.button.iconSize, 20,
      'button.iconSize must match Carbon button icon size (20px)');
  });

  it('search height should match Carbon layout.size md (40px)', () => {
    assert.equal(spec.search.height, oracle.sizeHeight.md);
  });

  it('passwordInput height should match Carbon layout.size md (40px)', () => {
    assert.equal(spec.passwordInput.height, oracle.sizeHeight.md);
  });

  it('numberInput height should match Carbon layout.size md (40px)', () => {
    assert.equal(spec.numberInput.height, oracle.sizeHeight.md);
  });

  it('numberInput stepperIconSize should match Carbon (20px)', () => {
    assert.equal(spec.numberInput.stepperIconSize, 20);
  });

  it('tag height should match Carbon layout.size sm (32px)', () => {
    assert.equal(spec.tag.height, oracle.sizeHeight.sm,
      'tag.height must match Carbon layout.size("height") at sm step');
  });

  it('tag dismissTargetSize should match Carbon (24px)', () => {
    assert.equal(spec.tag.dismissTargetSize, 24);
  });

  it('notification iconSize should match Carbon (20px)', () => {
    assert.equal(spec.notification.iconSize, 20);
  });

  it('fileUploaderItem removeTargetSize should match Carbon sm (32px)', () => {
    assert.equal(spec.fileUploaderItem.removeTargetSize, oracle.sizeHeight.sm);
  });

  it('copyButton targetSize should match Carbon sm (32px)', () => {
    assert.equal(spec.copyButton.targetSize, oracle.sizeHeight.sm);
  });

  it('bottomNavigation itemHeight should match Carbon md (40px)', () => {
    assert.equal(spec.bottomNavigation.itemHeight, oracle.sizeHeight.md);
  });

  it('bottomNavigation iconSize should match Carbon (20px)', () => {
    assert.equal(spec.bottomNavigation.iconSize, 20);
  });

  it('icon sizes should match Carbon icon sizes (16, 20, 24, 32)', () => {
    assert.deepEqual(spec.icon.sizes, { sm: 16, md: 20, lg: 24, xl: 32 });
  });

  it('textInput controlSize should match Carbon layout.size md (40px)', () => {
    assert.equal(spec.textInput.controlSize, oracle.sizeHeight.md,
      'textInput.controlSize must match Carbon layout.size("height") at md step (field-adjacent control target)');
  });

  it('notification dismissTargetSize should match Carbon layout.size lg (48px)', () => {
    assert.equal(spec.notification.dismissTargetSize, oracle.sizeHeight.lg,
      'notification.dismissTargetSize must match Carbon layout.size("height") at lg step (notification dismiss target)');
  });

  it('target minSize should match Carbon layout.size xs (24px)', () => {
    assert.equal(spec.target.minSize, oracle.sizeHeight.xs,
      'target.minSize must match Carbon layout.size("height") at xs step (minimum pressable target)');
  });

});

// --- Frame mode validation ------------------------------------------------

describe('spec sheet - frame mode validation', () => {

  it('textInput frameMode should be feedback.field', () => {
    assert.equal(spec.textInput.frameMode, 'feedback.field',
      'textInput.frameMode must resolve through the feedback.field token');
  });

  it('search frameMode should be feedback.field', () => {
    assert.equal(spec.search.frameMode, 'feedback.field');
  });

  it('passwordInput frameMode should be feedback.field', () => {
    assert.equal(spec.passwordInput.frameMode, 'feedback.field');
  });

  it('numberInput frameMode should be feedback.field', () => {
    assert.equal(spec.numberInput.frameMode, 'feedback.field');
  });

  it('all field specs should declare minWidth: 0', () => {
    const fieldSpecs = ['textInput', 'search', 'passwordInput', 'numberInput'];
    for (const name of fieldSpecs) {
      assert.equal(spec[name].minWidth, 0,
        `spec.${name}.minWidth must be 0 to prevent intrinsic min-width overflow`);
    }
  });

  it('all composite field specs should declare innerInputUnframed: true', () => {
    const compositeSpecs = ['search', 'passwordInput', 'numberInput'];
    for (const name of compositeSpecs) {
      assert.equal(spec[name].innerInputUnframed, true,
        `spec.${name}.innerInputUnframed must be true (wrapper owns the frame)`);
    }
  });

});

// --- Coverage manifest validation -----------------------------------------

describe('spec coverage manifest', () => {

  it('should account for every component', async () => {
    const coverage = (await import('../data/spec-coverage.js')).default;
    const specced = Object.keys(coverage.specced);
    const partD = coverage.partD;
    const unspecced = Object.keys(coverage.unspecced);
    const total = specced.length + partD.length + unspecced.length;

    // The component roster has 134 components
    assert.equal(total, 134,
      `coverage manifest must account for all components (got ${total}, expected 134)`);
  });

  it('unspecced count should not grow (ratchet)', async () => {
    const coverage = (await import('../data/spec-coverage.js')).default;
    const unspecced = Object.keys(coverage.unspecced);

    // Lower this constant when sheets land, never raise it.
    const UNSPECCED_BASELINE = 116;

    assert.ok(unspecced.length <= UNSPECCED_BASELINE,
      `unspecced count grew from ${UNSPECCED_BASELINE} to ${unspecced.length}; lower the baseline only when a sheet lands, never raise it`);
  });

  it('every specced component should have a spec entry', async () => {
    const coverage = (await import('../data/spec-coverage.js')).default;
    for (const [componentName, specKey] of Object.entries(coverage.specced)) {
      assert.ok(spec[specKey],
        `specced component ${componentName} maps to spec.${specKey} but no entry exists`);
    }
  });

});

// --- State token resolution validation -------------------------------------

describe('spec sheet - state token resolution', () => {

  it('every states.* token should resolve as a strict utility', async () => {

    // Build a system to obtain the strict utilities (same pattern as system.test.js)
    const { createSystem } = await import('rnw-components');
    const { Utils, Debug, Themer, React, TestRenderer, Device, Icons } = await import('./loader.js');
    const { buildCarbonWhite } = await import('./harness/themes.js');
    const sharedLibs = { Utils, Debug, React, Device, Themer, Icons };
    const system = createSystem(sharedLibs, {}, buildCarbonWhite(), 'sm');
    const utilities = system.Style.utilities;

    // Walk every spec sheet that has states, and verify each border/background/text
    // token resolves to a utility key (border_color_<x> / background_<x> / font_<x>)
    for (const [sheetName, sheet] of Object.entries(spec)) {
      if (!sheet.states) {
        continue;
      }
      for (const [stateName, stateTokens] of Object.entries(sheet.states)) {
        // Border token -> border_color_<x>
        if (stateTokens.border) {
          const token = stateTokens.border.replace(/^color\./, '');
          const key = 'border_color_' + token;
          assert.ok(key in utilities,
            `spec.${sheetName}.states.${stateName}.border "${stateTokens.border}" -> "${key}" not found in Style.utilities`);
        }
        // Background token -> background_<x>
        if (stateTokens.background) {
          const token = stateTokens.background.replace(/^color\./, '');
          const key = 'background_' + token;
          assert.ok(key in utilities,
            `spec.${sheetName}.states.${stateName}.background "${stateTokens.background}" -> "${key}" not found in Style.utilities`);
        }
        // Text token -> font_<x>
        if (stateTokens.text) {
          const token = stateTokens.text.replace(/^color\./, '');
          const key = 'font_' + token;
          assert.ok(key in utilities,
            `spec.${sheetName}.states.${stateName}.text "${stateTokens.text}" -> "${key}" not found in Style.utilities`);
        }
      }
    }

  });

});
