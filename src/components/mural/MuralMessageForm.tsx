"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export default function MuralMessageForm() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.from("mural_messages").insert({
      author_id: user.id,
      content: content.trim(),
    });

    setLoading(false);

    if (error) {
      setError("Não foi possível enviar sua mensagem. Tente novamente.");
    } else {
      setSent(true);
      setContent("");
      router.refresh();
    }
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <p className="font-serif text-moss text-lg mb-1" style={{ fontStyle: "italic" }}>
          Mensagem enviada com amor ✦
        </p>
        <p className="text-bark text-sm mb-4">
          Sua mensagem já aparece no mural.
        </p>
        <button
          className="text-sm text-terra underline underline-offset-4"
          onClick={() => setSent(false)}
        >
          Escrever outra mensagem
        </button>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="py-4 text-center">
        <p className="text-bark text-sm mb-3">
          Faça parte desta história e deixe sua mensagem.
        </p>
        <Link
          href="/entrar?redirect=/mural"
          className="btn-primary text-sm inline-flex items-center gap-2"
        >
          Entrar para enviar uma mensagem
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva sua mensagem com amor…"
        rows={4}
        className="field-input resize-none"
        style={{ minHeight: "110px" }}
        maxLength={1000}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-bark opacity-40">
          {content.length}/1000 caracteres
        </span>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="btn-primary text-sm"
          style={{ opacity: loading || !content.trim() ? 0.6 : 1 }}
        >
          {loading ? "Enviando…" : "Enviar mensagem"}
        </button>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "#8B3A1A" }} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
