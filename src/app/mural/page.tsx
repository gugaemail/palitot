import type { Metadata } from "next";
import Link from "next/link";
import { getMuralMessages } from "@/lib/queries";
import MuralMessageForm from "@/components/mural/MuralMessageForm";
import { formatRelativeDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mural de mensagens",
};

export default async function MuralPage() {
  const messages = await getMuralMessages();

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
          Memórias
        </Link>
        <span
          className="font-serif text-moss text-xs tracking-widest uppercase opacity-60"
          style={{ letterSpacing: "0.16em" }}
        >
          Família Palitot
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="mb-14 text-center">
          <p className="label-eyebrow mb-4">Da família para você</p>
          <h1
            className="font-serif text-moss mb-4"
            style={{ fontStyle: "italic" }}
          >
            Mural de mensagens
          </h1>
          <p className="text-bark max-w-md mx-auto leading-relaxed">
            Cada mensagem aqui foi escrita com amor por alguém que te ama.
            Este mural é todo seu.
          </p>
          <div className="divider-organic mx-auto mt-6" />
        </div>

        {/* Formulário de nova mensagem */}
        <div
          className="p-6 sm:p-8 rounded-3xl mb-12"
          style={{ background: "var(--ivory-warm)", border: "1.5px solid var(--sand)" }}
        >
          <p className="label-eyebrow mb-4">Escrever para ela</p>
          <MuralMessageForm />
        </div>

        {/* Mensagens */}
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-moss text-xl mb-3" style={{ fontStyle: "italic" }}>
              Seja o primeiro a deixar uma mensagem
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg) => (
              <article
                key={msg.id}
                className="relative p-6 sm:p-8 rounded-3xl"
                style={{
                  background: "white",
                  border: `1.5px solid ${msg.is_featured ? "var(--terra)" : "var(--sand)"}`,
                }}
              >
                {msg.is_featured && (
                  <span
                    className="absolute -top-3 left-6 text-xs px-3 py-1 rounded-full"
                    style={{ background: "var(--terra)", color: "white", fontWeight: 500 }}
                  >
                    ✦ Destaque
                  </span>
                )}
                <p
                  className="font-serif text-bark-dark text-lg leading-relaxed mb-5"
                  style={{ fontStyle: "italic" }}
                >
                  "{msg.content}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{ background: "var(--moss)", color: "var(--ivory)" }}
                    >
                      {msg.author?.name?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-moss">
                        {msg.author?.name ?? "Família"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-bark opacity-50">
                    {formatRelativeDate(msg.created_at)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
