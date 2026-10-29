// Cliente do Supabase. A chave "publishable" (sb_publishable_...) é PÚBLICA por
// projeto: ela vai dentro do app e quem protege os dados é o RLS no banco.
// NUNCA coloque aqui a chave "secret" / service_role.
//
// Ordem: variáveis do .env (VITE_*) > valores padrão abaixo.
// Trade-off: manter o padrão no código evita que o app "quebre em silêncio" se
// o arquivo .env (oculto) não for copiado junto; em troca, a URL fica no repositório.
import { createClient } from "@supabase/supabase-js";

const PADRAO_URL = "https://uelkwzqsciwhkwvgimss.supabase.co";
const PADRAO_CHAVE = "sb_publishable_imm9SNjK3mbunL2149NPpA_x1mxYHNv";

const env = import.meta.env ?? {};
export const SUPABASE_URL = env.VITE_SUPABASE_URL || PADRAO_URL;
const CHAVE = env.VITE_SUPABASE_PUBLISHABLE_KEY || PADRAO_CHAVE;

// Sem sessão de login: o app é anônimo e só INSERE feedbacks.

export const supabase = createClient(SUPABASE_URL, CHAVE, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

