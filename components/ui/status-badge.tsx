import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success-50 text-success-700 border-success-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  archived: "bg-gray-50 text-gray-500 border-gray-200",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  sent: "bg-brand-50 text-brand-700 border-brand-200",
  paid: "bg-success-50 text-success-700 border-success-200",
  unpaid: "bg-warning-50 text-warning-700 border-warning-200",
  partially_paid: "bg-warning-50 text-warning-700 border-warning-200",
  overdue: "bg-danger-50 text-danger-700 border-danger-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  scheduled: "bg-brand-50 text-brand-700 border-brand-200",
  confirmed: "bg-success-50 text-success-700 border-success-200",
  completed: "bg-success-50 text-success-700 border-success-200",
  no_show: "bg-danger-50 text-danger-700 border-danger-200",
  suspended: "bg-danger-50 text-danger-700 border-danger-200",
  trial: "bg-brand-50 text-brand-700 border-brand-200",
  invite_pending: "bg-warning-50 text-warning-700 border-warning-200",
  pending: "bg-warning-50 text-warning-700 border-warning-200",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className,
      )}
    >
      {label}
    </span>
  );
}
