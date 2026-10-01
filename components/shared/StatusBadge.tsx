import clsx from "clsx";

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: "green" | "slate" | "red" | "yellow";
};

const tones = {
  green: "border-green-200 bg-green-50 text-primary",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
  red: "border-red-200 bg-red-50 text-red-700",
  yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
};

export function StatusBadge({ children, tone = "green" }: StatusBadgeProps) {
  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold", tones[tone])}>
      {children}
    </span>
  );
}
