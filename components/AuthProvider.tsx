"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { hasPublicSupabaseConfig } from "@/lib/supabase/env";
import type { Profile } from "@/lib/auth/profile";
import LoginModal from "@/components/LoginModal";

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PROFILE_COLUMNS =
  "id, email, full_name, phone_number, role, is_verified, created_at, updated_at";

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = hasPublicSupabaseConfig();
  const supabase = useMemo(() => (configured ? createBrowserSupabase() : null), [configured]);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!supabase) {
      setUser(null);
      setProfile(null);
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const current = session?.user ?? null;
    setUser(current);
    if (!current) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select(PROFILE_COLUMNS)
      .eq("id", current.id)
      .maybeSingle();
    setProfile((data as Profile | null) ?? null);
  }, [supabase]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") !== "1") return;
    setLoginOpen(true);
    params.delete("login");
    const next = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${next ? `?${next}` : ""}`);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    let active = true;
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      const current = session?.user ?? null;
      setUser((previous) => {
        if (event === "TOKEN_REFRESHED" && previous?.id === current?.id) return previous;
        return current;
      });
      if (!current) {
        setProfile(null);
        setLoading(false);
        return;
      }
      if (event !== "INITIAL_SESSION" && event !== "SIGNED_IN" && event !== "USER_UPDATED") {
        setLoading(false);
        return;
      }
      const userId = current.id;
      setTimeout(() => {
        if (!active) return;
        void supabase
          .from("profiles")
          .select(PROFILE_COLUMNS)
          .eq("id", userId)
          .maybeSingle()
          .then(({ data }) => {
  if (active) {
    setProfile((data as Profile | null) ?? null);
    setLoading(false);
  }
});
      }, 0);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabase]);

  const openLogin = useCallback(() => setLoginOpen(true), []);
  const closeLogin = useCallback(() => setLoginOpen(false), []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      loginOpen,
      openLogin,
      closeLogin,
      signOut,
      refreshProfile,
    }),
    [user, profile, loading, loginOpen, openLogin, closeLogin, signOut, refreshProfile],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
