/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Home,
  Search,
  PlusCircle,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
const logo = "/logo.jpg";
import { useI18n, type Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Logo({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <img
      src={logo}
      alt="Kogon shahar ixtisoslashtirilgan maktabi logo"
      className={cn("rounded-sm object-contain", className)}
    />
  );
}

function Languages() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-1" aria-label="Language">
      {(["uz", "ru", "en"] as Lang[]).map((l) => (
        <Button
          key={l}
          variant="ghost"
          onClick={() => setLang(l)}
          aria-label={{ uz: "O‘zbekcha", ru: "Русский", en: "English" }[l]}
          aria-pressed={lang === l}
          className={cn(
            "h-8 min-w-8 rounded-sm px-1.5 text-[10px] uppercase hover:bg-primary-foreground/10 hover:text-primary-foreground md:h-10 md:min-w-10 md:px-2 md:text-xs",
            lang === l
              ? "font-semibold text-accent underline decoration-accent underline-offset-8"
              : "text-primary-foreground/75",
          )}
        >
          {l}
        </Button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const close = () => setOpen(false);
  return (
    <header className="relative z-30 bg-primary text-primary-foreground">
      <div className="border-b border-primary-foreground/15">
        <div className="mx-auto flex min-h-8 max-w-6xl items-center justify-between gap-3 px-4 md:min-h-9 md:px-6">
          <span className="truncate text-[9px] font-medium uppercase tracking-[0.08em] text-primary-foreground/75 sm:text-[10px]">
            {t("officialService")}
          </span>
          <Languages />
        </div>
      </div>
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 py-3 md:min-h-24 md:gap-4 md:px-6 md:py-4">
        <Link to="/" onClick={close} className="flex min-w-0 items-center gap-2.5 md:gap-3">
          <Logo className="size-9 shrink-0 md:h-14 md:w-auto" />
          <span className="max-w-[190px] truncate font-serif text-[13px] font-semibold leading-tight sm:max-w-[240px] sm:text-sm md:max-w-[300px] md:text-xl">
            {t("school")}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm xl:flex" aria-label={t("quickLinks")}>
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-accent" }}>
            {t("home")}
          </Link>
          <Link to="/items" activeProps={{ className: "text-accent" }}>
            {t("browse")}
          </Link>
          <Link to="/my-reports" activeProps={{ className: "text-accent" }}>
            {t("myReports")}
          </Link>
          {isAdmin && (
            <Link to="/admin" activeProps={{ className: "text-accent" }}>
              {t("admin")}
            </Link>
          )}
          <Link to="/post" search={{ kind: "lost" }}>
            {t("iLost")}
          </Link>
          <Link to="/post" search={{ kind: "found" }}>
            {t("iFound")}
          </Link>
          <Link to="/" hash="contact">
            {t("contactUs")}
          </Link>
          {user ? (
            <button className="text-accent" onClick={() => void signOut()}>
              {t("logout")}
            </button>
          ) : (
            <Link to="/login">{t("login")}</Link>
          )}
        </nav>
        <Button
          variant="ghost"
          className="size-10 shrink-0 rounded-md hover:bg-primary-foreground/10 hover:text-primary-foreground md:size-11 xl:hidden"
          aria-label={t(open ? "closeMenu" : "menu")}
          aria-expanded={open}
          aria-controls="school-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav
          id="school-nav"
          className="border-t border-primary-foreground/15 px-4 pb-3 xl:hidden"
          aria-label={t("quickLinks")}
        >
          <Link onClick={close} to="/" className="flex min-h-12 items-center">
            {t("home")}
          </Link>
          <Link onClick={close} to="/items" className="flex min-h-12 items-center">
            {t("browse")}
          </Link>
          <Link onClick={close} to="/my-reports" className="flex min-h-12 items-center">
            {t("myReports")}
          </Link>
          {isAdmin && (
            <Link onClick={close} to="/admin" className="flex min-h-12 items-center">
              {t("admin")}
            </Link>
          )}
          <Link
            onClick={close}
            to="/post"
            search={{ kind: "lost" }}
            className="flex min-h-11 items-center border-b border-primary-foreground/10 text-sm font-medium last:border-b-0"
          >
            {t("iLost")}
          </Link>
          <Link
            onClick={close}
            to="/post"
            search={{ kind: "found" }}
            className="flex min-h-11 items-center border-b border-primary-foreground/10 text-sm font-medium last:border-b-0"
          >
            {t("iFound")}
          </Link>
          <Link onClick={close} to="/" hash="contact" className="flex min-h-12 items-center">
            {t("contactUs")}
          </Link>
          {user ? (
            <button
              onClick={() => {
                close();
                void signOut();
              }}
              className="flex min-h-11 items-center border-b border-primary-foreground/10 text-sm font-medium last:border-b-0"
            >
              {t("logout")}
            </button>
          ) : (
            <Link onClick={close} to="/login" className="flex min-h-12 items-center">
              {t("login")}
            </Link>
          )}
        </nav>
      )}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card/95 px-1 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur xl:hidden"
        aria-label={t("quickLinks")}
      >
        {[
          { to: "/", label: "home", icon: Home },
          { to: "/items", label: "browse", icon: Search },
          { to: "/post", label: "postFound", icon: PlusCircle, search: { kind: "found" } },
          { to: "/my-reports", label: "myReports", icon: ClipboardList },
          { to: "/login", label: "login", icon: UserCircle },
        ].map(({ to, label, icon: Icon, search }) => (
          <Link
            key={label}
            to={to as any}
            search={search as any}
            className="flex min-h-13 flex-col items-center justify-center gap-0.5 px-0.5 text-[9px] font-medium text-muted-foreground sm:text-[10px]"
          >
            <Icon className="h-5 w-5" />
            <span>{t(label)}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-6">
        <div>
          <div className="flex items-center gap-4">
            <Logo className="h-16 w-auto" />
            <span className="max-w-64 font-serif text-xl leading-snug">{t("school")}</span>
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
            {t("serviceSubtitle")}
          </p>
        </div>
        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold text-accent">{t("quickLinks")}</h2>
          <nav className="grid gap-1 text-sm">
            <Link className="flex min-h-10 items-center justify-between" to="/">
              {t("home")}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link className="flex min-h-10 items-center justify-between" to="/items">
              {t("browse")}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link
              className="flex min-h-10 items-center justify-between"
              to="/post"
              search={{ kind: "lost" }}
            >
              {t("postLost")}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <Link
              className="flex min-h-10 items-center justify-between"
              to="/post"
              search={{ kind: "found" }}
            >
              {t("postFound")}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </nav>
        </div>
        <div>
          <h2 className="mb-5 font-sans text-sm font-semibold text-accent">{t("contactUs")}</h2>
          <dl className="space-y-4 text-xs leading-relaxed text-primary-foreground/75">
            {[
              { icon: MapPin, label: "address", value: "city" },
              { icon: Phone, label: "phone", value: "notProvided" },
              { icon: Mail, label: "email", value: "notProvided" },
              { icon: Clock, label: "workingHours", value: "confirmHours" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <dt className="font-medium text-primary-foreground">{t(label)}</dt>
                  <dd>{t(value)}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-4 md:flex-row md:items-center md:px-6">
          <p className="text-xs leading-relaxed text-primary-foreground/65">
            © 2026 {t("school")}. {t("rightsReserved")}
          </p>
          <Languages />
        </div>
      </div>
    </footer>
  );
}
