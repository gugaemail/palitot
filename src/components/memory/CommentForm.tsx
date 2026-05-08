"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface Props {
  memoryId: string;
  slug: string;
}

export default function CommentForm({ memoryId, slug }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
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

  if (user === null) {
    return (
      <div className="py-4 text-center">
        <p className="text-bark text-sm mb-3">
          Entre para deixar um comentário nesta memória.
        </p>
        <Link
          href={`/entrar?redirect=/memoria/${slug}`}
          className="btn-primary text-sm inline-flex items-center gap-2"
        >
          Entrar para comentar
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    );
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
