import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase";
import { generateSlug } from "@/lib/utils";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClientInstance>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClientInstance();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await request.json();
  const { title, content, excerpt, happened_at, location, cover_url, is_published } = body;

  if (!title?.trim() || !content?.trim() || !happened_at) {
    return NextResponse.json({ error: "Título, conteúdo e data são obrigatórios" }, { status: 400 });
  }

  // Garante slug único
  const baseSlug = generateSlug(title);
  let slug = baseSlug;
  for (let i = 1; i < 10; i++) {
    const { data: existing } = await supabase.from("memories").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${i}`;
  }

  const { data, error } = await supabase
    .from("memories")
    .insert({
      slug,
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim() || null,
      happened_at,
      location: location?.trim() || null,
      cover_url: cover_url?.trim() || null,
      author_id: user.id,
      is_published: is_published ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
