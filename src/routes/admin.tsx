/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { itemsQuery } from "@/lib/items";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({ component: AdminPage });
function AdminPage() {
  const { t } = useI18n();
  const { user, loading, isAdmin } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery(itemsQuery());
  const [busy, setBusy] = useState<string | null>(null);
  if (loading) return <main className="mx-auto max-w-6xl px-4 py-12">{t("loading")}</main>;
  if (!user || !isAdmin)
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-primary">{t("accessDenied")}</h1>
        <Button className="mt-6" onClick={() => nav({ to: "/" })}>
          {t("home")}
        </Button>
      </main>
    );
  async function remove(id: string) {
    if (!window.confirm(t("deleteConfirm"))) return;
    setBusy(id);
    const { error } = await (supabase.from("items") as any).delete().eq("id", id);
    setBusy(null);
    if (!error) {
      await qc.invalidateQueries({ queryKey: ["items"] });
    }
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-accent">{t("admin")}</p>
          <h1 className="text-3xl font-bold text-primary">{t("adminReports")}</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/">{t("home")}</Link>
        </Button>
      </div>
      {isLoading ? (
        <p>{t("loading")}</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-card p-4 shadow-sm">
              <p className="text-xs text-muted-foreground">
                {item.kind} · {item.item_date}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              <div className="mt-4 flex gap-2">
                <Button asChild>
                  <Link to="/post" search={{ kind: item.kind as "lost" | "found", edit: item.id }}>
                    {t("edit")}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  disabled={busy === item.id}
                  onClick={() => remove(item.id)}
                >
                  {t("delete")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
