import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, ClipboardPen, BadgeCheck, Building2, Inbox, RotateCw, MapPin, Clock, Phone, UserRound, Info } from "lucide-react";
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
      { name: "description", content: "Kogon shahar ixtisoslashtirilgan maktabining rasmiy topilmalar xizmati. Yo‘qolgan va topilgan narsalarni qidiring yoki e’lon bering." },
      { property: "og:title", content: "Topilmalar xizmati | Kogon shahar ixtisoslashtirilgan maktabi" },
      { property: "og:description", content: "Maktabning rasmiy yo‘qolgan va topilgan narsalar markazi." },
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
  function search(e: FormEvent) { e.preventDefault(); navigate({ to: "/items", search: { q: q.trim() } }); }
  return <>
    <section className="border-b bg-background">
      <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-6 md:py-16">
        <h1 className="max-w-3xl text-[30px] font-normal leading-tight text-primary md:text-4xl">{t("serviceTitle")}</h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-base">{t("serviceDescription")}</p>
        <div className="mt-6 flex items-center gap-3">
          <Button asChild className="h-11 rounded-xl px-4 text-sm"><Link to="/post" search={{ kind: "lost" }}>{t("iLost")}</Link></Button>
          <Button asChild variant="outline" className="h-11 rounded-xl bg-transparent px-4 text-sm"><Link to="/post" search={{ kind: "found" }}>{t("iFound")}</Link></Button>
        </div>
        <form onSubmit={search} role="search" className="relative mt-6 max-w-2xl">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input aria-label={t("searchItems")} placeholder={t("searchItems")} value={q} onChange={e => setQ(e.target.value)} className="h-11 min-w-0 rounded-lg border bg-secondary pl-10 pr-3 text-[15px] shadow-none placeholder:text-muted-foreground focus-visible:ring-1" />
        </form>
      </div>
    </section>
    <section className="border-b bg-background">
      <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-6 md:py-12">
        <h2 className="text-2xl font-normal text-primary">{t("howWorks")}</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {[{icon:ClipboardPen,title:"stepReport",text:"stepReportText"},{icon:BadgeCheck,title:"stepMatch",text:"stepMatchText"},{icon:Building2,title:"stepCollect",text:"stepCollectText"}].map(({icon:Icon,title,text},i) => <div key={title} className="flex gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center text-primary"><Icon className="h-6 w-6" /></div><div><span className="text-xs font-semibold text-muted-foreground">0{i+1}</span><h3 className="mt-1 text-lg font-semibold">{t(title)}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(text)}</p></div></div>)}
        </div>
      </div>
    </section>
    <section className="bg-card">
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between"><h2 className="min-w-0 text-2xl font-normal text-primary">{t("recentAnnouncements")}</h2><Link to="/items" className="flex min-h-11 items-center gap-2 text-sm font-normal text-primary hover:underline">{t("viewAll")}<ArrowRight className="h-4 w-4" /></Link></div>
        {isPending ? <div aria-label={t("loading")} role="status" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[0,1,2,3].map(i => <div key={i} className="overflow-hidden rounded-lg border"><Skeleton className="aspect-[4/3] rounded-none" /><div className="space-y-4 p-4"><Skeleton className="h-4 w-20" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></div></div>)}</div> : isError ? <div role="alert" className="border-y py-10 text-center"><p className="text-destructive">{t("loadError")}</p><Button variant="outline" className="mt-4 h-11" onClick={() => refetch()}><RotateCw />{t("retry")}</Button></div> : data.length === 0 ? <div className="flex flex-col items-center border-y py-12 text-center"><Inbox className="mb-4 h-10 w-10 text-muted-foreground" /><h3 className="text-xl font-semibold">{t("noAnnouncements")}</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{t("noAnnouncementsText")}</p><Button asChild variant="link" className="mt-4 h-11"><Link to="/post" search={{kind:"found"}}>{t("postFound")}<ArrowRight /></Link></Button></div> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{data.slice(0,8).map(i => <ItemCard key={i.id} item={i} />)}</div>}
      </div>
    </section>
    <section id="contact" className="scroll-mt-6 border-t bg-background">
      <div className="mx-auto max-w-[1100px] px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 flex items-center gap-3"><h2 className="min-w-0 text-2xl font-normal text-primary">{t("officialInformation")}</h2></div>
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{[{icon:MapPin,label:"collectionPoint",value:"administration",detail:"confirmOffice"},{icon:Clock,label:"workingHours",value:"confirmHours"},{icon:Phone,label:"phone",value:"notProvided"},{icon:UserRound,label:"responsibleStaff",value:"notProvided"}].map(({icon:Icon,label,value,detail}) => <div key={label}><Icon className="mb-4 h-5 w-5 text-primary" /><dt className="text-xs font-medium text-muted-foreground">{t(label)}</dt><dd className="mt-2 text-sm font-semibold leading-relaxed">{t(value)}</dd>{detail && <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{t(detail)}</dd>}</div>)}</dl>
        <p className="mt-10 flex items-start gap-3 border-t pt-6 text-sm leading-relaxed text-muted-foreground"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t("unclaimedNote")}</p>
      </div>
    </section>
  </>;
}
