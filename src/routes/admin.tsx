import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useSessionUser } from "@/hooks/use-session-user";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Kogon ixtisoslashtirilgan maktabi" },
      { name: "description", content: "Administrator so'rovlarini boshqarish." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Request = { id: string; user_id: string; created_at: string; name: string | null };

function AdminPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, isAdmin, ready } = useSessionUser();
  const [requests, setRequests] = useState<Request[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (ready && (!user || !isAdmin)) navigate({ to: "/", replace: true });
  }, [ready, user, isAdmin, navigate]);

  async function load() {
    setLoadErr(false);
    const { data, error } = await supabase
      .from("admin_requests")
      .select("id, user_id, created_at, profiles(display_name)")
      .order("created_at", { ascending: true });
    if (error) { setLoadErr(true); setRequests(null); return; }
    setRequests(
      (data ?? []).map((r) => ({
        id: r.id,
        user_id: r.user_id,
        created_at: r.created_at,
        name: (r.profiles as { display_name: string | null } | null)?.display_name ?? null,
      })),
    );
  }

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  async function approve(r: Request) {
    setBusyId(r.id);
    const { error } = await supabase.rpc("approve_admin", { _user_id: r.user_id });
    setBusyId(null);
    if (!error) setRequests((prev) => (prev ?? []).filter((x) => x.id !== r.id));
  }

  if (!ready || !isAdmin) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-sans text-2xl font-semibold text-primary">{t("adminPanel")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("adminPanelDesc")}</p>

      <div className="mt-8">
        {requests === null && !loadErr && <p className="text-sm text-muted-foreground">{t("loading")}</p>}
        {loadErr && (
          <div>
            <p role="alert" className="text-sm text-destructive">{t("loadError")}</p>
            <Button variant="outline" onClick={load} className="mt-3 h-11">{t("retry")}</Button>
          </div>
        )}
        {requests?.length === 0 && <p className="text-sm text-muted-foreground">{t("noRequests")}</p>}
        <ul className="divide-y">
          {requests?.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{r.name ?? r.user_id}</p>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <Button onClick={() => approve(r)} disabled={busyId === r.id} className="h-11 shrink-0">
                {busyId === r.id ? t("loading") : t("approve")}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
