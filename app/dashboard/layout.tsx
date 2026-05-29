import { requireRole } from "@/lib/auth/require-role";
import { AppShell } from "@/components/layouts/app-shell";
import { DashboardSidebar } from "@/components/layouts/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, business } = await requireRole(["business_owner"]);

  return (
    <AppShell
      userDisplayName={profile.full_name}
      businessName={business?.name}
      role={profile.role}
      sidebar={<DashboardSidebar />}
    >
      {children}
    </AppShell>
  );
}
