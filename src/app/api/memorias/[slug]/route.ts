import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase";
import { generateSlug } from "@/lib/utils";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClientInstance>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createServerClientInstance();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { slug } = await params;
  const body = await request.json();
  const { title, content, excerpt, happened_at, location, cover_url, is_published } = body;

  const updates: Record<string, unknown> = {};
  if (title !== undefined) { updates.title = title.trim(); updates.slug = generateSlug(title); }
  if (content !== undefined) updates.content = content.trim();
  if (excerpt !== undefined) updates.excerpt = excerpt?.trim() || null;
  if (happened_at !== undefined) updates.happened_at = happened_at;
  if (location !== undefined) updates.location = location?.trim() || null;
  if (cover_url !== undefined) updates.cover_url = cover_url?.trim() || null;
  if (is_published !== undefined) updates.is_published = is_published;

  const { data, error } = await supabase
    .from("memories")
    .update(updates)
    .eq("slug", slug)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Memória não encontrada" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createServerClientInstance();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { slug } = await params;
  const { error } = await supabase.from("memories").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
