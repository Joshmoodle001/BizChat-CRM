"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ClientFiltersProps {
  statusOptions: string[];
  showCategory?: boolean;
  categoryOptions?: string[];
}

export function ClientFilters({
  statusOptions,
  showCategory = false,
  categoryOptions = [],
}: ClientFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "category") params.delete("category");
    if (key !== "status") params.delete("status");
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {showCategory && categoryOptions.length > 0 && (
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
      <select
        value={searchParams.get("status") ?? ""}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        <option value="">All statuses</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        ))}
      </select>
    </div>
  );
}
