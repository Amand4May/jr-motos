-- Torna o km opcional (já existia NOT NULL na criação da tabela).
alter table public.motos alter column km drop not null;
