import { requireRole } from "@/lib/auth/require-role";
import { getDashboardStats, getRecentCustomers, getRecentServices } from "@/lib/dashboard/queries";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";

export default async function DashboardPage() {
  const { profile, business } = await requireRole(["business_owner"]);
  const stats = await getDashboardStats(profile.business_id);
  const recentCustomers = await getRecentCustomers(profile.business_id);
  const recentServices = await getRecentServices(profile.business_id);

  const today = new Date().toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {profile.full_name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {business?.name ?? "Your business"} &middot; {today}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          Manage your customers, services, staff, and business setup from one place.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total customers"
          value={stats.totalCustomers}
          description={`${stats.activeCustomers} active`}
          href="/dashboard/customers"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <DashboardCard
          title="Services"
          value={stats.totalServices}
          description={`${stats.activeServices} active`}
          href="/dashboard/services"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
        />
        <DashboardCard
          title="Staff members"
          value={stats.staffMembers}
          href="/dashboard/staff"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />
        <DashboardCard
          title="Bookings today"
          value={stats.bookingsToday}
          description="Phase 5: Booking calendar"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            href="/dashboard/customers/new"
            label="Add customer"
            description="Create a new customer record"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            }
          />
          <QuickActionCard
            href="/dashboard/services/new"
            label="Add service"
            description="Add a service to your catalogue"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
          />
          <QuickActionCard
            href="/dashboard/staff/new"
            label="Add staff"
            description="Add a team member"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            }
          />
          <QuickActionCard
            href="/dashboard/settings"
            label="Business settings"
            description="Update your business profile"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              </svg>
            }
          />
        </div>
      </div>

      {/* Recent customers + services */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent customers */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent customers</h3>
            <Link href="/dashboard/customers" className="text-xs font-medium text-brand-600 hover:text-brand-500">
              View all
            </Link>
          </div>
          {recentCustomers.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-400">No customers yet.</p>
              <Link href="/dashboard/customers/new" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-500">
                Add your first customer
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentCustomers.map((c: Record<string, unknown>) => (
                <li key={c.id as string}>
                  <Link
                    href={`/dashboard/customers/${c.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{c.full_name as string}</p>
                      <p className="text-xs text-gray-500">{c.phone as string}</p>
                    </div>
                    <StatusBadge status={c.status as string} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Active services */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-900">Active services</h3>
            <Link href="/dashboard/services" className="text-xs font-medium text-brand-600 hover:text-brand-500">
              View all
            </Link>
          </div>
          {recentServices.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-gray-400">No services yet.</p>
              <Link href="/dashboard/services/new" className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-500">
                Add your first service
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentServices.map((s: Record<string, unknown>) => (
                <li key={s.id as string}>
                  <Link
                    href={`/dashboard/services/${s.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name as string}</p>
                      <p className="text-xs text-gray-500">{s.category as string} &middot; {s.duration_minutes as number} min</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">R {s.price as number}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Coming next */}
      <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/30 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Coming in Phase 5</h3>
            <p className="text-xs text-gray-500">
              Booking calendar, booking creation, confirmations, staff schedules, and WhatsApp booking messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
