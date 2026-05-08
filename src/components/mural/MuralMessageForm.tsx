"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function MuralMessageForm() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Você precisa estar logado para enviar uma mensagem.");
      setLoading(false);
      return;
    }

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
