import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HandHeart, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site-chrome";
import { ItemCard } from "@/components/item-card";
import { useI18n } from "@/lib/i18n";
import { itemsQuery } from "@/lib/items";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Topilmalar markazi | Kogon ixtisoslashtirilgan maktabi" },
      { name: "description", content: "Yo'qolgan narsangizni birga topamiz — Kogon ixtisoslashtirilgan maktabi topilmalar markazi." },
      { property: "og:title", content: "Topilmalar markazi | Kogon ixtisoslashtirilgan maktabi" },
      { property: "og:description", content: "Yo'qolgan narsangizni birga topamiz." },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const { data = [] } = useQuery(itemsQuery());
  return (
    <>
      <section className="bg-primary text-primary-foreground star-pattern">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr] md:py-24">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">{t("heroTitle")}</h1>
            <p className="mt-4 text-lg text-accent">{t("heroSub")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild variant="heroLight" size="xl">
                <Link to="/post" search={{ kind: "lost" }}><SearchX /> {t("iLost")}</Link>
              </Button>
              <Button asChild variant="gold" size="xl">
                <Link to="/post" search={{ kind: "found" }}><HandHeart /> {t("iFound")}</Link>
              </Button>
            </div>
          </div>
          <Logo className="mx-auto w-56 rounded-3xl shadow-2xl ring-4 ring-accent/40 md:w-80" />
        </div>
      </section>
      <div className="star-divider" />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-semibold text-primary">{t("recent")}</h2>
          <Link to="/items" className="text-sm font-medium text-primary hover:underline">{t("viewAll")} →</Link>
        </div>
        {data.length === 0 ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.slice(0, 8).map((i) => <ItemCard key={i.id} item={i} />)}
          </div>
        )}
      </section>
    </>
  );
}
