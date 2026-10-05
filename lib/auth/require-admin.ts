import { createAuthServerClient } from "@/lib/supabase/server-auth";
import { createServerClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/auth/profile";

export async function requireAdmin() {
  const auth = await createAuthServerClient();
  const {
    data: { user },
    error,
  } = await auth.auth.getUser();

  if (error || !user) {
    return { ok: false as const, status: 401, error: "Sign in required" };
  }

  const admin = createServerClient();
  const { data, error: profileError } = await admin
    .from("profiles")
    .select("id, email, full_name, phone_number, role, is_verified, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { ok: false as const, status: 500, error: profileError.message };
  }

  const profile = data as Profile | null;
  if (!profile || profile.role !== "admin") {
    return { ok: false as const, status: 403, error: "Admin access required" };
  }

  return { ok: true as const, user, profile, admin };
}
