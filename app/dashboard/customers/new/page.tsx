import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { CustomerForm } from "@/components/customers/customer-form";

export default async function NewCustomerPage() {
  await requireRole(["business_owner"]);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/dashboard/customers" className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to customers
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add customer</h1>
        <p className="mt-1 text-sm text-gray-500">Create a new customer record.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <CustomerForm mode="create" />
      </div>
    </div>
  );
}
