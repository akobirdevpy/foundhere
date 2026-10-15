import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Profile = { id: string; full_name: string; class_name: string | null; contact_info: string | null };
type AuthContextValue = { user: any; profile: Profile | null; loading: boolean; signOut: () => Promise<void>; refreshProfile: () => Promise<void> };
const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true, signOut: async () => {}, refreshProfile: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null); const [profile, setProfile] = useState<Profile | null>(null); const [loading, setLoading] = useState(true);
  const refreshProfile = async () => { if (!user) { setProfile(null); return; } const { data } = await (supabase.from("profiles") as any).select("*").eq("id", user.id).maybeSingle(); setProfile(data); };
  useEffect(() => { let active = true; supabase.auth.getSession().then(({ data }) => { if (active) { setUser(data.session?.user ?? null); setLoading(false); } }); const { data } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user ?? null); setLoading(false); }); return () => { active = false; data.subscription.unsubscribe(); }; }, []);
  useEffect(() => { void refreshProfile(); }, [user?.id]);
  return <AuthContext.Provider value={{ user, profile, loading, signOut: async () => { await supabase.auth.signOut(); }, refreshProfile }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
export async function requireUser() { const { data } = await supabase.auth.getUser(); return data.user; }
