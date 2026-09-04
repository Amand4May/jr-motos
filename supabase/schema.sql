-- Execute este script no SQL Editor do seu projeto Supabase.

create table if not exists public.motos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  marca text,
  cor text,
  ano int not null,
  km int,
  preco numeric not null,
  descricao text,
  fotos text[] not null default '{}',
  status text not null default 'disponivel' check (status in ('disponivel', 'vendida')),
  criado_em timestamptz not null default now()
);

alter table public.motos enable row level security;

-- Leitura pública (site institucional) via chave anônima.
create policy "Motos são públicas para leitura"
  on public.motos for select
  using (true);

-- Inserção/edição/remoção só pela service role (usada nas Server Actions do /admin).
-- Nenhuma policy de insert/update/delete é criada para a chave anônima de propósito.

-- Bucket de Storage para as fotos das motos.
insert into storage.buckets (id, name, public)
values ('motos', 'motos', true)
on conflict (id) do nothing;

create policy "Fotos de motos são públicas para leitura"
  on storage.objects for select
  using (bucket_id = 'motos');
