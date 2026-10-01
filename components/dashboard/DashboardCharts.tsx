"use client";

import {
  Area,
  AreaChart,
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

const statusColors = ["#157347", "#64748b", "#d97706", "#dc2626"];
const opsColors = ["#157347", "#0f766e", "#2563eb", "#d97706"];
const ownerColors = ["#2563eb", "#157347", "#d97706", "#dc2626"];

function ChartCard({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ui-card p-5">
      <p className="ui-kicker">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-ink">{title}</h2>
      <div className="mt-5 h-72">{children}</div>
    </div>
  );
}

export function AdminDashboardCharts({ analytics }: { analytics: any }) {
  const summary = analytics?.summary || {};
  const fleetData = [
    { name: "Active", value: Number(summary.activeVehicles || 0), fill: "#157347" },
    { name: "Idle", value: Number(summary.idleVehicles || 0), fill: "#64748b" },
    { name: "In Maintenance", value: Number(summary.maintenanceVehicles || 0), fill: "#d97706" },
  ];
  const opsData = [
    { name: "Total Drivers", value: Number(summary.totalDrivers || 0), fill: "#0f766e" },
    { name: "Available", value: Number(summary.availableDrivers || 0), fill: "#157347" },
    { name: "Routes Today", value: Number(summary.routesToday || 0), fill: "#2563eb" },
    { name: "Open Alerts", value: Number(analytics?.alerts?.critical || 0) + Number(analytics?.alerts?.warning || 0), fill: "#d97706" },
  ];
  const riskData = [
    { name: "Critical", value: Number(analytics?.alerts?.critical || 0), fill: "#dc2626" },
    { name: "Warnings", value: Number(analytics?.alerts?.warning || 0), fill: "#d97706" },
    { name: "Info", value: Number(analytics?.alerts?.info || 0), fill: "#2563eb" },
  ];

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <ChartCard eyebrow="Fleet mix" title="Vehicle availability">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={fleetData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={98} paddingAngle={3} stroke="#ffffff" strokeWidth={3}>
              {fleetData.map((_, index) => (
                <Cell key={index} fill={statusColors[index % statusColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="Operations" title="Workload signal">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={opsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#d8e4d9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#607166", fontSize: 12 }} />
            <YAxis tick={{ fill: "#607166", fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: "#eef6ef" }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {opsData.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill || opsColors[index % opsColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="Risk" title="Alert severity">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={riskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#d8e4d9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#607166", fontSize: 12 }} />
            <YAxis tick={{ fill: "#607166", fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: "#fff7ed" }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {riskData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}

export function SuperAdminCommandCharts({ overview }: { overview: any }) {
  const payment = overview?.paymentStatus || {};
  const subscriptionData = [
    { name: "Pending", value: Number(payment.pendingPayments || 0), fill: "#d97706" },
    { name: "Active", value: Number(payment.activeSubscriptions || 0), fill: "#157347" },
    { name: "Trials", value: Number(payment.activeTrials || 0), fill: "#2563eb" },
    { name: "Expired", value: Number(payment.expiredPlans || 0) + Number(payment.expiredTrials || 0), fill: "#dc2626" },
  ];
  const planData = (overview?.planDistribution || []).map((item: any) => ({
    name: formatLabel(item.plan),
    accounts: item._count?.plan || 0,
  }));

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <ChartCard eyebrow="Owner metrics" title="Admin subscription states">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={subscriptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#d8e4d9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#607166", fontSize: 12 }} />
            <YAxis tick={{ fill: "#607166", fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#dbeafe" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard eyebrow="Plans" title="Admin plan distribution">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={planData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#d8e4d9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#607166", fontSize: 12 }} />
            <YAxis tick={{ fill: "#607166", fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: "#eef6ef" }} />
            <Bar dataKey="accounts" radius={[8, 8, 0, 0]}>
              {planData.map((item: any, index: number) => (
                <Cell key={item.name} fill={ownerColors[index % ownerColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}
