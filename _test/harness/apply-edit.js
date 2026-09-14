// Info: Assertion-integrity edit helper for fire.sh.
//
// Applies a single find->replace edit at the first occurrence of `find` in
// the target file. Asserts the needle exists before editing. Exits non-zero
// if the needle is absent so fire.sh fails loudly on a stale entry.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const [, , file, find, replace] = process.argv;

if (!file || !find || !replace === undefined) {
  console.error('usage: apply-edit.js <file> <find> <replace>');
  process.exit(2);
}

const absPath = resolve(file);
let content = readFileSync(absPath, 'utf8');

const idx = content.indexOf(find);
if (idx === -1) {
  console.error('NEEDLE NOT FOUND: "' + find + '" in ' + file);
  process.exit(1);
}

// Replace only the first occurrence
content = content.substring(0, idx) + replace + content.substring(idx + find.length);
writeFileSync(absPath, content, 'utf8');
console.log('EDITED: ' + file);
