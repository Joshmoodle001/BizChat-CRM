import { requireRole } from "@/lib/auth/require-role";

export default async function SuperAdminPage() {
  const { profile } = await requireRole(["super_admin"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Platform Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome, {profile.full_name}. You are a platform super admin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total businesses", value: "—" },
          { label: "Active businesses", value: "—" },
          { label: "Trial businesses", value: "—" },
          { label: "Suspended businesses", value: "—" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-gray-900">Super admin tools will be expanded in later phases</h3>
        <p className="mt-1 text-sm text-gray-500">
          Business management, suspension, and platform-level reporting coming soon.
        </p>
      </div>
    </div>
  );
}
