// =============================================================
// PALITOT · Queries do banco
// Funções centralizadas para buscar dados
// =============================================================

import { createServerClientInstance } from "./supabase";
import type { Memory, Comment, MuralMessage, Profile } from "@/types";

// =============================================================
// MEMÓRIAS
// =============================================================

export async function getMemories(): Promise<Memory[]> {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("memories")
    .select(`
      *,
      author:profiles(id, name, avatar_url)
    `)
    .eq("is_published", true)
    .order("happened_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar memórias:", error);
    return [];
  }

  return data as Memory[];
}

export async function getMemoryBySlug(slug: string): Promise<Memory | null> {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("memories")
    .select(`
      *,
      author:profiles(id, name, avatar_url),
      photos:memory_photos(id, url, caption, order_index),
      comments(
        id,
        content,
        created_at,
        author:profiles(id, name, avatar_url)
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) return null;
  return data as Memory;
}

export async function getAdjacentMemories(currentDate: string) {
  const supabase = await createServerClientInstance();

  const [prevResult, nextResult] = await Promise.all([
    supabase
      .from("memories")
      .select("slug, title, cover_url, happened_at")
      .eq("is_published", true)
      .lt("happened_at", currentDate)
      .order("happened_at", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("memories")
      .select("slug, title, cover_url, happened_at")
      .eq("is_published", true)
      .gt("happened_at", currentDate)
      .order("happened_at", { ascending: true })
      .limit(1)
      .single(),
  ]);

  return {
    prev: prevResult.data as Partial<Memory> | null,
    next: nextResult.data as Partial<Memory> | null,
  };
}

export async function getAllMemoriesForAdmin(): Promise<Memory[]> {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("memories")
    .select(`*, author:profiles(id, name, avatar_url)`)
    .order("happened_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar memórias (admin):", error);
    return [];
  }

  return data as Memory[];
}

export async function getMemoryBySlugAdmin(slug: string): Promise<Memory | null> {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("memories")
    .select(`*, author:profiles(id, name, avatar_url), photos:memory_photos(id, url, caption, order_index)`)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Memory;
}

// =============================================================
// MURAL
// =============================================================

export async function getMuralMessages(): Promise<MuralMessage[]> {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("mural_messages")
    .select(`
      *,
      author:profiles(id, name, avatar_url)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar mensagens do mural:", error);
    return [];
  }

  return data as MuralMessage[];
}

export async function getFeaturedMessages(): Promise<MuralMessage[]> {
  const supabase = await createServerClientInstance();

  const { data } = await supabase
    .from("mural_messages")
    .select(`*, author:profiles(id, name, avatar_url)`)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (data as MuralMessage[]) || [];
}

// =============================================================
// PERFIL
// =============================================================

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createServerClientInstance();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data as Profile | null;
}
