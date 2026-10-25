/* Armazenamento local (somente neste aparelho).
   Decisão de projeto: nenhum dado de aluno sai do aparelho do professor.
   Sem servidor, sem conta, sem envio. Só o FEEDBACK vai para o Supabase. */
export const STORAGE_KEY = "desenvolve-mais:v1";

export function carregarSalvo() {
  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return null;
    const dados = JSON.parse(bruto);
    if (!dados || !Array.isArray(dados.students)) return null;
    return dados;
  } catch (e) {
    return null; // armazenamento indisponível ou conteúdo corrompido: começa vazio
  }
}

export function salvarLocal(students) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ versao: 1, students }));
    return true;
  } catch (e) {
    return false;
  }
}
