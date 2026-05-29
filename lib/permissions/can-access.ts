import { ROLES, isSuperAdmin } from "./roles";

const PUBLIC_PREFIXES = ["/login", "/register", "/pricing", "/privacy", "/auth/callback"];

const ROLE_ROUTE_MAP: Record<string, string[]> = {
  [ROLES.BUSINESS_OWNER]: ["/dashboard", "/onboarding"],
  [ROLES.STAFF]: ["/staff"],
  [ROLES.SUPER_ADMIN]: ["/super-admin"],
};

export function canAccessRoute(
  pathname: string,
  role: string | null | undefined,
): boolean {
  // Root is public
  if (pathname === "/") return true;

  // Public routes are always allowed
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return true;
  }

  // Static/public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public")
  ) {
    return true;
  }

  // Auth callback
  if (pathname.startsWith("/auth/")) return true;

  // Logout
  if (pathname === "/logout") return true;

  // Unauthenticated users can't access anything else
  if (!role) return false;

  // Super admins can access anything
  if (isSuperAdmin(role)) return true;

  // Check role-route mapping
  const allowedPrefixes = ROLE_ROUTE_MAP[role] ?? [];
  return allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
}
