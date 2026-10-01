"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconBell,
  IconChartBar,
  IconChecklist,
  IconCreditCard,
  IconMap2,
  IconReportAnalytics,
  IconRoute,
  IconTool,
  IconTruck,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";
import { DEMO_ACCOUNTS } from "@/lib/demoAccounts";

const features = [
  {
    icon: IconMap2,
    title: "Live fleet tracking",
    description:
      "Watch assigned vehicles on a live map while drivers stream GPS on active routes.",
  },
  {
    icon: IconUsers,
    title: "Role-based workspaces",
    description:
      "Admin, dispatcher, driver, and mechanic each get screens built for their next action.",
  },
  {
    icon: IconTool,
    title: "Maintenance workshop",
    description:
      "Schedule service jobs, assign mechanics, track status and cost from one queue.",
  },
  {
    icon: IconChecklist,
    title: "Route dispatch",
    description:
      "Pick start and end on the map, assign driver and vehicle, then run status through completion.",
  },
  {
    icon: IconChartBar,
    title: "Fleet cost + fuel",
    description:
      "Accounts, budgets, transactions, and per-vehicle fuel logs with km/L efficiency.",
  },
  {
    icon: IconBell,
    title: "Operational alerts",
    description:
      "Route assignments, maintenance updates, and risk alerts land in in-app notifications.",
  },
  {
    icon: IconCreditCard,
    title: "Subscription billing",
    description:
      "Stripe test checkout, trials, and plan limits for live tracking and report export.",
  },
  {
    icon: IconReportAnalytics,
    title: "Reports",
    description:
      "Fleet summary, driver performance, maintenance history, route efficiency, and CSV export.",
  },
];

