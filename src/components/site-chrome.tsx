import { Link } from "@tanstack/react-router";
import { Menu, X, MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { useState } from "react";
const logo = "/logo.jpg";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  return <img src={logo} alt="Kogon shahar ixtisoslashtirilgan maktabi logo" className={cn("rounded-sm object-contain", className)} />;
}

function Languages() {
  const { lang, setLang } = useI18n();
  return <div className="flex items-center gap-1" aria-label="Language">
    {(["uz", "ru", "en"] as Lang[]).map(l => <Button key={l} variant="ghost" onClick={() => setLang(l)} aria-label={{ uz: "O‘zbekcha", ru: "Русский", en: "English" }[l]} aria-pressed={lang === l} className={cn("h-10 min-w-10 rounded-sm px-2 text-xs uppercase hover:bg-primary-foreground/10 hover:text-primary-foreground", lang === l ? "font-semibold text-accent underline decoration-accent underline-offset-8" : "text-primary-foreground/75")}>{l}</Button>)}
  </div>;
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="relative z-30 bg-primary text-primary-foreground">
    <div className="border-b border-primary-foreground/15">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 md:px-6">
        <span className="text-[11px] font-medium uppercase tracking-normal text-primary-foreground/75">{t("officialService")}</span><Languages />
      </div>
    </div>
    <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-4 px-4 py-4 md:min-h-24 md:px-6">
      <Link to="/" onClick={close} className="flex min-w-0 items-center gap-3">
        <Logo className="h-12 w-auto shrink-0 md:h-14" />
        <span className="max-w-[224px] font-serif text-sm font-semibold leading-snug md:max-w-[300px] md:text-xl">{t("school")}</span>
      </Link>
      <nav className="hidden items-center gap-6 text-sm xl:flex" aria-label={t("quickLinks")}>
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-accent" }}>{t("home")}</Link>
        <Link to="/items" activeProps={{ className: "text-accent" }}>{t("browse")}</Link>
        <Link to="/post" search={{ kind: "lost" }}>{t("iLost")}</Link>
        <Link to="/post" search={{ kind: "found" }}>{t("iFound")}</Link>
        <Link to="/" hash="contact">{t("contactUs")}</Link>
      </nav>
      <Button variant="ghost" className="h-11 w-11 shrink-0 hover:bg-primary-foreground/10 hover:text-primary-foreground xl:hidden" aria-label={t(open ? "closeMenu" : "menu")} aria-expanded={open} aria-controls="school-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
    </div>
    {open && <nav id="school-nav" className="border-t border-primary-foreground/15 px-4 pb-4 xl:hidden" aria-label={t("quickLinks")}>
      <Link onClick={close} to="/" className="flex min-h-12 items-center">{t("home")}</Link>
      <Link onClick={close} to="/items" className="flex min-h-12 items-center">{t("browse")}</Link>
      <Link onClick={close} to="/post" search={{ kind: "lost" }} className="flex min-h-12 items-center">{t("iLost")}</Link>
      <Link onClick={close} to="/post" search={{ kind: "found" }} className="flex min-h-12 items-center">{t("iFound")}</Link>
      <Link onClick={close} to="/" hash="contact" className="flex min-h-12 items-center">{t("contactUs")}</Link>
    </nav>}
  </header>;
}

export function SiteFooter() {
  const { t } = useI18n();
  return <footer className="bg-primary text-primary-foreground">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
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
    <div className="border-t border-primary-foreground/15"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-4 md:flex-row md:items-center md:px-6"><p className="text-xs leading-relaxed text-primary-foreground/65">© 2026 {t("school")}. {t("rightsReserved")}</p><Languages /></div></div>
  </footer>;
}
