"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";
import { getInitial } from "@/lib/utils";
import { formatRelativeDate } from "@/lib/utils";

interface Props {
  membros: Profile[];
  currentUserId: string;
}

export default function MembrosClient({ membros, currentUserId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function toggleRole(membro: Profile) {
    if (membro.id === currentUserId) return;
    setError("");
    setLoading(membro.id);
    const newRole = membro.role === "admin" ? "member" : "admin";

    try {
      const res = await fetch(`/api/membros/${membro.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error ?? "Erro ao alterar permissão"); return; }
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm mb-2"
          style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
        >
          {error}
        </div>
      )}

      {membros.map((membro) => {
        const isMe = membro.id === currentUserId;
        const isLoading = loading === membro.id;

        return (
          <div
            key={membro.id}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "white", border: "1px solid var(--sand)" }}
          >
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-medium text-sm"
              style={{ background: "var(--ivory-warm)", color: "var(--moss)" }}
            >
              {membro.avatar_url
                ? <img src={membro.avatar_url} alt={membro.name} className="w-10 h-10 rounded-full object-cover" />
                : getInitial(membro.name)
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--bark-dark)" }}>
                {membro.name}
                {isMe && (
                  <span className="ml-2 text-xs" style={{ color: "var(--bark)", opacity: 0.6 }}>
                    (você)
                  </span>
                )}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--bark)", opacity: 0.6 }}>
                Desde {formatRelativeDate(membro.created_at)}
              </p>
            </div>

            {/* Role badge + toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={
                  membro.role === "admin"
                    ? { background: "var(--moss)", color: "var(--ivory)" }
                    : { background: "var(--ivory-warm)", color: "var(--bark)" }
                }
              >
                {membro.role === "admin" ? "Admin" : "Membro"}
              </span>

              {!isMe && (
                <button
                  onClick={() => toggleRole(membro)}
                  disabled={isLoading || loading !== null}
                  className="text-xs px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    background: "var(--ivory-warm)",
                    color: "var(--bark-dark)",
                    border: "1px solid var(--sand)",
                    opacity: loading !== null && !isLoading ? 0.5 : 1,
                  }}
                >
                  {isLoading
                    ? "…"
                    : membro.role === "admin"
                    ? "Tornar membro"
                    : "Tornar admin"}
                </button>
              )}
            </div>
          </div>
        );
      })}

      <div
        className="mt-6 p-4 rounded-xl text-sm"
        style={{ background: "var(--ivory-warm)", border: "1px solid var(--sand)", color: "var(--bark)" }}
      >
        <strong style={{ color: "var(--bark-dark)" }}>Para adicionar novos membros:</strong>
        {" "}acesse o Supabase Dashboard → Authentication → Users → Invite user e informe o e-mail da pessoa.
        Ela receberá um link para criar a senha.
      </div>
    </div>
  );
}
