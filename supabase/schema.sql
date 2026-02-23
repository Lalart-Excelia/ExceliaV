-- Excelia schema (MVP)
-- Run in Supabase SQL editor

create table if not exists public.users (
  id uuid primary key,
  email text,
  plan text not null default 'free',
  promo_used boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  type text not null check (type in ('monthly','rollover','promo','purchase')),
  amount int not null,
  remaining int not null,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.storage_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  type text not null check (type in ('template','dashboard','formula')),
  title text not null,
  payload_json jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  storage_path text not null,
  filename text not null,
  mime text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  tool text not null,
  model text not null,
  input_tokens_est int not null default 0,
  output_tokens_est int not null default 0,
  cost_est_brl numeric not null default 0,
  meta jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  type text not null check (type in ('promo','pdf','pptx','credits_pack','subscription')),
  provider text not null default 'stripe',
  amount_brl numeric not null,
  currency text not null default 'BRL',
  status text not null default 'created',
  provider_ref text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- RLS basic
alter table public.users enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.storage_items enable row level security;
alter table public.files enable row level security;
alter table public.usage_events enable row level security;
alter table public.purchases enable row level security;

-- Policies: users can read own rows
create policy "users_read_own" on public.users for select
using (auth.uid() = id);

create policy "ledger_read_own" on public.credit_ledger for select
using (auth.uid() = user_id);

create policy "items_read_own" on public.storage_items for select
using (auth.uid() = user_id);

create policy "files_read_own" on public.files for select
using (auth.uid() = user_id);

create policy "purchases_read_own" on public.purchases for select
using (auth.uid() = user_id);

-- Writes are typically via service role in API routes; keep locked-down by default.
