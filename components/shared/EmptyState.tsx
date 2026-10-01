import { ReactNode } from "react";
import { IconInbox } from "@tabler/icons-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="ui-empty">
      <div className="flex size-12 items-center justify-center rounded-xl border border-green-200 bg-green-50 text-primary">
        {icon || <IconInbox size={22} stroke={1.8} />}
      </div>
      <div className="space-y-1">
        <p className="text-base font-extrabold text-ink">{title}</p>
        <p className="max-w-md text-sm leading-6 text-muted">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
