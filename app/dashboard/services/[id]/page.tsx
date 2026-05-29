import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getServiceById } from "@/lib/services/queries";
import { deactivateServiceAction } from "@/app/dashboard/services/actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await requireRole(["business_owner"]);
  const service = await getServiceById(id, profile.business_id);

  if (!service) {
    return <ErrorState title="Service not found" message="This service does not exist or you do not have access." retryHref="/dashboard/services" />;
  }

  const s = service as Record<string, unknown>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/services" className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to services
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{s.name as string}</h1>
            <p className="mt-1 text-sm text-gray-500">{(s.category as string) || "No category"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/dashboard/services/${id}/edit`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
            <form action={deactivateServiceAction.bind(null, id)}>
              <Button variant="danger" size="sm">Deactivate</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900">Service details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-gray-500">Description</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{(s.description as string) || "No description"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Category</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{(s.category as string) || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Duration</dt>
            <dd className="mt-0.5 text-sm text-gray-900">{s.duration_minutes as number} minutes</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Price</dt>
            <dd className="mt-0.5 text-sm font-semibold text-gray-900">R {(s.price as number).toFixed(2)}</dd>
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
        <h3 className="text-sm font-semibold text-gray-900">Recent bookings</h3>
        <p className="mt-1 text-sm text-gray-400">Service booking history will be available in Phase 5.</p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">Revenue</h3>
        <p className="mt-1 text-sm text-gray-400">Service revenue reports will be available in later phases.</p>
      </div>
    </div>
  );
}
