-- =============================================================
-- PALITOT · Schema do banco de dados
-- Supabase · PostgreSQL
-- =============================================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- busca textual futura

-- =============================================================
-- TABELA: profiles
-- Membros da família cadastrados
-- =============================================================
create table profiles (
  id          uuid references auth.users on delete cascade primary key,
  name        text not null,
  role        text not null default 'member' check (role in ('admin', 'member')),
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table profiles is 'Membros da família com acesso ao site';
comment on column profiles.role is 'admin = pode criar/editar memórias; member = pode comentar e enviar mensagens';

-- =============================================================
-- TABELA: memories
-- As lembranças da família
-- =============================================================
create table memories (
  id            uuid default uuid_generate_v4() primary key,
  slug          text unique not null,
  title         text not null,
  content       text not null,
  excerpt       text,                        -- resumo para preview
  cover_url     text,                        -- foto principal (Supabase Storage)
  happened_at   date not null,               -- data real da memória
  location      text,                        -- onde aconteceu (opcional)
  author_id     uuid references profiles(id) on delete set null,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table memories is 'Lembranças e histórias da família';

-- =============================================================
-- TABELA: memory_photos
-- Fotos adicionais de cada memória (além da capa)
-- =============================================================
create table memory_photos (
  id          uuid default uuid_generate_v4() primary key,
  memory_id   uuid references memories(id) on delete cascade not null,
  url         text not null,
  caption     text,
  order_index integer not null default 0,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- TABELA: comments
-- Comentários da família nas memórias
-- =============================================================
create table comments (
  id          uuid default uuid_generate_v4() primary key,
  memory_id   uuid references memories(id) on delete cascade not null,
  author_id   uuid references profiles(id) on delete cascade not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- TABELA: mural_messages
-- Mensagens do mural para a mãe
-- =============================================================
create table mural_messages (
  id          uuid default uuid_generate_v4() primary key,
  author_id   uuid references profiles(id) on delete cascade not null,
  content     text not null,
  is_featured boolean not null default false,   -- destaque na homepage
  created_at  timestamptz not null default now()
);

-- =============================================================
-- ÍNDICES para performance
-- =============================================================
create index memories_happened_at_idx   on memories(happened_at desc);
create index memories_slug_idx          on memories(slug);
create index memories_published_idx     on memories(is_published) where is_published = true;
create index comments_memory_id_idx     on comments(memory_id);
create index memory_photos_memory_idx   on memory_photos(memory_id, order_index);
create index mural_messages_created_idx on mural_messages(created_at desc);

-- =============================================================
-- FUNÇÃO: atualiza updated_at automaticamente
-- =============================================================
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger memories_updated_at
  before update on memories
  for each row execute procedure handle_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure handle_updated_at();

-- =============================================================
-- FUNÇÃO: cria profile automaticamente ao cadastrar usuário
-- =============================================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'member'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

alter table profiles        enable row level security;
alter table memories        enable row level security;
alter table memory_photos   enable row level security;
alter table comments        enable row level security;
alter table mural_messages  enable row level security;

-- PROFILES
-- Qualquer autenticado pode ler perfis
create policy "Perfis visíveis para autenticados"
  on profiles for select
  to authenticated
  using (true);

-- Usuário edita apenas o próprio perfil
create policy "Usuário edita próprio perfil"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- MEMORIES
-- Memórias publicadas visíveis para autenticados
create policy "Memórias publicadas visíveis"
  on memories for select
  to authenticated
  using (is_published = true);

-- Admin vê todas (incluindo rascunhos)
create policy "Admin vê todas as memórias"
  on memories for select
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Apenas admin cria/edita/deleta memórias
create policy "Admin gerencia memórias"
  on memories for all
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- MEMORY_PHOTOS
create policy "Fotos visíveis para autenticados"
  on memory_photos for select
  to authenticated
  using (
    exists (
      select 1 from memories m
      where m.id = memory_id and m.is_published = true
    )
  );

create policy "Admin gerencia fotos"
  on memory_photos for all
  to authenticated
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- COMMENTS
-- Qualquer autenticado lê e cria comentários
create policy "Comentários visíveis para autenticados"
  on comments for select
  to authenticated
  using (true);

create policy "Autenticados criam comentários"
  on comments for insert
  to authenticated
  with check (auth.uid() = author_id);

-- Autor deleta próprio comentário; admin deleta qualquer um
create policy "Autor ou admin deleta comentário"
  on comments for delete
  to authenticated
  using (
    auth.uid() = author_id
    or exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- MURAL MESSAGES
create policy "Mensagens visíveis para autenticados"
  on mural_messages for select
  to authenticated
  using (true);

create policy "Autenticados criam mensagens"
  on mural_messages for insert
  to authenticated
  with check (auth.uid() = author_id);

-- =============================================================
-- STORAGE BUCKETS
-- Crie manualmente no Supabase Dashboard após aplicar este SQL:
--   1. Bucket: "memories"    (privado, autenticados podem fazer upload)
--   2. Bucket: "avatars"     (privado, cada usuário faz upload do próprio)
-- =============================================================
