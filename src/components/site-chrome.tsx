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
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold">{t("school")}</div>
            <div className="text-xs text-accent">{t("subLabel")}</div>
          </div>
        </Link>
        <nav className="ml-auto hidden items-center gap-5 text-sm md:flex">
          <Link to="/" className="opacity-80 hover:opacity-100" activeOptions={{ exact: true }} activeProps={{ className: "opacity-100 font-semibold" }}>{t("home")}</Link>
          <Link to="/items" className="opacity-80 hover:opacity-100" activeProps={{ className: "opacity-100 font-semibold" }}>{t("browse")}</Link>
        </nav>
        <div className="ml-auto flex rounded-lg bg-primary-foreground/10 p-1 text-xs md:ml-4">
          {(["uz", "ru", "en"] as Lang[]).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={cn("rounded-md px-2 py-1 uppercase", lang === l && "bg-accent text-accent-foreground font-semibold")}>
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
