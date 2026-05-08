"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface Props {
  memoryId: string;
}

export default function CommentForm({ memoryId }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
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
      setError("Você precisa estar logado para comentar.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("comments").insert({
      memory_id: memoryId,
      author_id: user.id,
      content: content.trim(),
    });

    setLoading(false);

    if (error) {
      setError("Não foi possível enviar o comentário. Tente novamente.");
    } else {
      setContent("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Deixe um comentário…"
        rows={3}
        className="field-input resize-none"
        style={{ minHeight: "88px" }}
      />

      {error && (
        <p className="text-sm" style={{ color: "#8B3A1A" }} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="btn-primary text-sm px-5 py-2.5"
        style={{ opacity: loading || !content.trim() ? 0.6 : 1 }}
      >
        {loading ? "Enviando…" : "Comentar"}
      </button>
    </form>
  );
}
