import type { Metadata } from "next";
import Link from "next/link";
import { getMemories, getFeaturedMessages } from "@/lib/queries";
import { formatMemoryDate } from "@/lib/utils";
import { createServerClientInstance } from "@/lib/supabase";
import NavAuth from "@/components/NavAuth";

export const metadata: Metadata = {
  title: "Família Palitot · Para nossa mãe",
};

export default async function HomePage() {
  const [memories, featuredMessages, supabase] = await Promise.all([
    getMemories(),
    getFeaturedMessages(),
    createServerClientInstance(),
  ]);
  const { data: { user } } = await supabase.auth.getUser();

  const previewMemories = memories.slice(0, 3);

  return (
    <main>
      {/* ── Header ─────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-ivory/90 backdrop-blur-sm border-b border-sand">
        <span
          className="font-serif text-moss text-sm tracking-widest uppercase"
          style={{ letterSpacing: "0.18em" }}
        >
          Família Palitot
        </span>
        <NavAuth user={user} />
      </header>

      {/* ── Hero ───────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20"
        style={{ background: "linear-gradient(160deg, #F7F3ED 0%, #F2E8DC 50%, #E8DDD0 100%)" }}
      >
        {/* Decoração sutil */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #C9956A22 0%, transparent 60%),
                             radial-gradient(circle at 80% 20%, #2D4A2D11 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-2xl mx-auto animate-fade-up">
          <p className="label-eyebrow mb-6">Dia das Mães · 2026</p>

          <h1
            className="font-serif text-moss mb-6"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              lineHeight: 1.1,
              fontStyle: "italic",
            }}
          >
            Para a mulher que é
            <br />
            <span style={{ color: "var(--terra)" }}>o coração</span> da
            <br />
            nossa família
          </h1>

          <p className="font-sans text-bark text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Reunimos aqui nossas memórias mais queridas, os momentos que moldaram quem somos, e o amor que transborda em palavras para você.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/memoria" className="btn-primary">
              Ver nossas memórias
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/mural" className="btn-secondary">
              Mural de mensagens
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <p className="label-eyebrow" style={{ fontSize: "0.65rem" }}>role para ver</p>
          <div
            style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(to bottom, var(--terra), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── Preview Timeline ───────────────────────── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="label-eyebrow mb-3">Nossas histórias</p>
          <h2 className="font-serif text-moss">Um jardim de memórias</h2>
          <div className="divider-organic mx-auto mt-4" />
        </div>

        <div className="space-y-0">
          {previewMemories.map((memory, index) => (
            <div
              key={memory.id}
              className="relative flex gap-6 pb-12"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Linha da timeline */}
              <div className="flex flex-col items-center">
                <div className="timeline-dot mt-1" />
                {index < previewMemories.length - 1 && (
                  <div
                    className="flex-1 w-px mt-3"
                    style={{ background: "var(--sand)" }}
                  />
                )}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pb-4">
                <p className="label-eyebrow mb-2">
                  {formatMemoryDate(memory.happened_at)}
                </p>
                <h3 className="font-serif text-moss text-xl mb-2">
                  {memory.title}
                </h3>
                {memory.excerpt && (
                  <p className="text-bark text-sm leading-relaxed line-clamp-3">
                    {memory.excerpt}
                  </p>
                )}
                <p className="text-xs text-bark mt-3 opacity-60">
                  por {memory.author?.name ?? "Família Palitot"}
                </p>
              </div>

              {/* Thumb */}
              {memory.cover_url && (
                <div
                  className="hidden sm:block w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0"
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
          ))}
        </div>

        <div className="text-center mt-4">
          <Link href="/memoria" className="btn-secondary">
            Ver todas as memórias
          </Link>
        </div>
      </section>

      {/* ── Mural Preview ──────────────────────────── */}
      {featuredMessages.length > 0 && (
        <section
          className="px-6 py-20"
          style={{ background: "var(--ivory-warm)" }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="label-eyebrow mb-3">Da nossa família para você</p>
              <h2 className="font-serif text-moss">Com todo nosso amor</h2>
              <div className="divider-organic mx-auto mt-4" />
            </div>

            <div className="space-y-6">
              {featuredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="relative p-7 rounded-2xl"
                  style={{ background: "white", border: "1px solid var(--sand)" }}
                >
                  <p
                    className="font-serif text-bark-dark text-lg leading-relaxed mb-4"
                    style={{ fontStyle: "italic" }}
                  >
                    "{msg.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                      style={{ background: "var(--moss)", color: "var(--ivory)" }}
                    >
                      {msg.author?.name?.charAt(0) ?? "?"}
                    </div>
                    <span className="text-sm text-bark">
                      {msg.author?.name ?? "Família"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/mural" className="btn-primary">
                Deixar minha mensagem
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ─────────────────────────────────── */}
      <footer
        className="text-center py-12 px-6"
        style={{ background: "var(--moss)", color: "var(--ivory-warm)" }}
      >
        <p className="font-serif text-xl mb-2" style={{ fontStyle: "italic", opacity: 0.9 }}>
          Família Palitot
        </p>
        <p className="text-xs opacity-50 tracking-widest uppercase" style={{ letterSpacing: "0.14em" }}>
          Feito com amor · 2026
        </p>
      </footer>
    </main>
  );
}
