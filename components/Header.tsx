"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const pathname = usePathname();
  const { user, profile, loading, openLogin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, [menuOpen]);

  const label = profile?.full_name?.trim() || user?.email || "Account";
  const initial = label.charAt(0).toUpperCase();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(21,45,78,0.1)] bg-[rgba(247,251,255,0.86)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center">
          <img src="/repilot-logo.png" alt="RePilot" className="h-12 w-auto" />
        </Link>
        {loading ? (
          <span className="h-10 w-24 rounded-full bg-[rgba(18,54,95,0.06)]" />
        ) : user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-[rgba(18,54,95,0.16)] bg-white py-1.5 pl-1.5 pr-3 text-xs font-extrabold text-[#12365f]"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#12365f] text-sm text-white">
                {initial}
              </span>
              <span className="max-w-[140px] truncate">{label}</span>
            </button>
            {menuOpen ? (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-[rgba(21,45,78,0.12)] bg-white p-2 shadow-[0_18px_50px_rgba(30,64,105,0.16)]"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold text-[#10233f]">{label}</p>
                  <p className="truncate text-xs text-[#5d6f87]">{profile?.email || user.email}</p>
                  {profile ? (
                    <p className="mt-2 inline-flex rounded-full bg-[rgba(43,149,184,0.12)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#2b95b8]">
                      {profile.role}
                    </p>
                  ) : null}
                </div>
                {profile?.role === "admin" ? (
                  <Link
                    href="/admin/users"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-extrabold text-[#12365f] hover:bg-[rgba(18,54,95,0.05)]"
                  >
                    Dashboard
                  </Link>
                ) : null}
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-extrabold text-[#12365f] hover:bg-[rgba(18,54,95,0.05)]"
                  onClick={() => {
                    setMenuOpen(false);
                    void signOut().then(() => router.push("/"));
                  }}
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => openLogin("signin")}
            className="rounded-full border border-[rgba(18,54,95,0.16)] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#12365f]"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
