import { ReactNode } from "react";
import clsx from "clsx";

type SurfaceProps = {
  children: ReactNode;
  className?: string;
  compact?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export function Surface({ children, className, compact = false, ...props }: SurfaceProps) {
  return (
    <section className={clsx(compact ? "ui-card-compact" : "ui-section", className)} {...props}>
      {children}
    </section>
  );
}
