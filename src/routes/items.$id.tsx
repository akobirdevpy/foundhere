/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { ItemCard, KindBadge } from "@/components/item-card";
import { useI18n } from "@/lib/i18n";
import { itemsQuery, usePhotoUrl } from "@/lib/items";
import { scoreMatches } from "@/lib/matching";

export const Route = createFileRoute("/items/$id")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "E'lon | Kogon ixtisoslashtirilgan maktabi" },
      { name: "description", content: "Yo'qolgan yoki topilgan narsa haqida e'lon." },
      { property: "og:title", content: "E'lon | Kogon ixtisoslashtirilgan maktabi" },
      { property: "og:description", content: "Yo'qolgan yoki topilgan narsa haqida e'lon." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const { user } = useAuth();
  const nav = useNavigate();
  const { data = [], isLoading, isError } = useQuery(itemsQuery());
  const item = data.find((i) => i.id === id);
  const url = usePhotoUrl(item?.photo_url ?? null);
  if (isLoading) return <p className="p-10 text-center text-muted-foreground">{t("loading")}</p>;
  if (isError) return <p className="p-10 text-center text-destructive">{t("loadError")}</p>;
  if (!item) return <p className="p-10 text-center text-muted-foreground">{t("empty")}</p>;
  const matches = scoreMatches(item, data, user?.id);
  const rows: [string, string | null][] = [
    ["category", t((item as any).custom_category || item.category)],
    ["location", t((item as any).custom_location || item.location)],
    ["className", item.class_name],
    ["keptAt", item.kept_at ? t(item.kept_at) : null],
    ["date", item.item_date],
    ["contact", [item.contact_name, item.contact_info].filter(Boolean).join(" · ")],
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/items" className="mb-6 inline-flex items-center gap-1 text-sm text-primary">
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-secondary">
          {url ? (
            <img src={url} alt={item.title} className="w-full object-cover" />
          ) : (
            <div className="aspect-[4/3] star-pattern bg-primary" />
          )}
        </div>
        <div>
          <KindBadge kind={item.kind} />
          <h1 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{item.title}</h1>
          {(item as any).owner_user_id === user?.id && (
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => nav({ to: "/post", search: { kind: item.kind, edit: item.id } })}
              >
                {t("edit")}
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  if (!window.confirm(t("deleteConfirm"))) return;
                  const { error } = await (supabase.from("items") as any)
                    .update({ owner_deleted_at: new Date().toISOString(), deleted_by_owner: true })
                    .eq("id", item.id)
                    .eq("owner_user_id", user.id);
                  if (!error) nav({ to: "/my-reports" });
                }}
              >
                {t("delete")}
              </Button>
            </div>
          )}
          {item.description && <p className="mt-3 text-muted-foreground">{item.description}</p>}
          <dl className="mt-6 divide-y rounded-xl border bg-card">
            {rows
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{t(k)}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </div>
      <div className="star-divider my-10" />
      <h2 className="mb-5 text-2xl font-semibold text-primary">✨ {t("matches")}</h2>
      {matches.length === 0 ? (
        <p className="text-muted-foreground">{t("noMatches")}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map(({ item: match, level }) => (
            <div key={match.id} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-primary">
                <span>{level === "high" ? "High" : "Possible"}</span>
                <Link to="/items/$id" params={{ id: match.id }} className="underline">
                  {t("viewItem")}
                </Link>
              </div>
              <ItemCard item={match} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
