import { requireRole } from "@/lib/auth/require-role";

export default async function StaffPage() {
  const { profile } = await requireRole(["staff"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {profile.full_name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here is your schedule for today.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-gray-900">Assigned bookings will appear here</h3>
        <p className="mt-1 text-sm text-gray-500">
          Phase 4 and Phase 5 will add assigned bookings and staff workflows.
        </p>
      </div>
    </div>
  );
}
