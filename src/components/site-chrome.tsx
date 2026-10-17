import { Link } from "@tanstack/react-router";
import { Menu, X, MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/kogon-logo.png.asset.json";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSessionUser } from "@/hooks/use-session-user";
import { supabase } from "@/integrations/supabase/client";

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  return <img src={logo.url} alt={t("school")} className={cn("rounded-sm object-contain", className)} />;
}

function Account() {
  const { t } = useI18n();
  const { user, name, ready } = useSessionUser();
  if (!ready) return null;
  if (!user) return <Link to="/auth" className="flex min-h-10 items-center text-xs font-medium text-primary hover:text-muted-foreground">{t("signIn")}</Link>;
  return <div className="flex items-center gap-2 text-xs text-foreground"><span className="min-w-0 flex-1 truncate">{name}</span><Button variant="ghost" onClick={() => supabase.auth.signOut()} className="h-10 rounded-sm px-2 text-xs hover:bg-secondary hover:text-foreground">{t("signOut")}</Button></div>;
}

function Languages({ footer = false }: { footer?: boolean }) {
  const { lang, setLang } = useI18n();
  return <select aria-label="Language" value={lang} onChange={e => setLang(e.target.value as Lang)} className={cn("h-11 w-14 shrink-0 cursor-pointer rounded-sm border-0 bg-transparent px-1 text-xs font-medium outline-none transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-ring", footer ? "text-primary-foreground" : "text-foreground")}>
    {(["uz", "ru", "en"] as Lang[]).map(l => <option key={l} value={l} className="bg-background text-foreground">{l.toUpperCase()}</option>)}
  </select>;
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="sticky top-0 z-30 border-b bg-background text-foreground">
    <div className="mx-auto grid h-[55px] max-w-[1100px] grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 md:h-[63px] md:px-6 xl:flex xl:justify-between">
      <Link to="/" onClick={close} className="flex min-w-0 items-center gap-2 xl:max-w-64" title={t("school")}>
        <Logo className="h-8 w-auto shrink-0" />
        <span className="truncate text-[13px] font-medium md:text-sm">{t("schoolShort")}</span>
      </Link>
      <nav className="hidden shrink-0 items-center gap-5 text-sm xl:flex" aria-label={t("quickLinks")}>
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary underline underline-offset-8" }}>{t("home")}</Link>
        <Link to="/items" activeProps={{ className: "text-primary underline underline-offset-8" }}>{t("browse")}</Link>
        <Link to="/post" search={{ kind: "lost" }}>{t("iLost")}</Link>
        <Link to="/post" search={{ kind: "found" }}>{t("iFound")}</Link>
        <Link to="/" hash="contact">{t("contactUs")}</Link>
      </nav>
      <div className="flex shrink-0 items-center gap-1"><Languages /><Button variant="ghost" size="icon" className="h-11 w-11" aria-label={t(open ? "closeMenu" : "menu")} aria-expanded={open} aria-controls="school-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu className="size-5" />}</Button></div>
    </div>
    {open && <div id="school-nav" className="absolute inset-x-0 top-full max-h-[calc(100dvh-56px)] overflow-y-auto border-b bg-background">
      <div className="mx-auto max-w-[1100px] px-4 pb-4 md:px-6">
        <nav className="border-t text-sm" aria-label={t("quickLinks")}>
          <Link onClick={close} to="/" className="flex min-h-11 items-center">{t("home")}</Link>
          <Link onClick={close} to="/items" className="flex min-h-11 items-center">{t("browse")}</Link>
          <Link onClick={close} to="/post" search={{ kind: "lost" }} className="flex min-h-11 items-center">{t("iLost")}</Link>
          <Link onClick={close} to="/post" search={{ kind: "found" }} className="flex min-h-11 items-center">{t("iFound")}</Link>
          <Link onClick={close} to="/" hash="contact" className="flex min-h-11 items-center">{t("contactUs")}</Link>
        </nav>
        <div className="border-t pt-2"><Account /></div>
      </div>
    </div>}
  </header>;
}

export function SiteFooter() {
  const { t } = useI18n();
  return <footer className="bg-primary text-primary-foreground">
    <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
      <div><div className="flex items-center gap-4"><Logo className="h-16 w-auto" /><span className="max-w-64 font-serif text-xl leading-snug">{t("school")}</span></div><p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/70">{t("serviceSubtitle")}</p></div>
      <div><h2 className="mb-4 font-sans text-sm font-semibold text-accent">{t("quickLinks")}</h2><nav className="grid gap-1 text-sm">
        <Link className="flex min-h-10 items-center justify-between" to="/">{t("home")}<ArrowUpRight className="h-3 w-3" /></Link>
        <Link className="flex min-h-10 items-center justify-between" to="/items">{t("browse")}<ArrowUpRight className="h-3 w-3" /></Link>
        <Link className="flex min-h-10 items-center justify-between" to="/post" search={{ kind: "lost" }}>{t("postLost")}<ArrowUpRight className="h-3 w-3" /></Link>
        <Link className="flex min-h-10 items-center justify-between" to="/post" search={{ kind: "found" }}>{t("postFound")}<ArrowUpRight className="h-3 w-3" /></Link>
      </nav></div>
      <div><h2 className="mb-5 font-sans text-sm font-semibold text-accent">{t("contactUs")}</h2><dl className="space-y-4 text-xs leading-relaxed text-primary-foreground/75">
        {[{icon:MapPin,label:"address",value:"city"},{icon:Phone,label:"phone",value:"notProvided"},{icon:Mail,label:"email",value:"notProvided"},{icon:Clock,label:"workingHours",value:"confirmHours"}].map(({icon:Icon,label,value}) => <div key={label} className="flex gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0" /><div><dt className="font-medium text-primary-foreground">{t(label)}</dt><dd>{t(value)}</dd></div></div>)}
      </dl></div>
    </div>
    <div className="border-t border-primary-foreground/15"><div className="mx-auto flex max-w-[1100px] flex-col items-start justify-between gap-3 px-4 py-4 md:flex-row md:items-center md:px-6"><p className="text-xs leading-relaxed text-primary-foreground/65">© 2026 {t("school")}. {t("rightsReserved")}</p><Languages footer /></div></div>
  </footer>;
}
