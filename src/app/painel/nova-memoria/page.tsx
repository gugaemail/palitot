import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import MemoryForm from "@/components/admin/MemoryForm";

export const metadata: Metadata = { title: "Nova memória · Painel" };

export default async function NovaMemoriaPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/memoria");

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)" }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm"
        style={{ background: "rgba(247,243,237,0.92)", borderBottom: "1px solid var(--sand)" }}
      >
        <Link
          href="/painel"
          className="flex items-center gap-2 text-sm transition-colors"
          style={{ color: "var(--bark)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Painel
        </Link>
        <span
          className="font-serif text-xs tracking-widest uppercase opacity-60"
          style={{ letterSpacing: "0.16em", color: "var(--moss)" }}
        >
          Nova memória
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="label-eyebrow mb-3">Criar</p>
          <h1 className="font-serif" style={{ color: "var(--moss)", fontStyle: "italic" }}>
            Nova memória
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--bark)" }}>
            Adicione uma nova lembrança para a família.
          </p>
        </div>

        <MemoryForm />
      </div>
    </div>
  );
}
