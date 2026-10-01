"use client";

import Link from "next/link";
import { DEMO_ACCOUNTS } from "@/lib/demoAccounts";

export default function DemoBanner() {
  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-muted">
          Read-only demos — browse real sample data. Writes are blocked.
        </p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <Link
              key={account.email}
              href={`/login?email=${encodeURIComponent(account.email)}`}
              className="inline-flex items-center justify-center rounded-lg border border-line bg-surface px-3 py-2 text-xs font-bold text-ink transition hover:border-primary hover:text-primary"
            >
              {account.role} demo
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
