import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";
import { useSessionUser } from "@/hooks/use-session-user";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Kirish | Kogon ixtisoslashtirilgan maktabi" },
      { name: "description", content: "Kogon ixtisoslashtirilgan maktabi topilmalar markaziga Google hisobi orqali kiring." },
      { property: "og:title", content: "Kirish | Kogon ixtisoslashtirilgan maktabi" },
      { property: "og:description", content: "Google hisobi orqali kiring yoki ro'yxatdan o'ting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user } = useSessionUser();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/", replace: true }); }, [user, navigate]);

  async function google() {
    setBusy(true); setErr(false);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { setErr(true); setBusy(false); return; }
    if (r.redirected) return;
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-primary">{t("signInTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("signInDesc")}</p>
        <Button onClick={google} disabled={busy} className="mt-6 h-12 w-full">{busy ? t("loading") : t("signInGoogle")}</Button>
        {err && <p role="alert" className="mt-4 text-sm text-destructive">{t("signInError")}</p>}
      </div>
    </div>
  );
}
