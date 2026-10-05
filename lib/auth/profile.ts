export const USER_ROLES = ["admin", "agent", "user"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.some((role) => role === value);
}
