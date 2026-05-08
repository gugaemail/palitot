"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Memory } from "@/types";

interface MemoryFormProps {
  memory?: Memory;
}

export default function MemoryForm({ memory }: MemoryFormProps) {
  const router = useRouter();
  const isEditing = !!memory;

  const [form, setForm] = useState({
    title: memory?.title ?? "",
    excerpt: memory?.excerpt ?? "",
    content: memory?.content ?? "",
    happened_at: memory?.happened_at ?? "",
    location: memory?.location ?? "",
    cover_url: memory?.cover_url ?? "",
    is_published: memory?.is_published ?? false,
  });

  const [loading, setLoading] = useState<"draft" | "publish" | "delete" | null>(null);
  const [error, setError] = useState("");

  function set(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(publishOverride?: boolean) {
    setError("");
    const isPublish = publishOverride ?? form.is_published;
    setLoading(isPublish ? "publish" : "draft");

    try {
      const body = { ...form, is_published: isPublish };
      const res = isEditing
        ? await fetch(`/api/memorias/${memory!.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        : await fetch("/api/memorias", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Erro ao salvar"); return; }

      router.push("/painel");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que quer deletar esta memória? Essa ação não pode ser desfeita.")) return;
    setLoading("delete");

    try {
      const res = await fetch(`/api/memorias/${memory!.slug}`, { method: "DELETE" });
      if (!res.ok) { const j = await res.json(); setError(j.error ?? "Erro ao deletar"); return; }
      router.push("/painel");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  const disabled = loading !== null;

  return (
    <div className="space-y-6">
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
        >
          {error}
        </div>
      )}

      {/* Título */}
      <div>
        <label className="label-eyebrow block mb-2">Título *</label>
        <input
          type="text"
          className="field-input"
          placeholder="Uma tarde no sítio da vovó…"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          disabled={disabled}
        />
      </div>

      {/* Data e Local */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-eyebrow block mb-2">Data da memória *</label>
          <input
            type="date"
            className="field-input"
            value={form.happened_at}
            onChange={(e) => set("happened_at", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="label-eyebrow block mb-2">Local</label>
          <input
            type="text"
            className="field-input"
            placeholder="Sítio das Flores, MG"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Resumo */}
      <div>
        <label className="label-eyebrow block mb-2">Resumo</label>
        <textarea
          className="field-input resize-none"
          rows={2}
          placeholder="Uma frase curta para o preview da memória…"
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          disabled={disabled}
        />
        <p className="text-xs mt-1" style={{ color: "var(--bark)", opacity: 0.6 }}>
          Aparece na lista de memórias. Deixe em branco para usar o início do texto.
        </p>
      </div>

      {/* Conteúdo */}
      <div>
        <label className="label-eyebrow block mb-2">Texto da memória *</label>
        <textarea
          className="field-input resize-none"
          rows={12}
          placeholder="Escreva a história com todos os detalhes que quiser…"
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          disabled={disabled}
        />
        <p className="text-xs mt-1" style={{ color: "var(--bark)", opacity: 0.6 }}>
          Cada parágrafo separado por linha em branco será exibido individualmente.
        </p>
      </div>

      {/* Foto de capa */}
      <div>
        <label className="label-eyebrow block mb-2">URL da foto de capa</label>
        <input
          type="url"
          className="field-input"
          placeholder="https://…"
          value={form.cover_url}
          onChange={(e) => set("cover_url", e.target.value)}
          disabled={disabled}
        />
        <p className="text-xs mt-1" style={{ color: "var(--bark)", opacity: 0.6 }}>
          Cole uma URL pública de imagem. Upload via Supabase Storage em breve.
        </p>
      </div>

      {/* Publicada toggle */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ background: "var(--ivory-warm)", border: "1px solid var(--sand)" }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--bark-dark)" }}>Publicar memória</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--bark)", opacity: 0.7 }}>
            Memórias não publicadas ficam como rascunho e só o admin vê.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.is_published}
          onClick={() => set("is_published", !form.is_published)}
          disabled={disabled}
          className="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
          style={{ background: form.is_published ? "var(--moss)" : "var(--sand)" }}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: form.is_published ? "translateX(20px)" : "translateX(0)" }}
          />
        </button>
      </div>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={disabled}
          className="btn-secondary flex-1 justify-center"
        >
          {loading === "draft" ? "Salvando…" : "Salvar rascunho"}
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={disabled}
          className="btn-primary flex-1 justify-center"
        >
          {loading === "publish" ? "Publicando…" : "Publicar"}
        </button>
      </div>

      {/* Deletar (apenas no modo edição) */}
      {isEditing && (
        <div className="pt-4" style={{ borderTop: "1px solid var(--sand)" }}>
          <button
            type="button"
            onClick={handleDelete}
            disabled={disabled}
            className="text-sm transition-colors"
            style={{ color: "#DC2626" }}
          >
            {loading === "delete" ? "Deletando…" : "Deletar esta memória"}
          </button>
        </div>
      )}
    </div>
  );
}
