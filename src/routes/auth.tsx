import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
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

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.98 11.98 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
    </svg>
  );
}

function AdminRequest({ userId }: { userId: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "sent" | "requested" | "error">("idle");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    supabase.from("admin_requests").select("id").eq("user_id", userId).maybeSingle()
      .then(({ data }) => { if (live && data) setState("requested"); });
    return () => { live = false; };
  }, [userId]);

  async function request() {
    setBusy(true);
    const { error } = await supabase.from("admin_requests").insert({ user_id: userId });
    setBusy(false);
    setState(error ? "error" : "sent");
  }

  if (state === "sent" || state === "requested")
    return <p className="mt-6 text-sm text-muted-foreground">{t("requestSent")}</p>;
  return (
    <div className="mt-6 border-t pt-6">
      <Button variant="ghost" onClick={request} disabled={busy} className="h-11 w-full text-sm">
        {busy ? t("loading") : t("requestAdmin")}
      </Button>
      {state === "error" && <p role="alert" className="mt-2 text-sm text-destructive">{t("error")}</p>}
    </div>
  );
}

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, isAdmin, ready } = useSessionUser();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => { if (user && !isAdmin) navigate({ to: "/", replace: true }); }, [user, isAdmin, navigate]);

  async function google() {
    setBusy(true); setErr(false);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { setErr(true); setBusy(false); return; }
    if (r.redirected) return;
    setBusy(false);
  }

  if (ready && user && isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="border-t bg-background pt-8">
          <h1 className="font-sans text-3xl font-semibold text-primary">{t("adminPanel")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("adminPanelDesc")}</p>
          <Button asChild className="mt-6 h-12 w-full"><Link to="/admin">{t("adminPanel")}</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="border-t bg-background pt-8">
        <h1 className="font-sans text-3xl font-semibold text-primary">{t("signInTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("signInDesc")}</p>
        <Button variant="outline" onClick={google} disabled={busy} className="mt-6 h-12 w-full text-[15px]">
          <GoogleMark />
          {busy ? t("loading") : t("signInGoogle")}
        </Button>
        {err && <p role="alert" className="mt-4 text-sm text-destructive">{t("signInError")}</p>}
        {user && <AdminRequest userId={user.id} />}
      </div>
    </div>
  );
}
