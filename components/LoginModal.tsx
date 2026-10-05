"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export default function LoginModal() {
  const { loginOpen, closeLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!loginOpen) return null;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    let supabase;
    try {
      supabase = createBrowserSupabase();
    } catch {
      setPending(false);
      setError("Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.");
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    setPassword("");
    closeLogin();
  };

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(5,12,24,0.55)] backdrop-blur-md"
      onClick={closeLogin}
      role="presentation"
    >
      <div
        className="relative w-[min(440px,calc(100vw-32px))] rounded-[28px] border border-[rgba(21,45,78,0.14)] bg-[rgba(247,249,251,0.94)] p-8 text-[#10233f] shadow-[0_35px_100px_rgba(0,0,0,0.28)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeLogin}
          className="absolute right-5 top-4 text-2xl leading-none text-[#708096]"
          aria-label="Close"
        >
          ×
        </button>
        <img src="/repilot-logo.png" alt="RePilot" className="mb-6 h-11 w-auto" />
        <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#2b95b8]">
          Account
        </p>
        <h2 id="login-title" className="mb-6 text-[30px] font-semibold leading-none tracking-[-0.04em]">
          Sign in
        </h2>
        <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)}>
          <label className="field-label">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field font-medium normal-case tracking-normal"
              placeholder="you@email.com"
            />
          </label>
          <label className="field-label">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field font-medium normal-case tracking-normal"
              placeholder="Password"
            />
          </label>
          {error ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
          <button type="submit" className="btn-primary mt-2 w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
