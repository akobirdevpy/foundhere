/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  full_name: string;
  class_name: string | null;
  contact_info: string | null;
  telegram_username?: string | null;
  avatar_url?: string | null;
};
type AuthContextValue = {
  user: any;
  profile: Profile | null;
  profileLoading: boolean;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  profileLoading: false,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsAdmin(false);
      return;
    }
    setProfileLoading(true);
    const [{ data: profileData }, { data: roleData }] = await Promise.all([
      ((supabase as any).from("profiles") as any).select("*").eq("id", user.id).maybeSingle(),
      ((supabase as any).from("user_roles") as any)
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);
    setProfile(profileData ?? null);
    setIsAdmin(roleData?.role === "admin");
    setProfileLoading(false);
  }, [user]);
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile, user?.id]);
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        profileLoading,
        loading,
        isAdmin,
        signOut: async () => {
          await supabase.auth.signOut();
        },
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
export async function requireUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
