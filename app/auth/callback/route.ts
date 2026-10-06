import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";
import { createServerClient as createAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const admin = createAdminClient();
      await admin
        .from("profiles")
        .update({ is_verified: true, updated_at: new Date().toISOString() })
        .eq("id", data.user.id);

      await supabase.auth.signOut();

      return NextResponse.redirect(`${origin}/?verified=1`);
    }
  }

  return NextResponse.redirect(`${origin}/?auth_error=verification_failed`);
}
