"use client";

import Link from "next/link";
import { Button } from "@mantine/core";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-lg border border-line bg-white p-10 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Access Restricted
        </p>
        <h1 className="mb-4 text-3xl font-black text-ink">
          You do not have permission to open this area.
        </h1>
        <p className="mb-8 text-sm leading-6 text-muted">
          FleetWise keeps each workspace aligned to your role. Head back to your command center or sign in with an account that has the required access.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button component={Link} href="/dashboard" size="md">
            Go to Dashboard
          </Button>
          <Button component={Link} href="/login" variant="default" size="md">
            Sign In Again
          </Button>
        </div>
      </div>
    </div>
  );
}
