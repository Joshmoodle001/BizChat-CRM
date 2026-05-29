export const ROLES = {
  SUPER_ADMIN: "super_admin",
  BUSINESS_OWNER: "business_owner",
  STAFF: "staff",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_REDIRECTS: Record<Role, string> = {
  super_admin: "/super-admin",
  business_owner: "/dashboard",
  staff: "/staff",
};

export function isSuperAdmin(role: string | null | undefined): boolean {
  return role === ROLES.SUPER_ADMIN;
}

export function isBusinessOwner(role: string | null | undefined): boolean {
  return role === ROLES.BUSINESS_OWNER;
}

export function isStaff(role: string | null | undefined): boolean {
  return role === ROLES.STAFF;
}
