import { defineConfig, devices } from "@playwright/test";

const frontendPort = Number(process.env.E2E_FRONTEND_PORT || 3000);
const backendPort = Number(process.env.E2E_BACKEND_PORT || 3001);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:${frontendPort}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: `cd ../fleetwise-backend && PORT=${backendPort} npm run start:dev`,
      url: `http://127.0.0.1:${backendPort}/api/docs`,
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:${backendPort}/api npm run dev -- --hostname 127.0.0.1 --port ${frontendPort}`,
      url: `http://127.0.0.1:${frontendPort}`,
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
