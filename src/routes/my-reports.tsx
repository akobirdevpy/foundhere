import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/item-card";
import { itemsQuery, type Item } from "@/lib/items";
import { forgetReport, getLocalReports } from "@/lib/report-ownership";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/my-reports")({ component: MyReportsPage });

function MyReportsPage() {
  const { t } = useI18n();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data = [], isLoading, isError, refetch } = useQuery(itemsQuery());
  const [busy, setBusy] = useState<string | null>(null);
  const ids = new Set(getLocalReports().map((report) => report.id));
  const reports = data.filter((item) => ids.has(item.id));

  async function remove(item: Item) {
    if (!window.confirm(t("deleteConfirm"))) return;
    setBusy(item.id);
    const { error } = await supabase.from("items").update({ owner_deleted_at: new Date().toISOString() }).eq("id", item.id);
    setBusy(null);
    if (error) return;
    forgetReport(item.id);
    await qc.invalidateQueries({ queryKey: ["items"] });
    nav({ to: "/my-reports" });
  }

  return <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
    <h1 className="text-3xl font-bold text-primary">{t("myReports")}</h1>
    <div className="star-divider my-4" />
    {isLoading && <p>{t("loading")}</p>}
    {isError && <div className="flex flex-col gap-3"><p>{t("loadError")}</p><Button onClick={() => refetch()}>{t("retry")}</Button></div>}
    {!isLoading && !isError && reports.length === 0 && <p className="rounded-2xl border bg-card p-8 text-muted-foreground">{t("noMyReports")}</p>}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((item) => <article key={item.id} className="flex flex-col gap-3"><ItemCard item={item} /><div className="flex gap-2"><Button asChild className="flex-1"><Link to="/post" search={{ kind: item.kind, edit: item.id }}>{t("edit")}</Link></Button><Button variant="outline" className="flex-1" disabled={busy === item.id} onClick={() => remove(item)}>{busy === item.id ? t("sending") : t("delete")}</Button></div></article>)}
    </div>
  </main>;
}
