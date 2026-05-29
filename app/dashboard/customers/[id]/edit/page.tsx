import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { getCustomerById } from "@/lib/customers/queries";
import { CustomerForm } from "@/components/customers/customer-form";
import { ErrorState } from "@/components/ui/error-state";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile } = await requireRole(["business_owner"]);
  const customer = await getCustomerById(id, profile.business_id);

  if (!customer) {
    return <ErrorState title="Customer not found" message="This customer does not exist or you do not have access." retryHref="/dashboard/customers" />;
  }

  const c = customer as Record<string, unknown>;

  return (
    <div className="space-y-5">
      <div>
        <Link href={`/dashboard/customers/${id}`} className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to customer
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit customer</h1>
        <p className="mt-1 text-sm text-gray-500">Update customer details.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <CustomerForm
          mode="edit"
          customerId={id}
          defaults={{
            full_name: c.full_name as string,
            phone: c.phone as string,
            email: (c.email as string) || "",
            address: (c.address as string) || "",
            source: (c.source as string) || "",
            tags: (c.tags as string[])?.join(", ") || "",
            notes: (c.notes as string) || "",
            communication_opt_in: (c.communication_opt_in as boolean) ?? true,
            do_not_contact: (c.do_not_contact as boolean) ?? false,
            status: c.status as string,
          }}
        />
      </div>
    </div>
  );
}
