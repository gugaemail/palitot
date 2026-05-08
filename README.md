# 🌿 palitot.com.br

Site memorial da Família Palitot. Um espaço íntimo para guardar e celebrar as memórias juntos.

---

## Stack

- **Next.js 15** — App Router, Server Components
- **Supabase** — Auth (magic link), PostgreSQL, Storage
- **Tailwind CSS** — com tokens da paleta Palitot
- **TypeScript**

---

## Setup local

### 1. Clonar e instalar dependências

```bash
npm install
```

### 2. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **Settings → API** e copie:
   - `Project URL`
   - `anon public key`

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Supabase.

### 4. Aplicar o schema no banco

No **Supabase Dashboard → SQL Editor**, execute o arquivo:

```
supabase/migrations/001_initial_schema.sql
```

### 5. Criar os Storage Buckets

No **Supabase Dashboard → Storage**, crie dois buckets:
- `memories` — para fotos das memórias
- `avatars` — para fotos de perfil

Configure ambos como **privados** (authenticated users only).

### 6. Criar usuários da família

No **Supabase Dashboard → Authentication → Users → Invite user**, convide:
- `pedro@email.com.br` (será admin)
- `ana@email.com.br`
- `carlos@email.com.br`
- (demais membros da família)

### 7. Aplicar o seed de dados fictícios

1. Copie os UUIDs gerados para cada usuário
2. Edite `supabase/seed/seed_data.sql` e substitua os placeholders
3. Execute no **SQL Editor** do Supabase

### 8. Promover o admin

No SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE name = 'Pedro Palitot';
```

### 9. Rodar localmente

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Deploy no Vercel

1. Push para um repositório GitHub
2. Importe no [vercel.com](https://vercel.com)
3. Adicione as variáveis de ambiente do `.env.local`
4. Configure o domínio `palitot.com.br` em **Settings → Domains**
5. No Supabase, adicione `https://palitot.com.br` em **Authentication → URL Configuration → Site URL**

---

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                  # Homepage (pública)
│   ├── entrar/page.tsx           # Login com magic link
│   ├── memoria/
│   │   ├── page.tsx              # Timeline de memórias
│   │   └── [slug]/page.tsx       # Página de cada memória
│   ├── mural/page.tsx            # Mural de mensagens
│   ├── painel/page.tsx           # Dashboard admin
│   └── api/auth/callback/        # Callback do magic link
├── components/
│   ├── memory/CommentForm.tsx    # Formulário de comentário
│   └── mural/MuralMessageForm.tsx
├── lib/
│   ├── supabase.ts               # Clients (server + browser)
│   ├── queries.ts                # Queries centralizadas
│   └── utils.ts                  # Utilitários
├── types/index.ts                # Tipos TypeScript
└── styles/globals.css            # Design tokens e base styles

supabase/
├── migrations/001_initial_schema.sql   # Schema completo
└── seed/seed_data.sql                  # Dados fictícios
```

---

## Fases de desenvolvimento

- [x] **Fase 1** — Schema, auth, homepage, timeline, mural, painel básico
- [ ] **Fase 2** — Upload de fotos via Supabase Storage
- [ ] **Fase 3** — Formulário de criação/edição de memórias no painel
- [ ] **Fase 4** — Gerenciamento de membros da família
- [ ] **Fase 5** — Animações de scroll, refinamento mobile, compartilhamento

---

## Paleta de cores

| Token | Hex | Uso |
|-------|-----|-----|
| `--moss` | `#2D4A2D` | Headings, botões, CTA |
| `--terra` | `#C9956A` | Destaques, datas, dots |
| `--ivory` | `#F7F3ED` | Background principal |
| `--ivory-warm` | `#F2E8DC` | Backgrounds especiais |
| `--sand` | `#E8DDD0` | Bordas, separadores |
| `--bark` | `#8B6F5E` | Texto secundário |
| `--bark-dark` | `#5A4A40` | Texto principal |
