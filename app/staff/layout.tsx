import { requireRole } from "@/lib/auth/require-role";
import { AppShell } from "@/components/layouts/app-shell";
import { StaffNav } from "@/components/layouts/staff-nav";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, business } = await requireRole(["staff"]);

  return (
    <AppShell
      userDisplayName={profile.full_name}
      businessName={business?.name}
      role={profile.role}
      sidebar={<StaffNav />}
    >
      {children}
    </AppShell>
  );
}
