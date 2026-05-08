import type { Metadata } from "next";
import Link from "next/link";
import { getMemories } from "@/lib/queries";
import { formatMemoryDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Memórias",
};

export default async function MemoriasPage() {
  const memories = await getMemories();

  // Agrupa por década para contexto visual
  const byDecade = memories.reduce<Record<string, typeof memories>>(
    (acc, memory) => {
      const decade = Math.floor(parseInt(memory.happened_at.split("-")[0]) / 10) * 10;
      const key = `${decade}s`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(memory);
      return acc;
    },
    {}
  );

  const decades = Object.keys(byDecade).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm"
        style={{ background: "rgba(247,243,237,0.92)", borderBottom: "1px solid var(--sand)" }}
      >
        <Link
          href="/"
          className="font-serif text-moss text-sm tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity"
          style={{ letterSpacing: "0.16em" }}
        >
          Família Palitot
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/memoria" className="text-sm text-moss font-medium">
            Memórias
          </Link>
          <Link href="/mural" className="text-sm text-bark hover:text-moss transition-colors">
            Mural
          </Link>
          <Link href="/painel" className="text-sm text-bark hover:text-moss transition-colors">
            Painel
          </Link>
        </nav>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero da seção */}
        <div className="mb-16">
          <p className="label-eyebrow mb-4">Nossas histórias</p>
          <h1
            className="font-serif text-moss mb-4"
            style={{ fontStyle: "italic" }}
          >
            Um jardim de memórias
          </h1>
          <p className="text-bark max-w-md leading-relaxed">
            Cada lembrança aqui foi escrita com carinho por alguém da família.
            São os momentos que nos fazem quem somos.
          </p>
          <div className="divider-organic mt-6" />
        </div>

        {/* Timeline por década */}
        {memories.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-moss text-xl mb-3" style={{ fontStyle: "italic" }}>
              Nenhuma memória ainda
            </p>
            <p className="text-bark text-sm">
              As primeiras lembranças aparecerão aqui assim que forem publicadas.
            </p>
          </div>
        ) : (
          decades.map((decade) => (
            <div key={decade} className="mb-16">
              {/* Label da década */}
              <div className="flex items-center gap-4 mb-8">
                <span className="label-eyebrow text-lg" style={{ fontSize: "0.7rem" }}>
                  Década de {decade}
                </span>
                <div className="flex-1 h-px" style={{ background: "var(--sand)" }} />
              </div>

              {/* Memórias da década */}
              <div className="space-y-0">
                {byDecade[decade].map((memory, index) => (
                  <Link
                    key={memory.id}
                    href={`/memoria/${memory.slug}`}
                    className="group relative flex gap-6 pb-10 hover:no-underline"
                  >
                    {/* Timeline visual */}
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                        style={{
                          background: "var(--terra)",
                          border: "2px solid var(--ivory)",
                          outline: "2px solid var(--terra)",
                        }}
                      />
                      {index < byDecade[decade].length - 1 && (
                        <div
                          className="flex-1 w-px mt-2"
                          style={{ background: "var(--sand)" }}
                        />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 flex gap-4 items-start">
                      <div className="flex-1 min-w-0">
                        <p className="label-eyebrow mb-1.5">
                          {formatMemoryDate(memory.happened_at)}
                          {memory.location && (
                            <span className="opacity-60"> · {memory.location}</span>
                          )}
                        </p>
                        <h2
                          className="font-serif text-moss text-xl mb-2 group-hover:text-terra transition-colors"
                          style={{ lineHeight: 1.3 }}
                        >
                          {memory.title}
                        </h2>
                        {memory.excerpt && (
                          <p className="text-bark text-sm leading-relaxed line-clamp-2">
                            {memory.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs text-bark opacity-60">
                            por {memory.author?.name ?? "Família Palitot"}
                          </span>
                          <span
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-terra flex items-center gap-1"
                          >
                            Ler memória
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2 6h8M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* Capa */}
                      {memory.cover_url && (
                        <div
                          className="hidden sm:block w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-transform group-hover:scale-105"
                          style={{ border: "2px solid var(--sand)" }}
                        >
                          <img
                            src={memory.cover_url}
                            alt={memory.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
