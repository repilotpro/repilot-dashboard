"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useAuth, type AuthMode } from "@/components/AuthProvider";

export default function LoginModal() {
  const { loginOpen, closeLogin, authMode, openLogin, refreshProfile, verifiedNotice } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!loginOpen) setSignedUp(false);
  }, [loginOpen]);

  if (!loginOpen) return null;

  const switchMode = (mode: AuthMode) => {
    setError(null);
    setSignedUp(false);
    openLogin(mode);
  };

  const getClient = () => {
    try {
      return createBrowserSupabase();
    } catch {
      setPending(false);
      setError("Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.");
      return null;
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const supabase = getClient();
    if (!supabase) return;

    if (authMode === "signup") {
      if (password.length < 8) {
        setPending(false);
        setError("Password must be at least 8 characters.");
        return;
      }
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: redirectUrl,
        },
      });
      setPending(false);
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        await refreshProfile();
      }
      setPassword("");
      setFullName("");
      setSignedUp(true);
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
    await refreshProfile();
    setPassword("");
    closeLogin();
  };

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(5,12,24,0.55)] backdrop-blur-md"
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
        {signedUp ? (
          <div className="grid justify-items-center px-2 py-4 text-center">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-[#e8f8ef] text-[#1f9d55]">
              <svg viewBox="0 0 24 24" className="h-14 w-14" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7.5 12.5 10.5 15.5 16.5 8.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 id="login-title" className="mt-6 text-[30px] font-semibold leading-none tracking-[-0.04em]">
              You&apos;re registered
            </h2>
            <p className="mt-4 text-sm font-medium leading-6 text-[#52657c]">
              We sent a confirmation email. Open it and confirm your address before you sign in.
            </p>
            <button type="button" onClick={closeLogin} className="btn-primary mt-6 w-full">
              Done
            </button>
          </div>
        ) : (
        <>
        <img src="/repilot-logo.png" alt="RePilot" className="mb-6 h-11 w-auto" />
        <div className="mb-6 flex gap-2 rounded-full bg-[rgba(18,54,95,0.06)] p-1">
          {(["signin", "signup"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => switchMode(mode)}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em] ${
                authMode === mode ? "bg-white text-[#12365f] shadow-sm" : "text-[#6b7e95]"
              }`}
            >
              {mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>
        <h2 id="login-title" className="mb-6 text-[30px] font-semibold leading-none tracking-[-0.04em]">
          {authMode === "signin" ? "Sign in" : "Create account"}
        </h2>
        {verifiedNotice && authMode === "signin" ? (
          <p className="mb-4 rounded-2xl bg-[#e8f8ef] px-4 py-3 text-sm font-semibold text-[#1f9d55]">
            Your account is verified. Sign in to continue.
          </p>
        ) : null}
        <form className="grid gap-4" onSubmit={(event) => void onSubmit(event)}>
          {authMode === "signup" ? (
            <label className="field-label">
              Full name
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="field font-medium normal-case tracking-normal"
                placeholder="Your name"
              />
            </label>
          ) : null}
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
              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
              required
              minLength={authMode === "signup" ? 8 : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="field font-medium normal-case tracking-normal"
              placeholder="Password"
            />
          </label>
          {error ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
          <button type="submit" className="btn-primary mt-2 w-full" disabled={pending}>
            {pending ? "Please wait…" : authMode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
        </>
        )}
      </div>
    </div>
  );
}
