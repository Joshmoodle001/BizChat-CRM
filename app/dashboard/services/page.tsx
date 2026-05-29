import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getServices } from "@/lib/services/queries";
import { SearchInput } from "@/components/ui/search-input";
import { ClientFilters } from "@/components/ui/client-filters";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; category?: string }>;
}) {
  const params = await searchParams;
  const { profile } = await requireRole(["business_owner"]);

  let services: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    services = await getServices(profile.business_id, params);
  } catch {
    error = "Failed to load services.";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the services your business offers.</p>
        </div>
        <Link href="/dashboard/services/new">
          <Button>
            <svg className="-ml-1 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add service
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchInput placeholder="Search by name, description, or category..." />
        </div>
        <ClientFilters
          statusOptions={["active", "inactive"]}
          showCategory
          categoryOptions={["Hair", "Beauty", "Cleaning", "Repair", "Tutoring", "Consulting", "Other"]}
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-200 bg-danger-50 px-6 py-12 text-center">
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Add your first service to get started."
          action={<Link href="/dashboard/services/new"><Button>Add your first service</Button></Link>}
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Duration</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((s) => (
                  <tr key={s.id as string} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{s.name as string}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{(s.category as string) || "—"}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{s.duration_minutes as number} min</td>
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">R {(s.price as number).toFixed(2)}</td>
                    <td className="px-5 py-3"><StatusBadge status={s.status as string} /></td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/dashboard/services/${s.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-500">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {services.map((s) => (
              <Link key={s.id as string} href={`/dashboard/services/${s.id}`} className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.name as string}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{(s.category as string) || "No category"} &middot; {s.duration_minutes as number} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">R {(s.price as number).toFixed(2)}</p>
                    <StatusBadge status={s.status as string} className="mt-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
