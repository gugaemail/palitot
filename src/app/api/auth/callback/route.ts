import { createServerClientInstance } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/memoria";

  // Usa o domínio público configurado — request.url retorna o endereço interno (0.0.0.0)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${request.headers.get("host")}`;

  if (code) {
    const supabase = await createServerClientInstance();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${siteUrl}${redirect}`);
    }

    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  } else {
    console.error("[auth/callback] no code param in request:", request.url);
  }

  return NextResponse.redirect(`${siteUrl}/entrar?error=link_expirado`);
}
