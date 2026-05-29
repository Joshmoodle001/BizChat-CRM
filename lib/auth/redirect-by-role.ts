import { redirect } from "next/navigation";
import type { UserRole } from "@/types";

const ROLE_REDIRECT_MAP: Record<UserRole, string> = {
  super_admin: "/super-admin",
  business_owner: "/dashboard",
  staff: "/staff",
};

export function redirectByRole(role: UserRole | string | null | undefined) {
  if (!role) {
    redirect("/login");
  }

  const path = ROLE_REDIRECT_MAP[role as UserRole];
  if (path) {
    redirect(path);
  }

  redirect("/login");
}
