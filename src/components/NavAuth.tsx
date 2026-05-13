"use client";

import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface NavAuthProps {
  user: { email?: string | null } | null;
}

export default function NavAuth({ user }: NavAuthProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Link href="/entrar" className="btn-secondary text-xs px-4 py-2">
        Entrar
      </Link>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-bark hover:text-moss transition-colors"
    >
      Sair
    </button>
  );
}
