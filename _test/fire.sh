#!/usr/bin/env bash
# Info: Assertion-integrity fire script.
#
# Delegates to harness/fire-runner.js which reads fixtures/assertion-integrity.json,
# applies each edit, runs the named test, asserts nonzero exit (FIRED),
# restores the backup, runs again, asserts zero exit (RESTORED).
# Any entry that does not fire or does not restore prints INERT/BROKEN and
# exits 1 at the end. Always restores even on failure.

set -u
TEST_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$TEST_DIR"
node harness/fire-runner.js
