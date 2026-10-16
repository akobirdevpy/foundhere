import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ArrowRight,
  ClipboardPen,
  BadgeCheck,
  Building2,
  Inbox,
  RotateCw,
  MapPin,
  Clock,
  Phone,
  UserRound,
  Info,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ItemCard } from "@/components/item-card";
import { useI18n } from "@/lib/i18n";
import { itemsQuery } from "@/lib/items";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Topilmalar xizmati | Kogon shahar ixtisoslashtirilgan maktabi" },
      {
        name: "description",
        content:
          "Kogon shahar ixtisoslashtirilgan maktabining rasmiy topilmalar xizmati. Yo‘qolgan va topilgan narsalarni qidiring yoki e’lon bering.",
      },
      {
        property: "og:title",
        content: "Topilmalar xizmati | Kogon shahar ixtisoslashtirilgan maktabi",
      },
      {
        property: "og:description",
        content: "Maktabning rasmiy yo‘qolgan va topilgan narsalar markazi.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://foundhere.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://foundhere.lovable.app/" }],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const { data = [], isPending, isError, refetch } = useQuery(itemsQuery());
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  function search(e: FormEvent) {
    e.preventDefault();
    navigate({ to: "/items", search: { q: q.trim() } });
  }
  return (
    <>
      <Link
        to="/post"
        search={{ kind: "lost" }}
        className="fixed bottom-20 right-4 z-30 rounded-full bg-accent px-4 py-3 text-sm font-bold text-accent-foreground shadow-lg transition hover:scale-[1.02] xl:hidden"
      >
        {t("submit")}
      </Link>
      <section className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              {t("officialService")}
            </span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-primary md:text-5xl">
            {t("serviceTitle")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed">
            {t("serviceSubtitle")}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("serviceDescription")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12">
              <Link to="/post" search={{ kind: "lost" }}>
                {t("iLost")}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="goldOutline" size="lg" className="h-12">
              <Link to="/post" search={{ kind: "found" }}>
                {t("iFound")}
                <ArrowRight />
              </Link>
            </Button>
          </div>
          <form
            onSubmit={search}
            role="search"
            className="mt-10 flex max-w-2xl items-center gap-2 rounded-lg border bg-background p-2 shadow-sm"
          >
            <Search className="ml-2 hidden h-5 w-5 shrink-0 text-muted-foreground sm:block" />
            <Input
              aria-label={t("searchItems")}
              placeholder={t("searchItems")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-11 min-w-0 border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
            />
            <Button type="submit" className="h-11 shrink-0 px-4">
              <Search className="sm:hidden" />
              <span className="hidden sm:inline">{t("searchAction")}</span>
            </Button>
          </form>
        </div>
      </section>
      <section className="border-b bg-background">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
          <h2 className="text-2xl font-semibold text-primary">{t("howWorks")}</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              { icon: ClipboardPen, title: "stepReport", text: "stepReportText" },
              { icon: BadgeCheck, title: "stepMatch", text: "stepMatchText" },
              { icon: Building2, title: "stepCollect", text: "stepCollectText" },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border bg-card text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">0{i + 1}</span>
                  <h3 className="mt-1 text-lg font-semibold">{t(title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(text)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-primary md:text-3xl">
              {t("recentAnnouncements")}
            </h2>
            <Link
              to="/items"
              className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {isPending ? (
            <div
              aria-label={t("loading")}
              role="status"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="overflow-hidden rounded-lg border">
                  <Skeleton className="aspect-[4/3] rounded-none" />
                  <div className="space-y-4 p-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div role="alert" className="border-y py-10 text-center">
              <p className="text-destructive">{t("loadError")}</p>
              <Button variant="outline" className="mt-4 h-11" onClick={() => refetch()}>
                <RotateCw />
                {t("retry")}
              </Button>
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center border-y py-12 text-center">
              <Inbox className="mb-4 h-10 w-10 text-muted-foreground" />
              <h3 className="text-xl font-semibold">{t("noAnnouncements")}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("noAnnouncementsText")}
              </p>
              <Button asChild variant="link" className="mt-4 h-11">
                <Link to="/post" search={{ kind: "found" }}>
                  {t("postFound")}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {data.slice(0, 8).map((i) => (
                <ItemCard key={i.id} item={i} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section id="contact" className="scroll-mt-6 border-t bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-7 w-1 bg-accent" />
            <h2 className="text-2xl font-semibold text-primary md:text-3xl">
              {t("officialInformation")}
            </h2>
          </div>
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: MapPin,
                label: "collectionPoint",
                value: "administration",
                detail: "confirmOffice",
              },
              { icon: Clock, label: "workingHours", value: "confirmHours" },
              { icon: Phone, label: "phone", value: "notProvided" },
              { icon: UserRound, label: "responsibleStaff", value: "notProvided" },
            ].map(({ icon: Icon, label, value, detail }) => (
              <div key={label}>
                <Icon className="mb-4 h-5 w-5 text-primary" />
                <dt className="text-xs font-medium text-muted-foreground">{t(label)}</dt>
                <dd className="mt-2 text-sm font-semibold leading-relaxed">{t(value)}</dd>
                {detail && (
                  <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {t(detail)}
                  </dd>
                )}
              </div>
            ))}
          </dl>
          <p className="mt-10 flex items-start gap-3 border-t pt-6 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {t("unclaimedNote")}
          </p>
        </div>
      </section>
    </>
  );
}
