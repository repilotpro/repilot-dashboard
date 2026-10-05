"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import Badge from "@/components/admin/ui/Badge";
import Button from "@/components/admin/ui/Button";

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = pathname === "/admin/users";
  const email = profile?.email ?? null;
  const name = profile?.full_name?.trim() || null;

  return (
    <div className="admin-app min-h-screen bg-[#f6f8fb]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-brand-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[260px] flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[72px] shrink-0 items-center border-b border-gray-200 px-5">
          <Link href="/">
            <img src="/repilot-logo.png" alt="RePilot" className="h-12 w-auto" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <div>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">People</p>
            <Link
              href="/admin/users"
              onClick={() => setMobileOpen(false)}
              className={`flex w-full shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition ${
                active ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50 hover:text-brand-800"
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                  active ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                <UsersIcon className="h-4 w-4" />
              </span>
              Users
            </Link>
          </div>
        </nav>
      </aside>
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-4 backdrop-blur lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-brand-700 lg:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-400">RePilot Admin</p>
              <p className="text-sm font-semibold text-brand-800">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-brand-800">{email || name || "Admin"}</p>
              <div className="mt-0.5 flex items-center justify-end gap-2">
                {name && email ? (
                  <p className="max-w-[200px] truncate text-[11px] text-gray-400" title={name}>
                    {name}
                  </p>
                ) : null}
                {profile ? (
                  <Badge color="primary" size="sm">
                    {profile.role}
                  </Badge>
                ) : null}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void signOut().then(() => router.push("/"));
              }}
            >
              Sign out
            </Button>
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
