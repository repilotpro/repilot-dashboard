import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { isUserRole, type Profile, type UserRole } from "@/lib/auth/profile";

const PROFILE_COLUMNS =
  "id, email, full_name, phone_number, role, is_verified, created_at, updated_at";

export async function GET(request: Request) {
  const access = await requireAdmin();
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const role = searchParams.get("role");
  const verified = searchParams.get("verified");

  let builder = access.admin.from("profiles").select(PROFILE_COLUMNS).order("created_at", { ascending: false });

  if (role && isUserRole(role)) {
    builder = builder.eq("role", role);
  }
  if (verified === "true" || verified === "false") {
    builder = builder.eq("is_verified", verified === "true");
  }
  if (query) {
    const pattern = `%${query.replaceAll("%", "")}%`;
    builder = builder.or(`email.ilike.${pattern},full_name.ilike.${pattern}`);
  }

  const [{ data, error }, totals] = await Promise.all([
    builder,
    access.admin.from("profiles").select("role, is_verified"),
  ]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (totals.error) {
    return NextResponse.json({ error: totals.error.message }, { status: 500 });
  }

  const users = (data ?? []) as Profile[];
  const all = totals.data ?? [];
  return NextResponse.json({
    users,
    stats: {
      total: all.length,
      admins: all.filter((row) => row.role === "admin").length,
      verified: all.filter((row) => row.is_verified).length,
    },
  });
}

export async function POST(request: Request) {
  const access = await requireAdmin();
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    fullName?: string;
    role?: string;
    isVerified?: boolean;
  };

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const fullName = body.fullName?.trim() ?? "";
  const role: UserRole = body.role && isUserRole(body.role) ? body.role : "user";
  const isVerified = body.isVerified !== false;

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and a password of at least 8 characters are required." },
      { status: 400 },
    );
  }

  const { data, error } = await access.admin.auth.admin.createUser({
    email,
    password,
    email_confirm: isVerified,
    user_metadata: { full_name: fullName },
    app_metadata: { role },
  });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? "Could not create user" }, { status: 400 });
  }

  const profile = {
    id: data.user.id,
    email,
    full_name: fullName || null,
    role,
    is_verified: isVerified,
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await access.admin.from("profiles").upsert(profile);
  if (profileError) {
    return NextResponse.json(
      { error: `User was created in Auth, but the profile row failed: ${profileError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, id: data.user.id });
}

export async function PATCH(request: Request) {
  const access = await requireAdmin();
  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const body = (await request.json()) as {
    id?: string;
    role?: string;
    isVerified?: boolean;
  };

  if (!body.id) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }

  const updates: { role?: UserRole; is_verified?: boolean; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (body.role) {
    if (!isUserRole(body.role)) {
      return NextResponse.json({ error: "Unknown role." }, { status: 400 });
    }
    updates.role = body.role;
  }
  if (typeof body.isVerified === "boolean") {
    updates.is_verified = body.isVerified;
    if (body.isVerified) {
      await access.admin.auth.admin.updateUserById(body.id, { email_confirm: true });
    }
  }
  if (updates.role) {
    await access.admin.auth.admin.updateUserById(body.id, { app_metadata: { role: updates.role } });
  }

  const { error } = await access.admin.from("profiles").update(updates).eq("id", body.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
