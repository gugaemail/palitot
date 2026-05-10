"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/memoria";
  const urlError = searchParams.get("error");

  async function handleEmailPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
        setError("Email ou senha incorretos.");
      } else {
        setError("Ocorreu um erro. Tente novamente.");
      }
    } else {
      window.location.href = redirect;
    }
  }

  async function handleGoogle() {
    setLoadingGoogle(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setLoadingGoogle(false);
      setError("Erro ao conectar com Google. Tente novamente.");
    }
  }

  return (
    <>
      <div className="text-center mb-8">
        <p className="label-eyebrow mb-4">Área familiar</p>
        <h1
          className="font-serif text-moss mb-3"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontStyle: "italic" }}
        >
          Bem-vindo de volta
        </h1>
      </div>

      {urlError === "link_expirado" && (
        <div
          className="p-4 rounded-xl text-sm leading-relaxed mb-6"
          style={{ background: "#FFF5F0", border: "1px solid #FFD5C2", color: "#8B3A1A" }}
          role="alert"
        >
          Seu link de acesso expirou ou já foi usado. Faça login abaixo.
        </div>
      )}

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loadingGoogle || loading}
        className="w-full flex items-center justify-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all"
        style={{
          border: "1.5px solid var(--sand)",
          background: "white",
          color: "var(--bark)",
          opacity: loadingGoogle || loading ? 0.6 : 1,
        }}
      >
        {!loadingGoogle ? (
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        ) : (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {loadingGoogle ? "Conectando…" : "Entrar com Google"}
      </button>

      {/* Divisor */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: "var(--sand)" }} />
        <span className="text-xs text-bark opacity-50">ou</span>
        <div className="flex-1 h-px" style={{ background: "var(--sand)" }} />
      </div>

      {/* Email + senha */}
      <form onSubmit={handleEmailPassword} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-bark mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com.br"
            required
            className="field-input"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-bark mb-2 font-medium">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="field-input"
            autoComplete="current-password"
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
          disabled={loading || loadingGoogle || !email.trim() || !password}
          className="btn-primary w-full justify-center mt-2"
          style={{ opacity: loading || loadingGoogle || !email.trim() || !password ? 0.6 : 1 }}
        >
          {loading ? "Entrando…" : "Entrar"}
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
      <a
        href="/"
        className="font-serif text-moss text-sm tracking-widest uppercase mb-12 opacity-60 hover:opacity-100 transition-opacity"
        style={{ letterSpacing: "0.18em" }}
      >
        Família Palitot
      </a>

      <div
        className="w-full max-w-sm rounded-3xl p-8 sm:p-10"
        style={{ background: "white", border: "1px solid var(--sand)" }}
      >
        <Suspense fallback={<div className="text-center text-bark">Carregando…</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="text-xs text-bark opacity-40 mt-8 text-center max-w-xs leading-relaxed">
        Site privado da família Palitot. Acesso somente para membros cadastrados.
      </p>
    </div>
  );
}
