"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatLabel } from "@/utils/formatLabel";

const chartColors = ["#157347", "#2563eb", "#d97706", "#0f766e", "#64748b"];
const stateColors: Record<string, string> = {
  pendingPayments: "#d97706",
  activeSubscriptions: "#157347",
  activeTrials: "#2563eb",
  expiredTrials: "#dc2626",
  expiredPlans: "#991b1b",
  cancelledPlans: "#64748b",
};

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-72 items-center justify-center rounded-2xl border border-dashed border-line bg-white text-sm font-semibold text-muted">
      {label}
    </div>
  );
}

export function OwnerCharts({ overview }: { overview: any }) {
  const planData = (overview?.planDistribution || []).map((item: any) => ({
    name: formatLabel(item.plan),
    value: item._count?.plan || 0,
  }));
  const statusData = Object.entries(overview?.paymentStatus || {}).map(([name, value]) => ({
    name: formatLabel(name),
    value: Number(value || 0),
    fill: stateColors[name] || "#157347",
  }));

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="ui-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="ui-kicker">Plans</p>
            <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
              Admin account mix
            </h2>
          </div>
          <span className="ui-badge">Admins only</span>
        </div>
        {planData.length ? (
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {planData.map((_: any, index: number) => (
                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyChart label="No subscribed admin accounts yet." />
          </div>
        )}
      </div>

      <div className="ui-card p-5">
        <div>
          <p className="ui-kicker">Payments</p>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">
            Subscription health
          </h2>
        </div>
        {statusData.some((item) => item.value > 0) ? (
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#d8e4d9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#607166", fontSize: 12 }} />
                <YAxis tick={{ fill: "#607166", fontSize: 12 }} allowDecimals={false} />
                <Tooltip cursor={{ fill: "#eef6ef" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {statusData.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="mt-5">
            <EmptyChart label="No payment state yet." />
          </div>
        )}
      </div>
    </section>
  );
}
