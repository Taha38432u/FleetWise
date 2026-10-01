import { expect, test } from "@playwright/test";

const adminUser = {
  id: "admin-1",
  email: "admin@fleetwise.test",
  firstName: "Rashid",
  lastName: "Ops",
  role: "ADMIN",
};

test.use({
  storageState: {
    cookies: [],
    origins: [
      {
        origin: "http://127.0.0.1:3000",
        localStorage: [
          { name: "accessToken", value: "test-token" },
          { name: "user", value: JSON.stringify(adminUser) },
        ],
      },
    ],
  },
});

test.describe("predictive maintenance UI", () => {
  test.beforeEach(async ({ page }) => {
    await Promise.all(
      [
        "**/auth/me",
        "**/billing/subscription",
        "**/maintenance?**",
        "**/vehicles?**",
        "**/staff?**",
        "**/maintenance/ai/health",
        "**/maintenance/predictions?**",
        "**/maintenance/predict/veh-1",
      ].map((pattern) => page.unroute(pattern).catch(() => undefined)),
    );

    await page.route("**/auth/me", async (route) =>
      route.fulfill({ json: { ok: true, data: adminUser } }),
    );
    await page.route("**/billing/subscription", async (route) =>
      route.fulfill({
        json: {
          ok: true,
          data: { limits: { features: { liveTracking: true, reportsExport: true } } },
        },
      }),
    );
    await page.route("**/maintenance?**", async (route) =>
      route.fulfill({
        json: {
          ok: true,
          data: [],
          meta: { totalItems: 0, totalPages: 1, currentPage: 1, pageSize: 10 },
        },
      }),
    );
    await page.route("**/vehicles?**", async (route) =>
      route.fulfill({
        json: {
          ok: true,
          data: {
            data: [
              {
                id: "veh-1",
                plate: "FW-7281",
                model: "Isuzu NPR",
                type: "Truck",
                year: 2023,
                status: "Active",
                mileage: 87420,
                fuelEfficiency: 9.7,
                healthScore: 64,
                predictiveAlerts: [],
              },
            ],
            meta: { totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 100 },
          },
        },
      }),
    );
    await page.route("**/staff?**", async (route) =>
      route.fulfill({ json: { ok: true, data: [], meta: {} } }),
    );
  });

  test("renders AI output and manual prediction flow", async ({ page }) => {
    await page.route("**/maintenance/ai/health", async (route) =>
      route.fulfill({ json: { ok: true, data: { ok: true, model_available: true } } }),
    );
    await page.route("**/maintenance/predictions?**", async (route) =>
      route.fulfill({
        json: {
          ok: true,
          data: [
            {
              id: "pred-1",
              vehicleId: "veh-1",
              predictedIssue: "power_failure",
              riskScore: 0.73,
              confidence: 0.82,
              riskLevel: "high",
              maintenancePriority: "urgent",
              suggestedAction: "Schedule mechanic inspection for power failure within 24 hours.",
              dataQuality: "mapped_vehicle_profile",
              createdAt: "2026-05-05T08:00:00.000Z",
              vehicle: { plate: "FW-7281", model: "Isuzu NPR" },
            },
          ],
        },
      }),
    );
    await page.route("**/maintenance/predict/veh-1", async (route) =>
      route.fulfill({
        json: {
          ok: true,
          data: {
            id: "pred-2",
            vehicleId: "veh-1",
            predictedIssue: "power_failure",
            riskScore: 0.76,
            confidence: 0.84,
            riskLevel: "high",
            maintenancePriority: "urgent",
            suggestedAction: "Schedule mechanic inspection for power failure within 24 hours.",
            createdAt: "2026-05-05T08:05:00.000Z",
          },
        },
      }),
    );

    await page.goto("/maintenance");

    await expect(page.getByRole("heading", { name: /predictive maintenance/i })).toBeVisible();
    await expect(page.getByText(/model ready/i)).toBeVisible();
    await expect(page.getByText("FW-7281 - Power Failure")).toBeVisible();
    await expect(page.getByText("Confidence", { exact: true })).toBeVisible();
    await expect(page.getByText(/schedule mechanic inspection/i)).toBeVisible();
    await page.getByRole("button", { name: /run prediction/i }).click();
  });

});
