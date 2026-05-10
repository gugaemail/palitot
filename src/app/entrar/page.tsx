"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/memoria";
  const urlError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}`,
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setError("Ocorreu um erro. Tente novamente em instantes.");
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "var(--ivory-warm)", border: "2px solid var(--terra)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="var(--terra)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2 className="font-serif text-moss text-2xl mb-3">Verifique seu email</h2>
        <p className="text-bark leading-relaxed">
          Enviamos um link mágico para <strong className="text-moss">{email}</strong>.
        </p>
        <p className="text-bark text-sm mt-2 opacity-70">
          Clique no link para entrar. O link expira em 1 hora.
        </p>
        <button
          className="mt-8 text-sm text-bark underline underline-offset-4"
          onClick={() => { setSent(false); setEmail(""); }}
        >
          Usar outro email
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-10">
        <p className="label-eyebrow mb-4">Área familiar</p>
        <h1
          className="font-serif text-moss mb-3"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontStyle: "italic" }}
        >
          Bem-vindo de volta
        </h1>
        <p className="text-bark text-sm leading-relaxed max-w-xs mx-auto">
          Digite seu email para receber um link de acesso. Simples assim.
        </p>
      </div>

      {urlError === "link_expirado" && (
        <div
          className="p-4 rounded-xl text-sm leading-relaxed mb-6"
          style={{ background: "#FFF5F0", border: "1px solid #FFD5C2", color: "#8B3A1A" }}
          role="alert"
        >
          Seu link de acesso expirou ou já foi usado. Solicite um novo link abaixo.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-bark mb-2 font-medium">
            Seu email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com.br"
            required
            className="field-input"
            autoFocus
            autoComplete="email"
          />
        </div>

        {error && (
          <div
            className="p-4 rounded-xl text-sm leading-relaxed"
            style={{ background: "#FFF5F0", border: "1px solid #FFD5C2", color: "#8B3A1A" }}
            role="alert"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="btn-primary w-full justify-center mt-2"
          style={{ opacity: loading || !email.trim() ? 0.6 : 1 }}
        >
          {loading ? "Enviando…" : "Receber link de acesso"}
        </button>
      </form>
    </>
  );
}

export default function EntrarPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "linear-gradient(160deg, #F7F3ED 0%, #F2E8DC 100%)" }}
    >
      {/* Logo */}
      <a
        href="/"
        className="font-serif text-moss text-sm tracking-widest uppercase mb-12 opacity-60 hover:opacity-100 transition-opacity"
        style={{ letterSpacing: "0.18em" }}
      >
        Família Palitot
      </a>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-8 sm:p-10"
        style={{ background: "white", border: "1px solid var(--sand)" }}
      >
        <Suspense fallback={<div className="text-center text-bark">Carregando…</div>}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Rodapé sutil */}
      <p className="text-xs text-bark opacity-40 mt-8 text-center max-w-xs leading-relaxed">
        Site privado da família Palitot. Acesso somente para membros cadastrados.
      </p>
    </div>
  );
}
