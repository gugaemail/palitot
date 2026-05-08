// =============================================================
// PALITOT · Tipos TypeScript
// Espelha as tabelas do Supabase
// =============================================================

export type UserRole = "admin" | "member";

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface Memory {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  happened_at: string; // ISO date string
  location: string | null;
  author_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joins
  author?: Profile;
  photos?: MemoryPhoto[];
  comments?: Comment[];
  _count?: { comments: number };
}

export interface MemoryPhoto {
  id: string;
  memory_id: string;
  url: string;
  caption: string | null;
  order_index: number;
  created_at: string;
}

export interface Comment {
  id: string;
  memory_id: string;
  author_id: string;
  content: string;
  created_at: string;
  // Joins
  author?: Profile;
}

export interface MuralMessage {
  id: string;
  author_id: string;
  content: string;
  is_featured: boolean;
  created_at: string;
  // Joins
  author?: Profile;
}

// =============================================================
// Tipos auxiliares para formulários e API
// =============================================================

export type NewMemory = Pick<
  Memory,
  "title" | "content" | "excerpt" | "happened_at" | "location" | "cover_url"
>;

export type NewComment = Pick<Comment, "memory_id" | "content">;

export type NewMuralMessage = Pick<MuralMessage, "content">;

// =============================================================
// Tipos do Supabase (Database)
// Estrutura compatível com @supabase/supabase-js v2
// =============================================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; name: string; role: string; avatar_url: string | null; bio: string | null; created_at: string; updated_at: string };
        Insert: { id: string; name: string; role?: string; avatar_url?: string | null; bio?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; name?: string; role?: string; avatar_url?: string | null; bio?: string | null; updated_at?: string };
        Relationships: [];
      };
      memories: {
        Row: { id: string; slug: string; title: string; content: string; excerpt: string | null; cover_url: string | null; happened_at: string; location: string | null; author_id: string | null; is_published: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; slug: string; title: string; content: string; excerpt?: string | null; cover_url?: string | null; happened_at: string; location?: string | null; author_id?: string | null; is_published?: boolean; created_at?: string; updated_at?: string };
        Update: { id?: string; slug?: string; title?: string; content?: string; excerpt?: string | null; cover_url?: string | null; happened_at?: string; location?: string | null; author_id?: string | null; is_published?: boolean; updated_at?: string };
        Relationships: [];
      };
      memory_photos: {
        Row: { id: string; memory_id: string; url: string; caption: string | null; order_index: number; created_at: string };
        Insert: { id?: string; memory_id: string; url: string; caption?: string | null; order_index?: number; created_at?: string };
        Update: { id?: string; memory_id?: string; url?: string; caption?: string | null; order_index?: number };
        Relationships: [];
      };
      comments: {
        Row: { id: string; memory_id: string; author_id: string; content: string; created_at: string };
        Insert: { id?: string; memory_id: string; author_id: string; content: string; created_at?: string };
        Update: { id?: string; memory_id?: string; author_id?: string; content?: string };
        Relationships: [];
      };
      mural_messages: {
        Row: { id: string; author_id: string; content: string; is_featured: boolean; created_at: string };
        Insert: { id?: string; author_id: string; content: string; is_featured?: boolean; created_at?: string };
        Update: { id?: string; author_id?: string; content?: string; is_featured?: boolean };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
