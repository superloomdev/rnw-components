// Info: Playwright configuration for L3 interaction tests.
// Headless Chromium only. Starts Vite dev server on port 5199 automatically.
// Settings match CI unconditionally: one worker, two retries, no server reuse.

import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: '.',
  testMatch: 'interact.test.js',

  timeout: 60000,
  workers: 1,
  retries: 2,
  forbidOnly: true,

  use: {
    headless: true,
    baseURL: 'http://localhost:5199'
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ],

  webServer: {
    command: 'npx vite --port 5199 --config visual/vite.config.js',
    port: 5199,
    reuseExistingServer: false,
    timeout: 30000
  }

});
