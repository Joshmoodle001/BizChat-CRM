import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getServiceById } from "@/lib/services/queries";
import { ServiceForm } from "@/components/services/service-form";
import { ErrorState } from "@/components/ui/error-state";

export default async function EditServicePage({
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
    <div className="space-y-5">
      <div>
        <Link href={`/dashboard/services/${id}`} className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to service
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit service</h1>
        <p className="mt-1 text-sm text-gray-500">Update service details.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <ServiceForm
          mode="edit"
          serviceId={id}
          defaults={{
            name: s.name as string,
            description: (s.description as string) || "",
            category: (s.category as string) || "",
            duration_minutes: s.duration_minutes as number,
            price: s.price as number,
            status: s.status as string,
          }}
        />
      </div>
    </div>
  );
}
