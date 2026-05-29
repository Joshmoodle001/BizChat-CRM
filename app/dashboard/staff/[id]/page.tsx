import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getStaffProfileById } from "@/lib/staff/queries";
import { deactivateStaffAction } from "@/app/dashboard/staff/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default async function StaffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await requireRole(["business_owner"]);
  const staffMember = await getStaffProfileById(id, profile.business_id);

  if (!staffMember) {
    return <ErrorState title="Staff member not found" message="This staff member does not exist or you do not have access." retryHref="/dashboard/staff" />;
  }

  const s = staffMember as Record<string, unknown>;
  const isOwner = (s.role as string) === "business_owner";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/staff" className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to staff
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{s.full_name as string}</h1>
            <p className="mt-1 text-sm text-gray-500">
              <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 capitalize">
                {isOwner ? "Owner" : (s.role as string)}
              </span>
            </p>
          </div>
          {!isOwner && (
            <form action={deactivateStaffAction.bind(null, id)}>
              <Button variant="danger" size="sm">Deactivate</Button>
            </form>
          )}
          {isOwner && (
            <p className="text-sm text-gray-400 italic">This is your owner profile and cannot be deactivated.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900">Profile details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-gray-500">Full name</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{s.full_name as string}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Email</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{s.email as string}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Phone</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{(s.phone as string) || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Status</dt>
            <dd className="mt-0.5"><StatusBadge status={s.status as string} /></dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Created</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{new Date(s.created_at as string).toLocaleDateString("en-ZA")}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Updated</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{new Date(s.updated_at as string).toLocaleDateString("en-ZA")}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">Assigned bookings</h3>
        <p className="mt-1 text-sm text-gray-400">Assigned bookings will be available in Phase 5.</p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">Staff performance</h3>
        <p className="mt-1 text-sm text-gray-400">Staff reports will be available in later phases.</p>
      </div>
    </div>
  );
}
