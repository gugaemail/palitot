import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentProfile, getAllMemoriesForAdmin } from "@/lib/queries";
import { redirect } from "next/navigation";
import { formatMemoryDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Painel familiar",
};

export default async function PainelPage() {
  const profile = await getCurrentProfile();

  // Apenas admins acessam o painel
  if (!profile || profile.role !== "admin") {
    redirect("/memoria");
  }

  const memories = await getAllMemoriesForAdmin();

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm"
        style={{ background: "rgba(247,243,237,0.92)", borderBottom: "1px solid var(--sand)" }}
      >
        <Link
          href="/memoria"
          className="flex items-center gap-2 text-sm text-bark hover:text-moss transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Voltar
        </Link>
        <span
          className="font-serif text-moss text-xs tracking-widest uppercase opacity-60"
          style={{ letterSpacing: "0.16em" }}
        >
          Painel familiar
        </span>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Boas-vindas */}
        <div className="mb-12">
          <p className="label-eyebrow mb-3">Administrador</p>
          <h1
            className="font-serif text-moss mb-2"
            style={{ fontStyle: "italic" }}
          >
            Olá, {profile.name.split(" ")[0]}
          </h1>
          <p className="text-bark text-sm">
            Gerencie as memórias e membros da família.
          </p>
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Memórias", value: memories.length },
            { label: "Publicadas", value: memories.filter((m) => m.is_published).length },
            { label: "Rascunhos", value: memories.filter((m) => !m.is_published).length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl text-center"
              style={{ background: "white", border: "1px solid var(--sand)" }}
            >
              <p className="font-serif text-moss text-3xl font-medium">{stat.value}</p>
              <p className="label-eyebrow mt-1" style={{ fontSize: "0.65rem" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Ações rápidas */}
        <section className="mb-10">
          <p className="label-eyebrow mb-4">Ações</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Link
              href="/painel/nova-memoria"
              className="flex items-center gap-4 p-5 rounded-2xl hover:no-underline group"
              style={{ background: "var(--moss)", color: "var(--ivory)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Nova memória</p>
                <p className="text-xs opacity-60 mt-0.5">Adicionar uma nova lembrança</p>
              </div>
            </Link>

            <Link
              href="/painel/membros"
              className="flex items-center gap-4 p-5 rounded-2xl hover:no-underline group"
              style={{ background: "white", border: "1px solid var(--sand)", color: "var(--bark-dark)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--ivory-warm)" }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM6 16v-1a4 4 0 018 0v1" stroke="var(--moss)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-moss">Membros</p>
                <p className="text-xs opacity-60 mt-0.5">Gerenciar acesso familiar</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Lista de memórias */}
        <section>
          <p className="label-eyebrow mb-5">Todas as memórias</p>
          <div className="space-y-3">
            {memories.length === 0 ? (
              <p className="text-bark text-sm py-8 text-center">
                Nenhuma memória ainda. Crie a primeira!
              </p>
            ) : (
              memories.map((memory) => (
                <Link
                  key={memory.id}
                  href={`/painel/editar/${memory.slug}`}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:no-underline group"
                  style={{ background: "white", border: "1px solid var(--sand)" }}
                >
                  {/* Status badge */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: memory.is_published ? "var(--moss)" : "var(--terra)" }}
                    title={memory.is_published ? "Publicada" : "Rascunho"}
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-moss text-sm truncate group-hover:text-terra transition-colors">
                      {memory.title}
                    </p>
                    <p className="text-xs text-bark opacity-60 mt-0.5">
                      {formatMemoryDate(memory.happened_at)}
                      {" · "}
                      {memory.is_published ? "Publicada" : "Rascunho"}
                    </p>
                  </div>

                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="text-bark opacity-30 group-hover:opacity-60 transition-opacity flex-shrink-0"
                    aria-hidden
                  >
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
