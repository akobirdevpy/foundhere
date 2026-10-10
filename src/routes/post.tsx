import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, CLASSES, KEPT_AT, LOCATIONS } from "@/lib/options";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/post")({
  validateSearch: (s: Record<string, unknown>) => ({ kind: s.kind === "found" ? "found" : "lost" }) as { kind: "lost" | "found" },
  head: () => ({
    meta: [
      { title: "E'lon joylash | Kogon ixtisoslashtirilgan maktabi" },
      { name: "description", content: "Yo'qolgan yoki topilgan narsa haqida e'lon joylang." },
      { property: "og:title", content: "E'lon joylash | Kogon ixtisoslashtirilgan maktabi" },
      { property: "og:description", content: "Yo'qolgan yoki topilgan narsa haqida e'lon joylang." },
    ],
  }),
  component: PostPage,
});

const field = "h-10 w-full rounded-md border bg-card px-3 text-sm";

function PostPage() {
  const { kind } = Route.useSearch();
  const { t } = useI18n();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => (String(f.get(k) ?? "").trim() || null);
    setBusy(true);
    try {
      let photo_url: string | null = null;
      const file = f.get("photo") as File | null;
      if (file && file.size > 0) {
        const path = `${crypto.randomUUID()}.${file.name.split(".").pop() ?? "jpg"}`;
        const { error } = await supabase.storage.from("item-photos").upload(path, file, { contentType: file.type });
        if (error) throw error;
        photo_url = path;
      }
      const { data, error } = await supabase
        .from("items")
        .insert({
          kind,
          title: s("title")!,
          description: s("description"),
          category: s("category")!,
          location: s("location")!,
          class_name: s("class_name"),
          kept_at: kind === "found" ? s("kept_at") : null,
          contact_name: s("contact_name")!,
          contact_info: s("contact_info"),
          item_date: s("item_date") ?? new Date().toISOString().slice(0, 10),
          photo_url,
        })
        .select("id")
        .single();
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["items"] });
      toast.success(t("posted"));
      nav({ to: "/items/$id", params: { id: data.id } });
    } catch (err) {
      console.error(err);
      toast.error(t("error"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex rounded-xl border bg-card p-1">
        {(["lost", "found"] as const).map((k) => (
          <button key={k} type="button" onClick={() => nav({ to: "/post", search: { kind: k } })}
            className={cn("flex-1 rounded-lg py-2 text-sm font-semibold", kind === k && (k === "lost" ? "bg-lost text-lost-foreground" : "bg-success text-success-foreground"))}>
            {t(k === "lost" ? "iLost" : "iFound")}
          </button>
        ))}
      </div>
      <h1 className="text-3xl font-bold text-primary">{t(kind === "lost" ? "postLost" : "postFound")}</h1>
      <div className="star-divider my-4" />
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <L t={t} k="title"><Input name="title" required minLength={2} maxLength={120} /></L>
        <L t={t} k="description"><textarea name="description" maxLength={1000} rows={3} className="w-full rounded-md border bg-card p-3 text-sm" /></L>
        <div className="grid gap-4 sm:grid-cols-2">
          <L t={t} k="category">
            <select name="category" required className={field} defaultValue="">
              <option value="" disabled>{t("choose")}</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
            </select>
          </L>
          <L t={t} k="location">
            <select name="location" required className={field} defaultValue="">
              <option value="" disabled>{t("choose")}</option>
              {LOCATIONS.map((c) => <option key={c} value={c}>{t(c)}</option>)}
            </select>
          </L>
          <L t={t} k="className">
            <select name="class_name" className={field} defaultValue="">
              <option value="">—</option>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </L>
          <L t={t} k="date"><Input type="date" name="item_date" defaultValue={new Date().toISOString().slice(0, 10)} /></L>
          {kind === "found" && (
            <L t={t} k="keptAt">
              <select name="kept_at" required className={field} defaultValue="">
                <option value="" disabled>{t("choose")}</option>
                {KEPT_AT.map((c) => <option key={c} value={c}>{t(c)}</option>)}
              </select>
            </L>
          )}
          <L t={t} k="photo"><Input type="file" name="photo" accept="image/*" /></L>
          <L t={t} k="contactName"><Input name="contact_name" required minLength={2} maxLength={80} /></L>
          <L t={t} k="contactInfo"><Input name="contact_info" maxLength={120} /></L>
        </div>
        <Button type="submit" size="xl" className="w-full" disabled={busy}>{busy ? t("sending") : t("submit")}</Button>
      </form>
    </div>
  );
}

function L({ k, t, children }: { k: string; t: (k: string) => string; children: ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{t(k)}</span>{children}</label>;
}
