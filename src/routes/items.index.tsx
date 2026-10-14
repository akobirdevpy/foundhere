import { createFileRoute, type SearchSchemaInput } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ItemCard } from "@/components/item-card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { itemsQuery } from "@/lib/items";
import { CATEGORIES, LOCATIONS } from "@/lib/options";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/items/")({
  validateSearch: (s: SearchSchemaInput & { q?: string; kind?: string; cat?: string; loc?: string }) => ({ q: typeof s.q === "string" ? s.q : "", kind: typeof s.kind === "string" && ["lost", "found"].includes(s.kind) ? s.kind : "all", cat: typeof s.cat === "string" ? s.cat : "", loc: typeof s.loc === "string" ? s.loc : "" }),
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { title: "Barcha e'lonlar | Kogon ixtisoslashtirilgan maktabi" },
      { name: "description", content: "Maktabda yo'qolgan va topilgan narsalar ro'yxati." },
      { property: "og:title", content: "Barcha e'lonlar | Kogon ixtisoslashtirilgan maktabi" },
      { property: "og:description", content: "Maktabda yo'qolgan va topilgan narsalar ro'yxati." },
    ],
  }),
  component: Browse,
});

const sel = "h-9 w-full sm:w-auto rounded-md border bg-card px-3 text-sm";

function Browse() {
  const { t } = useI18n();
  const { data = [], isLoading, isError } = useQuery(itemsQuery());
  const { kind, cat, loc, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const update = (values: Partial<{ kind: string; cat: string; loc: string; q: string }>) => navigate({ search: prev => ({ ...prev, ...values }), replace: true });
  const list = useMemo(
    () =>
      data.filter(
        (i) =>
          (kind === "all" || i.kind === kind) &&
          (!cat || i.category === cat) &&
          (!loc || i.location === loc) &&
          (!q || `${i.title} ${i.description ?? ""} ${i.category} ${t(i.category)}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [data, kind, cat, loc, q, t],
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold text-primary">{t("browse")}</h1>
      <div className="star-divider my-4" />
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex rounded-lg border bg-card p-1">
          {["all", "lost", "found"].map((k) => (
            <button key={k} onClick={() => update({ kind: k })} className={cn("rounded-md px-3 py-1 text-sm", kind === k && "bg-primary text-primary-foreground")}>
              {t(k)}
            </button>
          ))}
        </div>
        <Input value={q} onChange={(e) => update({ q: e.target.value })} placeholder={t("search")} className="w-full bg-card sm:w-56" />
        <select className={sel} value={cat} onChange={(e) => update({ cat: e.target.value })}>
          <option value="">{t("category")}: {t("all")}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
        </select>
        <select className={sel} value={loc} onChange={(e) => update({ loc: e.target.value })}>
          <option value="">{t("location")}: {t("all")}</option>
          {LOCATIONS.map((c) => <option key={c} value={c}>{t(c)}</option>)}
        </select>
      </div>
      {isLoading && <p className="text-muted-foreground">{t("loading")}</p>}
      {isError && <p className="text-destructive">{t("loadError")}</p>}
      {!isLoading && !isError && list.length === 0 && <p className="text-muted-foreground">{t("empty")}</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((i) => <ItemCard key={i.id} item={i} />)}
      </div>
    </div>
  );
}
