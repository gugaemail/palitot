import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import { createServerClientInstance } from "@/lib/supabase";
import type { Profile } from "@/types";
import MembrosClient from "./MembrosClient";

export const metadata: Metadata = { title: "Membros · Painel" };

async function getAllProfiles(): Promise<Profile[]> {
  const supabase = await createServerClientInstance();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
  return (data as Profile[]) || [];
}

export default async function MembrosPage() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") redirect("/memoria");

  const membros = await getAllProfiles();

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
          Membros
        </span>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="label-eyebrow mb-3">Família</p>
          <h1 className="font-serif" style={{ color: "var(--moss)", fontStyle: "italic" }}>
            Membros
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--bark)" }}>
            {membros.length} {membros.length === 1 ? "pessoa cadastrada" : "pessoas cadastradas"}.
            Para convidar novos membros, crie usuários no Supabase Dashboard → Authentication → Users.
          </p>
        </div>

        <MembrosClient membros={membros} currentUserId={profile.id} />
      </div>
    </div>
  );
}
