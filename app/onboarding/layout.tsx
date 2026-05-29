import { requireRole } from "@/lib/auth/require-role";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(["business_owner"]);
  return <>{children}</>;
}
