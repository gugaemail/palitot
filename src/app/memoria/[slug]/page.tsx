import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemoryBySlug, getAdjacentMemories } from "@/lib/queries";
import { formatMemoryDate, formatRelativeDate } from "@/lib/utils";
import CommentForm from "@/components/memory/CommentForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const memory = await getMemoryBySlug(slug);
  if (!memory) return {};
  return {
    title: memory.title,
    description: memory.excerpt ?? undefined,
  };
}

export default async function MemoriaPage({ params }: Props) {
  const { slug } = await params;
  const memory = await getMemoryBySlug(slug);
  if (!memory) notFound();

  const { prev, next } = await getAdjacentMemories(memory.happened_at);

  const paragraphs = memory.content
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

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
          Todas as memórias
        </Link>
        <span
          className="font-serif text-moss text-xs tracking-widest uppercase opacity-60"
          style={{ letterSpacing: "0.16em" }}
        >
          Família Palitot
        </span>
      </header>

      <article className="max-w-2xl mx-auto px-6 py-12">
        {/* Foto capa */}
        {memory.cover_url && (
          <div
            className="relative w-full rounded-3xl overflow-hidden mb-10"
            style={{ aspectRatio: "16/9", border: "2px solid var(--sand)" }}
          >
            <img
              src={memory.cover_url}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Cabeçalho da memória */}
        <header className="mb-10">
          <p className="label-eyebrow mb-3">
            {formatMemoryDate(memory.happened_at)}
            {memory.location && (
              <span className="opacity-60"> · {memory.location}</span>
            )}
          </p>
          <h1
            className="font-serif text-moss mb-4"
            style={{ fontStyle: "italic", lineHeight: 1.2 }}
          >
            {memory.title}
          </h1>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
              style={{ background: "var(--moss)", color: "var(--ivory)" }}
            >
              {memory.author?.name?.charAt(0) ?? "P"}
            </div>
            <span className="text-sm text-bark">
              Escrita por{" "}
              <strong className="text-moss font-medium">
                {memory.author?.name ?? "Família Palitot"}
              </strong>
            </span>
          </div>
          <div className="divider-organic mt-6" />
        </header>

        {/* Conteúdo */}
        <div className="prose-memory mb-12">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Galeria secundária */}
        {memory.photos && memory.photos.length > 0 && (
          <section className="mb-12">
            <p className="label-eyebrow mb-4">Mais fotos</p>
            <div className="grid grid-cols-2 gap-3">
              {memory.photos
                .sort((a, b) => a.order_index - b.order_index)
                .map((photo) => (
                  <div
                    key={photo.id}
                    className="relative rounded-2xl overflow-hidden"
                    style={{ aspectRatio: "4/3", border: "1.5px solid var(--sand)" }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption ?? ""}
                      className="w-full h-full object-cover"
                    />
                    {photo.caption && (
                      <div
                        className="absolute bottom-0 left-0 right-0 p-2 text-xs"
                        style={{
                          background: "linear-gradient(to top, rgba(45,74,45,0.7), transparent)",
                          color: "var(--ivory)",
                        }}
                      >
                        {photo.caption}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "1px solid var(--sand)", margin: "2rem 0" }} />

        {/* Comentários */}
        <section id="comentarios">
          <p className="label-eyebrow mb-6">
            {memory.comments?.length ?? 0} comentário
            {(memory.comments?.length ?? 0) !== 1 ? "s" : ""} da família
          </p>

          {memory.comments && memory.comments.length > 0 && (
            <div className="space-y-5 mb-8">
              {memory.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5"
                    style={{ background: "var(--ivory-warm)", color: "var(--moss)", border: "1.5px solid var(--sand)" }}
                  >
                    {comment.author?.name?.charAt(0) ?? "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-medium text-moss">
                        {comment.author?.name ?? "Família"}
                      </span>
                      <span className="text-xs text-bark opacity-50">
                        {formatRelativeDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-bark-dark leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <CommentForm memoryId={memory.id} />
        </section>

        {/* Navegação prev/next */}
        {(prev || next) && (
          <>
            <hr style={{ border: "none", borderTop: "1px solid var(--sand)", margin: "2.5rem 0" }} />
            <nav className="flex justify-between gap-4">
              {prev ? (
                <Link
                  href={`/memoria/${prev.slug}`}
                  className="flex-1 group"
                >
                  <div
                    className="p-4 rounded-2xl transition-colors"
                    style={{ background: "var(--ivory-warm)", border: "1px solid var(--sand)" }}
                  >
                    <p className="label-eyebrow mb-1 flex items-center gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Anterior
                    </p>
                    <p className="font-serif text-moss text-sm leading-tight group-hover:text-terra transition-colors">
                      {prev.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {next ? (
                <Link
                  href={`/memoria/${next.slug}`}
                  className="flex-1 group text-right"
                >
                  <div
                    className="p-4 rounded-2xl transition-colors"
                    style={{ background: "var(--ivory-warm)", border: "1px solid var(--sand)" }}
                  >
                    <p className="label-eyebrow mb-1 flex items-center justify-end gap-1.5">
                      Próxima
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </p>
                    <p className="font-serif text-moss text-sm leading-tight group-hover:text-terra transition-colors">
                      {next.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </nav>
          </>
        )}
      </article>
    </div>
  );
}
