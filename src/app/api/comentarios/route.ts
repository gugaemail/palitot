import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const supabase = await createServerClientInstance();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json();
  const { memory_id, content } = body;

  if (!memory_id || !content?.trim()) {
    return NextResponse.json({ error: "memory_id e content são obrigatórios" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ memory_id, content: content.trim(), author_id: user.id })
    .select("*, author:profiles(id, name, avatar_url)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
