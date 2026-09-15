// Info: Assertion-integrity fire runner.
//
// Reads fixtures/assertion-integrity.json, applies each edit, runs the
// named test, asserts nonzero exit (FIRED), restores the backup, runs
// again, asserts zero exit (RESTORED). Prints INERT/BROKEN for entries
// that do not fire or restore. Always restores even on failure.

import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const TEST_DIR = resolve(__dirname, '..');
const FIXTURE = join(TEST_DIR, 'fixtures', 'assertion-integrity.json');
const HARNESS = join(TEST_DIR, 'harness', 'apply-edit.js');

const entries = JSON.parse(readFileSync(FIXTURE, 'utf8'));
const backupDir = mkdtempSync(join(tmpdir(), 'fire-'));
let failures = 0;

function restoreBackup(file, backupPath) {
  copyFileSync(backupPath, join(REPO_ROOT, file));
}

function runTest(test, runner, testName) {
  if (runner === 'l3') {
    return spawnSync('npm', ['run', 'test:l3', '--silent'], {
      cwd: TEST_DIR, stdio: 'ignore'
    }).status;
  }
  const args = ['--import', './harness/register.js'];
  if (testName) {
    args.push('--test-name-pattern=' + testName);
  }
  args.push('--test', test);
  return spawnSync('node', args, {
    cwd: TEST_DIR, stdio: 'ignore'
  }).status;
}

// Always restore on exit
process.on('exit', () => {
  for (const e of entries) {
    const backup = join(backupDir, e.file.replace(/\//g, '_'));
    try { restoreBackup(e.file, backup); } catch {}
  }
  rmSync(backupDir, { recursive: true, force: true });
});

for (const e of entries) {
  const { name, file, find, replace, test, runner, testName } = e;
  const absPath = join(REPO_ROOT, file);
  const backup = join(backupDir, file.replace(/\//g, '_'));

  // Backup the original file content
  copyFileSync(absPath, backup);

  // Apply the edit using the helper
  const editResult = spawnSync('node', [HARNESS, absPath, find, replace], {
    stdio: 'pipe'
  });

  if (editResult.status !== 0) {
    console.log(`INERT ${name} (needle not found)`);
    restoreBackup(file, backup);
    failures++;
    continue;
  }

  // Run the test (expect failure: nonzero exit)
  const firedExit = runTest(test, runner, testName);

  // Restore from backup
  restoreBackup(file, backup);

  if (firedExit === 0) {
    console.log(`INERT ${name} (test passed after edit - assertion is dead)`);
    failures++;
    continue;
  }

  // Run the test again (expect pass: zero exit)
  const restoredExit = runTest(test, runner, testName);

  if (restoredExit !== 0) {
    console.log(`BROKEN ${name} (test failed after restore)`);
    failures++;
    continue;
  }

  console.log(`FIRED ${name}`);
  console.log(`RESTORED ${name}`);
}

process.exit(failures);
