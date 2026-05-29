import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: number | string;
  description?: string;
  href?: string;
  icon?: React.ReactNode;
  trend?: string;
}

export function DashboardCard({
  title,
  value,
  description,
  href,
  icon,
  trend,
}: DashboardCardProps) {
  const content = (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {description && (
            <p className="mt-0.5 text-xs text-gray-400">{description}</p>
          )}
        </div>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <p className="mt-3 text-xs text-gray-400">{trend}</p>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