const workflow = [
  {
    role: "Admin",
    icon: IconUsers,
    title: "Stand up the fleet",
    steps: [
      "Create staff, vehicles, and driver profiles",
      "Open maintenance jobs and assign mechanics",
      "Review spend, reports, and plan limits",
    ],
  },
  {
    role: "Dispatcher",
    icon: IconRoute,
    title: "Run the day",
    steps: [
      "Build routes with map-picked endpoints",
      "Pair driver + vehicle and schedule departures",
      "Watch live tracking and request location",
    ],
  },
  {
    role: "Driver",
    icon: IconUser,
    title: "Execute the route",
    steps: [
      "Check in for attendance",
      "Start the assigned route and stream GPS",
      "Mark complete when finished",
    ],
  },
  {
    role: "Mechanic",
    icon: IconTool,
    title: "Keep assets online",
    steps: [
      "Pull pending jobs from the workbench",
      "Start and complete service with cost",
      "Keep vehicles ready for dispatch",
    ],
  },
];

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function HeroGui() {
  return (
    <div className="relative h-full min-h-[420px] w-full p-4 sm:p-6 lg:p-8">
      <div className="flex h-full min-h-[390px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_24px_60px_rgba(16,33,22,0.08)]">
        {/* App sidebar */}
        <aside className="hidden w-[168px] shrink-0 border-r border-line bg-[#fbfdfb] p-3 sm:block">
          <div className="mb-5 flex items-center gap-2 px-1">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <IconTruck size={16} />
            </span>
            <div>
              <p className="text-xs font-extrabold text-ink">FleetWise</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Command
              </p>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { label: "Dashboard", active: true },
              { label: "Live Tracking" },
              { label: "Vehicles" },
              { label: "Routes" },
              { label: "Maintenance" },
              { label: "Fuel" },
              { label: "Reports" },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${
                  item.active
                    ? "bg-primary text-white"
                    : "text-muted hover:bg-surface"
                }`}
              >
                {item.label}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main pane */}
        <div className="flex min-w-0 flex-1 flex-col bg-surface">
          <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
                Admin workspace
              </p>
              <p className="text-sm font-extrabold text-ink">Command Center</p>
            </div>
            <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-muted">
              Read-only demo
            </span>
          </header>

          <div className="grid flex-1 gap-3 p-4 sm:grid-cols-3">
            {[
              { label: "Vehicles", value: "4", meta: "1 in shop" },
              { label: "Routes today", value: "3", meta: "1 live" },
              { label: "Open jobs", value: "2", meta: "mechanic queue" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-line bg-white p-3 shadow-sm"
              >
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold text-primary">{stat.meta}</p>
              </div>
            ))}

            <div className="rounded-xl border border-line bg-white p-3 shadow-sm sm:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-extrabold text-ink">Live routes</p>
                <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
                  In progress
                </span>
              </div>
              <div className="space-y-2">
                {[
                  {
                    name: "Gulberg → DHA",
                    plate: "DEMO-TRK-01",
                    status: "42 km/h",
                  },
                  {
                    name: "Port → Warehouse",
                    plate: "DEMO-VAN-02",
                    status: "Scheduled",
                  },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-ink">{row.name}</p>
                      <p className="text-[11px] font-semibold text-muted">{row.plate}</p>
                    </div>
                    <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-extrabold text-primary">
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-3 shadow-sm">
              <p className="text-xs font-extrabold text-ink">Service queue</p>
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
                  <p className="text-[11px] font-extrabold text-ink">Brake inspection</p>
                  <p className="text-[10px] font-semibold text-muted">DEMO-TRK-03 · In progress</p>
                </div>
                <div className="rounded-lg border border-line bg-surface px-3 py-2">
                  <p className="text-[11px] font-extrabold text-ink">Oil change</p>
                  <p className="text-[10px] font-semibold text-muted">DEMO-TRK-01 · Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingView() {
  return (
    <main className="min-h-[100dvh] bg-white text-ink">
      <header className="relative z-20 border-b border-line bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-white">
              <IconTruck size={24} stroke={1.8} />
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight">FleetWise</span>
              <span className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                Fleet operations
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold text-muted md:flex">
            <a href="#problem" className="hover:text-primary">
              Problem
            </a>
            <a href="#workflow" className="hover:text-primary">
              Workflow
            </a>
            <a href="#features" className="hover:text-primary">
              Features
            </a>
            <a href="#demo" className="hover:text-primary">
              Demo
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login" className="ui-button ui-button-secondary hidden sm:inline-flex">
              Sign In
            </Link>
            <Link href="/signup" className="ui-button">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-[0.95fr_1.05fr]">
          <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <FadeIn>
              <p className="ui-kicker">FleetWise</p>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
                Spreadsheets lose vehicles. This system keeps the fleet moving.
              </h1>
            </FadeIn>
            <FadeIn delay={160}>
              <p className="mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg">
                Dispatch, driver GPS, mechanic jobs, maintenance, fuel, costs, and billing —
                one operational control room.
              </p>
            </FadeIn>
            <FadeIn delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="ui-button px-6">
                  Create fleet account <IconArrowRight size={18} />
                </Link>
                <Link
                  href={`/login?email=${encodeURIComponent(DEMO_ACCOUNTS[0].email)}`}
                  className="ui-button ui-button-secondary px-6"
                >
                  Try admin demo
                </Link>
              </div>
              <p className="mt-3 text-xs font-semibold text-muted">
                Demo is read-only. Explore freely — nothing can be changed.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={120} className="border-t border-line bg-surface lg:border-l lg:border-t-0">
            <HeroGui />
          </FadeIn>
        </div>
      </section>

      <section id="problem" className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="ui-kicker">The problem</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Small fleets drown in WhatsApp, Excel, and tribal knowledge.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "No single source of truth",
                body: "Vehicle status, who is driving, and which truck is in the shop live in different chats and sheets.",
              },
              {
                title: "Maintenance is reactive",
                body: "Breakdowns hit mid-route. Mechanics get verbal tickets. Cost never rolls up.",
              },
              {
                title: "Dispatch cannot see the road",
                body: "Without live GPS and route status, ETAs are guesses and delays surface too late.",
              },
            ].map((item) => (
              <article key={item.title} className="border-l-2 border-primary pl-5">
                <h3 className="text-lg font-extrabold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-line bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="ui-kicker">Workflow</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Four roles. One operational loop.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Admin sets up the fleet, dispatcher runs the day, drivers execute with GPS, mechanics
            clear the shop queue.
          </p>

          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {workflow.map((lane, index) => {
              const Icon = lane.icon;
              return (
                <article key={lane.role} className="rounded-2xl border border-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-primary">
                      <Icon size={22} stroke={1.8} />
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted">
                      Step {index + 1}
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                    {lane.role}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight text-ink">{lane.title}</h3>
                  <ol className="mt-4 space-y-3">
                    {lane.steps.map((step) => (
                      <li key={step} className="flex gap-2 text-sm leading-6 text-muted">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="ui-kicker">Features</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            What FleetWise offers
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Modules built for real fleet operations — tracking, dispatch, workshop, costs, and
            billing.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border border-line bg-surface p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-green-200 bg-white text-primary">
                    <Icon size={20} stroke={1.8} />
                  </span>
                  <h3 className="mt-4 text-lg font-extrabold tracking-tight text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="demo" className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="ui-kicker">Demo</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Try each role
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Three read-only accounts with sample fleet data. Browse freely — creates, updates, and
            deletes are blocked.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {DEMO_ACCOUNTS.map((account) => (
              <Link
                key={account.email}
                href={`/login?email=${encodeURIComponent(account.email)}`}
                className="rounded-2xl border border-line bg-white p-6 transition hover:border-primary"
              >
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                  {account.role} demo
                </p>
                <p className="mt-3 text-sm font-bold text-ink">{account.email}</p>
                <p className="mt-1 font-mono text-sm text-muted">{account.password}</p>
                <p className="mt-3 text-xs leading-5 text-muted">{account.blurb}</p>
                <p className="mt-4 text-sm font-bold text-primary">Open login →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="ui-kicker">Ready</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Create your own fleet account, or open the read-only admin demo first.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="ui-button ui-button-secondary">
              Sign In
            </Link>
            <Link href="/signup" className="ui-button">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
