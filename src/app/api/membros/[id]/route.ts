import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await params;
  const { role } = await request.json();

  if (!["admin", "member"].includes(role)) {
    return NextResponse.json({ error: "Role inválido" }, { status: 400 });
  }

  // Impede admin de rebaixar a si mesmo
  if (id === user.id && role === "member") {
    return NextResponse.json({ error: "Você não pode remover seu próprio acesso de admin" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
