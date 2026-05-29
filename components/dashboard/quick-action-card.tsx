import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export function QuickActionCard({
  href,
  label,
  description,
  icon,
  className,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    </Link>
  );
}
