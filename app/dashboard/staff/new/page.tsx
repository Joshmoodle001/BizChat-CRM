import Link from "next/link";
import { requireRole } from "@/lib/auth/require-role";
import { StaffForm } from "@/components/staff/staff-form";

export default async function NewStaffPage() {
  await requireRole(["business_owner"]);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/dashboard/staff" className="mb-2 inline-block text-sm text-brand-600 hover:text-brand-500">
          &larr; Back to staff
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add staff member</h1>
        <p className="mt-1 text-sm text-gray-500">Add a team member to help with bookings and customer work.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <StaffForm />
      </div>
    </div>
  );
}
