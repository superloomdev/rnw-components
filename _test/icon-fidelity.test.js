// Info: Icon contract and fidelity tests (Plan 0156, Part B).
//
// Validates the semantic icon manifest and ensures every component icon
// literal uses a name from the manifest. The manifest maps semantic names
// to vendor-specific glyphs (Carbon for web, Ionicons for Expo).
//
// This test catches:
// - Missing semantic names in the manifest
// - Component icon literals that bypass the manifest
// - Malformed manifest entries

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the icon manifest
const manifest = JSON.parse(
  readFileSync(join(__dirname, '..', 'data', 'icon-names.json'), 'utf8')
);

// --- Manifest structural validation -----------------------------------------

describe('icon manifest - structural validation', () => {

  it('should have _meta with description and version', () => {
    assert.ok(manifest._meta, 'manifest must have _meta');
    assert.ok(manifest._meta.description, 'manifest _meta must have description');
    assert.ok(manifest._meta.version, 'manifest _meta must have version');
  });

  it('should have an icons object with at least 15 entries', () => {
    assert.ok(manifest.icons, 'manifest must have icons object');
    const count = Object.keys(manifest.icons).length;
    assert.ok(count >= 15, `manifest should have at least 15 icons (got ${count})`);
  });

  it('every icon entry should have carbon and ionicons mappings', () => {
    for (const [name, entry] of Object.entries(manifest.icons)) {
      assert.ok(entry.carbon, `icon "${name}" must have a carbon mapping`);
      assert.ok(entry.ionicons, `icon "${name}" must have an ionicons mapping`);
    }
  });

  it('every icon entry should have non-empty carbon and ionicons strings', () => {
    for (const [name, entry] of Object.entries(manifest.icons)) {
      assert.equal(typeof entry.carbon, 'string', `icon "${name}" carbon must be a string`);
      assert.ok(entry.carbon.length > 0, `icon "${name}" carbon must be non-empty`);
      assert.equal(typeof entry.ionicons, 'string', `icon "${name}" ionicons must be a string`);
      assert.ok(entry.ionicons.length > 0, `icon "${name}" ionicons must be non-empty`);
    }
  });

  it('aliases should be an array of strings if present', () => {
    for (const [name, entry] of Object.entries(manifest.icons)) {
      if (entry.aliases) {
        assert.ok(Array.isArray(entry.aliases), `icon "${name}" aliases must be an array`);
        for (const alias of entry.aliases) {
          assert.equal(typeof alias, 'string', `icon "${name}" alias must be a string`);
        }
      }
    }
  });

});

// --- Component icon literal validation -------------------------------------

describe('icon manifest - component literal coverage', () => {

  // Collect all icon name literals from component source files
  function collectIconLiterals () {
    const componentDir = join(__dirname, '..', 'component');
    const literals = new Set();

    function scanDir (dir) {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.endsWith('.js')) {
          const content = readFileSync(fullPath, 'utf8');
          // Match name: 'something' or name: "something" patterns
          const matches = content.matchAll(/name:\s*['"]([a-z][a-z0-9_-]*)['"]/g);
          for (const match of matches) {
            // Filter out non-icon names (type sets, token names, etc.)
            const name = match[1];
            if (!['body01', 'body02', 'label01', 'label02', 'caption01',
              'heading01', 'heading02', 'heading03', 'interactive',
              'm_e_spacing_03', 'icon_primary', 'icon_secondary'].includes(name)) {
              literals.add(name);
            }
          }
        }
      }
    }

    scanDir(componentDir);
    return literals;
  }

  it('every component icon literal should be in the manifest (or an alias)', () => {
    const literals = collectIconLiterals();

    // Build the set of all valid names (canonical + aliases)
    const validNames = new Set();
    for (const [name, entry] of Object.entries(manifest.icons)) {
      validNames.add(name);
      if (entry.aliases) {
        for (const alias of entry.aliases) {
          validNames.add(alias);
        }
      }
    }

    const missing = [];
    for (const literal of literals) {
      if (!validNames.has(literal)) {
        missing.push(literal);
      }
    }

    assert.deepEqual(missing, [],
      `component icon literals not in manifest: ${missing.join(', ')}`);
  });

  it('no duplicate canonical names or aliases in the manifest', () => {
    const allNames = new Map();
    for (const [name, entry] of Object.entries(manifest.icons)) {
      assert.ok(!allNames.has(name), `duplicate canonical name: ${name}`);
      allNames.set(name, 'canonical');
      if (entry.aliases) {
        for (const alias of entry.aliases) {
          assert.ok(!allNames.has(alias), `duplicate alias: ${alias}`);
          allNames.set(alias, `alias of ${name}`);
        }
      }
    }
  });

});

// --- Spec sheet icon name validation ---------------------------------------

describe('icon manifest - spec sheet consistency', () => {

  it('spec sheet icon names should be in the manifest', async () => {
    const spec = (await import('../data/component-spec.js')).default;

    // Check notification dismiss icon
    assert.ok(manifest.icons[spec.notification.dismissIcon],
      `spec.notification.dismissIcon "${spec.notification.dismissIcon}" must be in manifest`);

    // Check tag dismiss icon
    assert.ok(manifest.icons[spec.tag.dismissIcon],
      `spec.tag.dismissIcon "${spec.tag.dismissIcon}" must be in manifest`);

    // Check fileUploaderItem remove icon
    assert.ok(manifest.icons[spec.fileUploaderItem.removeIcon],
      `spec.fileUploaderItem.removeIcon "${spec.fileUploaderItem.removeIcon}" must be in manifest`);

    // Check copyButton icons
    assert.ok(manifest.icons[spec.copyButton.copyIcon],
      `spec.copyButton.copyIcon "${spec.copyButton.copyIcon}" must be in manifest`);
    assert.ok(manifest.icons[spec.copyButton.checkIcon],
      `spec.copyButton.checkIcon "${spec.copyButton.checkIcon}" must be in manifest`);

    // Check passwordInput toggle icons
    assert.ok(manifest.icons[spec.passwordInput.toggleIcon],
      `spec.passwordInput.toggleIcon "${spec.passwordInput.toggleIcon}" must be in manifest`);
    assert.ok(manifest.icons[spec.passwordInput.toggleIconOff],
      `spec.passwordInput.toggleIconOff "${spec.passwordInput.toggleIconOff}" must be in manifest`);
  });

});
