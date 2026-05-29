import { redirect } from "next/navigation";
import { getCurrentProfile } from "./get-current-profile";
import { redirectByRole } from "./redirect-by-role";
import type { UserRole } from "@/types";

export async function requireRole(allowedRoles: UserRole[]) {
  const result = await getCurrentProfile();

  if (!result) {
    redirect("/login");
  }

  if (!allowedRoles.includes(result.profile.role)) {
    redirectByRole(result.profile.role);
  }

  return result;
}
