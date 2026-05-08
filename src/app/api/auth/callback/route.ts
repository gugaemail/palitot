import { createServerClientInstance } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/memoria";

  if (code) {
    const supabase = await createServerClientInstance();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`);
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  } else {
    console.error("[auth/callback] no code param in request:", request.url);
  }

  // Erro — redireciona de volta para login com mensagem
  return NextResponse.redirect(
    `${origin}/entrar?error=link_expirado`
  );
}
