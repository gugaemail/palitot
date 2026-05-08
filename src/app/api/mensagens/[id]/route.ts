import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerClientInstance>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClientInstance();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await params;
  const { is_featured } = await request.json();

  const { data, error } = await supabase
    .from("mural_messages")
    .update({ is_featured })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClientInstance();
  const user = await requireAdmin(supabase);
  if (!user) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await params;
  const { error } = await supabase.from("mural_messages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
