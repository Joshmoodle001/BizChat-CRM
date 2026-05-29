import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getCustomers } from "@/lib/customers/queries";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

function StatusFilter() {
  return (
    <select
      id="status-filter"
      defaultValue=""
      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      onChange={(e) => {
        const url = new URL(window.location.href);
        if (e.target.value) url.searchParams.set("status", e.target.value);
        else url.searchParams.delete("status");
        window.location.href = url.toString();
      }}
    >
      <option value="">All statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="archived">Archived</option>
    </select>
  );
}

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; do_not_contact?: string }>;
}) {
  const params = await searchParams;
  const { profile } = await requireRole(["business_owner"]);

  let customers: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    customers = await getCustomers(profile.business_id, params);
  } catch {
    error = "Failed to load customers.";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your customer database and WhatsApp contacts.
          </p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button>
            <svg className="-ml-1 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add customer
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchInput placeholder="Search by name, phone, or email..." />
        </div>
        <StatusFilter />
      </div>

      {/* Content */}
      {error ? (
        <div className="rounded-xl border border-danger-200 bg-danger-50 px-6 py-12 text-center">
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Add your first customer to get started."
          icon={
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
          action={
            <Link href="/dashboard/customers/new">
              <Button>Add your first customer</Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tags</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((c) => (
                  <tr key={c.id as string} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{c.full_name as string}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">{c.phone as string}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{(c.email as string) || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(c.tags as string[])?.length > 0
                          ? (c.tags as string[]).slice(0, 3).map((t: string) => (
                              <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                {t}
                              </span>
                            ))
                          : <span className="text-xs text-gray-400">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={c.status as string} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/dashboard/customers/${c.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-500">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {customers.map((c) => (
              <Link
                key={c.id as string}
                href={`/dashboard/customers/${c.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{c.full_name as string}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{c.phone as string}</p>
                  </div>
                  <StatusBadge status={c.status as string} />
                </div>
                {(c.email as string) && (
                  <p className="mt-2 text-xs text-gray-500">{(c.email as string)}</p>
                )}
                {(c.tags as string[])?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(c.tags as string[]).map((t: string) => (
                      <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
