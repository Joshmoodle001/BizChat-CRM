import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { ServiceForm } from "@/components/services/service-form";

export default async function NewServicePage() {
  await requireRole(["business_owner"]);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/dashboard/services" className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to services
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add service</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new service to your catalogue.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <ServiceForm mode="create" />
      </div>
    </div>
  );
}
