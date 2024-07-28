import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const baseURL = isCI ? 'https://bcfield.github.io/tic-attack-toe' : 'http://127.0.0.1:5500';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  webServer: isCI
    ? undefined
    : {
        command: 'serve dist',
        url: 'http://127.0.0.1:5500',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
      },
});
