import { Truck, Wrench, MapPin, Route, User, ShieldCheck, Package } from "lucide-react";

const FEATURES = [
  { icon: Truck, title: "Fuel Tracking", desc: "Log liters, odometer, cost per vehicle. See which vehicles burn fuel fastest.", color: "text-amber-600 bg-amber-50" },
  { icon: Wrench, title: "Maintenance", desc: "Schedule by mileage and time. Get alerts before breakdowns — not after.", color: "text-rose-600 bg-rose-50" },
  { icon: MapPin, title: "Geofencing", desc: "Set virtual zones. Know when a vehicle enters a site or leaves its route.", color: "text-emerald-600 bg-emerald-50" },
  { icon: Route, title: "Trip Logs", desc: "GPS distance, speed, duration. Proof of delivery and driver efficiency.", color: "text-blue-600 bg-blue-50" },
  { icon: User, title: "Driver Score", desc: "Harsh braking and acceleration metrics. Reward safe drivers, train risky ones.", color: "text-violet-600 bg-violet-50" },
  { icon: ShieldCheck, title: "Compliance", desc: "Insurance, fitness, license expiry alerts. Never miss a renewal again.", color: "text-cyan-600 bg-cyan-50" },
  { icon: Package, title: "Inventory", desc: "Spare parts stock, usage tracking. Know when to reorder before a repair stalls.", color: "text-orange-600 bg-orange-50" },
];

export default function FeatureGrid() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="max-w-3xl mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Fleet chaos, solved.
          </h2>
          <p className="text-xl md:text-2xl text-slate-500 leading-relaxed">
            Maintenance slips through cracks. Fuel costs jump unexpectedly. Drivers drive unmonitored.
            FleetWise puts every vehicle, every trip, every mechanic, and every dollar into one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {FEATURES.map((f) => (
            <div key={f.title} className="group relative p-7 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 ${f.color}`}>
                <f.icon size={22} strokeWidth={2.2} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-slate-900 text-white p-10 md:p-16 shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-4">How it works together</h3>
          <p className="text-slate-300 mb-12 text-lg">Not separate tools — one workflow.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-amber-400 font-extrabold text-sm uppercase tracking-wide mb-2">Driver</div>
              <p className="text-slate-300 text-sm leading-relaxed">Logs trips, fuel, and location. Gets score feedback. Reports issues to mechanic.</p>
            </div>
            <div>
              <div className="text-rose-400 font-extrabold text-sm uppercase tracking-wide mb-2">Mechanic</div>
              <p className="text-slate-300 text-sm leading-relaxed">Sees maintenance schedules, completes tasks. Updates record with cost and notes.</p>
            </div>
            <div>
              <div className="text-emerald-400 font-extrabold text-sm uppercase tracking-wide mb-2">Admin / Dispatch</div>
              <p className="text-slate-300 text-sm leading-relaxed">Assigns vehicles, reviews fuel burn, monitors compliance renewals, approves trips.</p>
            </div>
            <div>
              <div className="text-violet-400 font-extrabold text-sm uppercase tracking-wide mb-2">Super Admin</div>
              <p className="text-slate-300 text-sm leading-relaxed">Oversees organizations, users, subscriptions. Has full visibility across every fleet.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
