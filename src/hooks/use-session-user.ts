import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSessionUser() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setName(null); setIsAdmin(false); return; }
    let live = true;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => { if (live) setName(data?.display_name ?? user.email ?? null); });
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => { if (live) setIsAdmin(!!data); });
    return () => { live = false; };
  }, [user]);

  return { user, name, isAdmin, ready };
}
