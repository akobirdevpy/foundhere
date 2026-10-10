import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ItemCard } from "@/components/item-card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { itemsQuery } from "@/lib/items";
import { CATEGORIES, LOCATIONS } from "@/lib/options";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/items/")({
  head: () => ({
    meta: [
      { title: "Barcha e'lonlar | Kogon ixtisoslashtirilgan maktabi" },
      { name: "description", content: "Maktabda yo'qolgan va topilgan narsalar ro'yxati." },
      { property: "og:title", content: "Barcha e'lonlar | Kogon ixtisoslashtirilgan maktabi" },
      { property: "og:description", content: "Maktabda yo'qolgan va topilgan narsalar ro'yxati." },
    ],
  }),
  component: Browse,
});

const sel = "h-9 rounded-md border bg-card px-3 text-sm";

function Browse() {
  const { t } = useI18n();
  const { data = [], isLoading } = useQuery(itemsQuery());
  const [kind, setKind] = useState("all");
  const [cat, setCat] = useState("");
  const [loc, setLoc] = useState("");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      data.filter(
        (i) =>
          (kind === "all" || i.kind === kind) &&
          (!cat || i.category === cat) &&
          (!loc || i.location === loc) &&
          (!q || `${i.title} ${i.description ?? ""}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [data, kind, cat, loc, q],
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold text-primary">{t("browse")}</h1>
      <div className="star-divider my-4" />
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex rounded-lg border bg-card p-1">
          {["all", "lost", "found"].map((k) => (
            <button key={k} onClick={() => setKind(k)} className={cn("rounded-md px-3 py-1 text-sm", kind === k && "bg-primary text-primary-foreground")}>
              {t(k)}
            </button>
          ))}
        </div>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="w-56 bg-card" />
        <select className={sel} value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">{t("category")}: {t("all")}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
        </select>
        <select className={sel} value={loc} onChange={(e) => setLoc(e.target.value)}>
          <option value="">{t("location")}: {t("all")}</option>
          {LOCATIONS.map((c) => <option key={c} value={c}>{t(c)}</option>)}
        </select>
      </div>
      {!isLoading && list.length === 0 && <p className="text-muted-foreground">{t("empty")}</p>}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((i) => <ItemCard key={i.id} item={i} />)}
      </div>
    </div>
  );
}
