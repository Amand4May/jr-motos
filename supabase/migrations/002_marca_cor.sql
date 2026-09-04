-- Adiciona marca e cor, usadas nos filtros da página /motos.
alter table public.motos add column if not exists marca text;
alter table public.motos add column if not exists cor text;
