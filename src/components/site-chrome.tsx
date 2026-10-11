import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import logo from "@/assets/kogon-logo.png.asset.json";
import { useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <img src={logo.url} alt="Kogon shahar ixtisoslashtirilgan maktabi" className={cn("rounded-lg object-cover", className)} />;
}

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  return (
    <header className="sticky top-0 z-30 bg-primary text-primary-foreground shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-1.5 md:gap-3 md:px-4 md:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 md:gap-3">
          <Logo className="h-8 w-8 shrink-0 md:h-11 md:w-11" />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-serif text-sm font-semibold md:text-lg">{t("school")}</div>
            <div className="hidden text-xs text-accent sm:block">{t("subLabel")}</div>
          </div>
        </Link>
        <nav className="ml-auto flex shrink-0 items-center gap-3 text-xs md:gap-5 md:text-sm">
          <Link to="/" className="hidden opacity-80 hover:opacity-100 md:inline" activeOptions={{ exact: true }} activeProps={{ className: "opacity-100 font-semibold" }}>{t("home")}</Link>
          <Link to="/items" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>{t("browse")}</Link>
        </nav>
        <div className="flex shrink-0 rounded-lg bg-primary-foreground/10 p-0.5 text-[11px] md:ml-2 md:p-1 md:text-xs">
          {(["uz", "ru", "en"] as Lang[]).map((l) => (
            <button key={l} onClick={() => setLang(l)} aria-label={l} className={cn("rounded-md px-1.5 py-0.5 uppercase md:px-2 md:py-1", lang === l && "bg-accent text-accent-foreground font-semibold")}>
              {l}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 bg-primary text-primary-foreground star-pattern">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div className="flex items-center gap-3">
          <Logo className="h-16 w-16" />
          <div className="font-serif text-xl">Kogon shahar ixtisoslashtirilgan maktabi</div>
        </div>
        <p className="text-sm opacity-90 md:pt-3">⭐ {t("rule")}</p>
        <div className="flex gap-2 text-sm md:pt-3">
          <MapPin className="h-4 w-4 shrink-0 text-accent" />
          <div><div className="font-semibold">{t("office")}</div><div className="opacity-80">Kogon shahar ixtisoslashtirilgan maktabi</div></div>
        </div>
      </div>
    </footer>
  );
}
