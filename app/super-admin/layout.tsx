import { requireRole } from "@/lib/auth/require-role";
import { AppShell } from "@/components/layouts/app-shell";
import { SuperAdminSidebar } from "@/components/layouts/super-admin-sidebar";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole(["super_admin"]);

  return (
    <AppShell
      userDisplayName={profile.full_name}
      role={profile.role}
      sidebar={<SuperAdminSidebar />}
    >
      {children}
    </AppShell>
  );
}
