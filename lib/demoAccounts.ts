export type DemoAccount = {
  role: string;
  email: string;
  password: string;
  path: string;
  blurb: string;
};

/** Read-only @demo.com accounts. Writes blocked by backend DemoReadOnlyGuard. */
export const DEMO_PASSWORD = 'DemoRead1!';

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'Admin',
    email: 'admin@demo.com',
    password: DEMO_PASSWORD,
    path: '/dashboard',
    blurb: 'Browse the full admin workspace — read only',
  },
  {
    role: 'Driver',
    email: 'driver@demo.com',
    password: DEMO_PASSWORD,
    path: '/dashboard',
    blurb: 'Attendance and assigned routes — read only',
  },
  {
    role: 'Mechanic',
    email: 'mechanic@demo.com',
    password: DEMO_PASSWORD,
    path: '/mechanics',
    blurb: 'Workshop queue and job costs — read only',
  },
];

export const ADMIN_DEMO = DEMO_ACCOUNTS[0];

export function isDemoEmail(email?: string | null) {
  return Boolean(email?.trim().toLowerCase().endsWith('@demo.com'));
}
