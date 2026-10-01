import { expect, test, type Page } from "@playwright/test";

const users = {
  admin: {
    id: "admin-1",
    email: "admin@fleetwise.test",
    firstName: "Admin",
    lastName: "One",
    role: "ADMIN",
  },
};

const analytics = {
  ok: true,
  data: {
    role: "ADMIN",
    summary: {
      totalVehicles: 4,
      totalDrivers: 3,
      routesToday: 2,
      monthlyCost: "$1,200",
      availableDrivers: 2,
      activeVehicles: 3,
      idleVehicles: 1,
    },
    alerts: { critical: 1, warning: 1, info: 2 },
    upcomingMaintenance: [
      {
        id: "maint-1",
        type: "Oil Change",
        description: "Due today",
        status: "PENDING",
        scheduledAt: "2026-06-15T09:00:00.000Z",
        vehicle: { plate: "FW-7281" },
      },
    ],
    upcomingPredictions: [
      {
        id: "pred-1",
        predictedIssue: "power_failure",
        riskLevel: "high",
        riskScore: 0.73,
        confidence: 0.82,
        suggestedAction: "Schedule mechanic inspection.",
        vehicle: { plate: "FW-7281" },
      },
    ],
    context: {
      myQueue: [
        {
          id: "queue-1",
          type: "Brake Service",
          description: "Pads worn",
          status: "PENDING",
          vehicle: { plate: "FW-9021" },
        },
      ],
    },
  },
};

const myRoute = {
  id: "route-1",
  name: "Demo Route",
  startLocation: "24.860700, 67.001100 | Saddar",
  endLocation: "24.925600, 67.086900 | Gulshan",
  scheduledAt: "2026-06-15T09:00:00.000Z",
  status: "IN_PROGRESS",
  vehicleId: "vehicle-1",
  vehicle: { plate: "FW-7281" },
};

async function setupUser(page: Page, user: any, features = { liveTracking: true, reportsExport: true }) {
  await Promise.all(
    [
      "**/auth/me",
      "**/billing/subscription",
      "**/analytics/dashboard",
      "**/super-admin/overview",
      "**/routes/me?**",
      "**/attendance/me?**",
      "**/maintenance/predictions?**",
      "**/maintenance?**",
    ].map((pattern) => page.unroute(pattern).catch(() => undefined)),
  );

  await page.addInitScript((nextUser) => {
    localStorage.setItem("accessToken", "test-token");
    localStorage.setItem("user", JSON.stringify(nextUser));
  }, user);

  await page.route("**/auth/me", async (route) =>
    route.fulfill({ json: { ok: true, data: user } }),
  );
  await page.route("**/billing/subscription", async (route) =>
    route.fulfill({ json: { ok: true, data: { limits: { features } } } }),
  );
  await page.route("**/analytics/dashboard", async (route) =>
    route.fulfill({ json: { ...analytics, data: { ...analytics.data, role: user.role } } }),
  );
  await page.route("**/super-admin/overview", async (route) =>
    route.fulfill({
      json: {
        ok: true,
        data: {
          totalUsers: 3,
          paymentStatus: { activeSubscriptions: 2, pendingPayments: 0, activeTrials: 1 },
        },
      },
    }),
  );
  await page.route("**/routes/me?**", async (route) =>
    route.fulfill({
      json: {
        ok: true,
        data: [myRoute],
        meta: { totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 5 },
      },
    }),
  );
  await page.route("**/attendance/me?**", async (route) =>
    route.fulfill({
      json: {
        ok: true,
        data: [
          {
            id: "att-1",
            date: "2026-06-15T00:00:00.000Z",
            checkInTime: "2026-06-15T09:00:00.000Z",
            checkOutTime: null,
          },
        ],
      },
    }),
  );
  await page.route("**/maintenance/predictions?**", async (route) =>
    route.fulfill({ json: { ok: true, data: analytics.data.upcomingPredictions } }),
  );
  await page.route("**/maintenance?**", async (route) =>
    route.fulfill({
      json: {
        ok: true,
        data: analytics.data.upcomingMaintenance,
        meta: { totalItems: 1, totalPages: 1, currentPage: 1, pageSize: 50 },
      },
    }),
  );

}

test.describe("role based FleetWise flow", () => {
  test("plan locked pages are disabled and direct URL redirects", async ({ page }) => {
    await setupUser(page, users.admin, { liveTracking: false, reportsExport: false });
    await page.goto("/dashboard");

    const liveTrackingLink = page.getByRole("link", { name: /live tracking/i });
    await expect(liveTrackingLink).toHaveAttribute("aria-disabled", "true");

    await page.goto("/live-tracking");
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
