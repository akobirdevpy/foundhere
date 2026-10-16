import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: LoginPage });

type AuthMethod = "phone" | "google";

function LoginPage() {
  const { t } = useI18n();
  const nav = useNavigate();
  const { user, profile, profileLoading, refreshProfile } = useAuth();
  const [method, setMethod] = useState<AuthMethod>("phone");
  const [phone, setPhone] = useState("+998");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [busy, setBusy] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");

  if (user && profileLoading) return <main className="mx-auto max-w-md px-4 py-16 text-center" aria-live="polite">{t("loading")}</main>;
  if (user && !profile) return <ProfileStep onDone={async () => { await refreshProfile(); const redirect = new URLSearchParams(window.location.search).get("redirect"); window.location.assign(redirect?.startsWith("/") ? redirect : "/"); }} />;
  useEffect(() => { if (user && profile) { const redirect = new URLSearchParams(window.location.search).get("redirect"); window.location.assign(redirect?.startsWith("/") ? redirect : "/"); } }, [user, profile]);
  if (user) return <main className="mx-auto max-w-md px-4 py-16 text-center" aria-live="polite">{t("loading")}</main>;

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const normalized = phone.replace(/[\s()-]/g, "");
    if (!/^\+998\d{9}$/.test(normalized)) {
      setMessage(t("uzPhoneError")); setBusy(false); return;
    }
    const { error } = await supabase.auth.signInWithOtp({ phone: normalized });
    setMessage(error?.message ?? t("codeSent"));
    if (!error) setCodeSent(true);
    setBusy(false);
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    const { error } = await supabase.auth.verifyOtp({ phone: phone.replace(/[\s()-]/g, ""), token: otp, type: "sms" });
    if (error) setMessage(error.message); else nav({ to: "/" });
    setBusy(false);
  }

  async function google() {
    setBusy(true); setMessage("");
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    const redirectTo = `${window.location.origin}/login${redirect?.startsWith("/") ? `?redirect=${encodeURIComponent(redirect)}` : ""}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) { setMessage(t("googleAuthError")); setBusy(false); }
  }

  return <main className="mx-auto max-w-md px-4 py-12">
    <h1 className="text-3xl font-bold text-primary">{t("login")}</h1>
    <div className="star-divider my-4" />
    <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border bg-card p-1">
      <button type="button" className={`min-h-11 rounded-lg text-sm font-semibold ${method === "phone" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMethod("phone")}>{t("uzPhone")}</button>
      <button type="button" className={`min-h-11 rounded-lg text-sm font-semibold ${method === "google" ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setMethod("google")}>{t("googleAuth")}</button>
    </div>
    {method === "google" ? <section className="rounded-2xl border bg-card p-6"><Button className="w-full" onClick={google} disabled={busy}>{busy ? t("loading") : t("continueGoogle")}</Button>{message && <p role="alert" className="mt-4 text-sm text-destructive">{message}</p>}</section> : <form onSubmit={codeSent ? verifyCode : sendCode} className="space-y-4 rounded-2xl border bg-card p-6">
      <label className="block text-sm font-medium">{t("uzPhone")}<Input className="mt-2" type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 90 123 45 67" required /></label>
      {codeSent && <label className="block text-sm font-medium">{t("telegramCode")}<Input className="mt-2" inputMode="numeric" autoComplete="one-time-code" value={otp} onChange={e => setOtp(e.target.value)} required /></label>}
      <Button className="w-full" disabled={busy}>{busy ? t("loading") : codeSent ? t("verify") : t("sendCode")}</Button>
      {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
    </form>}
    <p className="mt-5 text-center text-sm text-muted-foreground">{t("telegramHelp")}</p>
  </main>;
}

function ProfileStep({ onDone }: { onDone: () => void }) {
  const { t } = useI18n(); const { user } = useAuth();
  const [name, setName] = useState(user.user_metadata?.full_name ?? user.user_metadata?.name ?? ""); const [cls, setCls] = useState(""); const [telegram, setTelegram] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function save(e: React.FormEvent) { e.preventDefault(); setBusy(true); setMessage(""); const { error } = await (supabase.from("profiles") as any).upsert({ id: user.id, full_name: name.trim(), class_name: cls.trim() || null, telegram_username: telegram.replace(/^@/, "").trim() || null, contact_info: user.phone ?? null }); if (error) setMessage(error.message); else await onDone(); setBusy(false); }
  return <main className="mx-auto max-w-md px-4 py-12"><h1 className="text-3xl font-bold text-primary">{t("profileSetup")}</h1><form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border bg-card p-6"><label className="block text-sm font-medium">{t("fullName")}<Input className="mt-2" value={name} onChange={e => setName(e.target.value)} required /></label><label className="block text-sm font-medium">{t("className")}<Input className="mt-2" value={cls} onChange={e => setCls(e.target.value)} /></label><label className="block text-sm font-medium">{t("telegramUsername")}<Input className="mt-2" value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="@username" /></label><Button className="w-full" disabled={busy}>{busy ? t("loading") : t("save")}</Button>{message && <p role="alert" className="text-sm text-destructive">{message}</p>}</form></main>;
}
