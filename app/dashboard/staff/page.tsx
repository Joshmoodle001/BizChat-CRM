import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getStaffProfiles } from "@/lib/staff/queries";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const { profile } = await requireRole(["business_owner"]);

  let staff: Record<string, unknown>[] = [];
  let error: string | null = null;

  try {
    staff = await getStaffProfiles(profile.business_id, params);
  } catch {
    error = "Failed to load staff.";
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
          <p className="mt-1 text-sm text-gray-500">Manage team members who help with bookings and customer work.</p>
        </div>
        <Link href="/dashboard/staff/new">
          <Button>
            <svg className="-ml-1 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add staff
          </Button>
        </Link>
      </div>

      <div className="relative">
        <SearchInput placeholder="Search by name, email, or phone..." />
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-200 bg-danger-50 px-6 py-12 text-center">
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      ) : staff.length === 0 ? (
        <EmptyState
          title="No staff members yet"
          description="Add your first team member."
          action={<Link href="/dashboard/staff/new"><Button>Add staff member</Button></Link>}
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map((s) => (
                  <tr key={s.id as string} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-gray-900">{s.full_name as string}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{s.email as string}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{(s.phone as string) || "—"}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 capitalize">
                        {s.role === "business_owner" ? "Owner" : (s.role as string)}
                      </span>
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={s.status as string} /></td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/dashboard/staff/${s.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-500">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {staff.map((s) => (
              <Link key={s.id as string} href={`/dashboard/staff/${s.id}`} className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.full_name as string}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{s.email as string}</p>
                  </div>
                  <StatusBadge status={s.status as string} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 capitalize">
                    {s.role === "business_owner" ? "Owner" : (s.role as string)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
