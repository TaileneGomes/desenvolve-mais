-- ============================================================
-- Desenvolve+ — permissões da tabela public.feedbacks
-- Rode no Supabase: SQL Editor > New query > cole > Run.
-- É idempotente (pode rodar mais de uma vez).
-- ============================================================

-- 0) DIAGNÓSTICO (rode sozinho primeiro e me mande o resultado se algo falhar)
-- select policyname, cmd, roles, qual, with_check from pg_policies where tablename = 'feedbacks';
-- select column_name, data_type from information_schema.columns where table_name = 'feedbacks' order by ordinal_position;

-- 1) RLS ligado (sem isso a tabela ficaria aberta a quem tem a chave pública)
alter table public.feedbacks enable row level security;

-- 2) O público (anon) pode APENAS inserir. Nada de SELECT/UPDATE/DELETE:
--    quem tem a chave pública poderia ler nomes e comentários das professoras.
revoke all on public.feedbacks from anon;
grant insert on public.feedbacks to anon;

-- Se "id" for serial/bigserial (não identity), o insert precisa usar a sequência:
do $$
declare seq text := pg_get_serial_sequence('public.feedbacks', 'id');
begin
  if seq is not null then execute format('grant usage on sequence %s to anon', seq); end if;
end $$;

-- 3) Política de INSERT (recria para não acumular duplicatas)
drop policy if exists "feedbacks_insert_publico" on public.feedbacks;
create policy "feedbacks_insert_publico"
  on public.feedbacks
  for insert
  to anon
  with check (
    char_length(btrim(nome_professora)) between 1 and 100
    and char_length(btrim(feedback)) between 1 and 2000
    and tipo_feedback in ('Sugestão', 'Elogio', 'Problema', 'Nova atividade')
    and avaliacao between 1 and 5   -- <- troque se a coluna tiver outro nome
  );

-- 4) As 2 políticas que já existem hoje (vistas no painel) continuam valendo.
--    Se uma delas for "SELECT para anon / public", REMOVA-A: ela expõe os feedbacks.
--    Para listar: select policyname, cmd, roles from pg_policies where tablename='feedbacks';
--    Leitura dos feedbacks: pelo Table Editor do painel (você é dona do projeto).
