// Lógica de envio do feedback, separada da tela para poder ser testada sem rede.
// O cliente do Supabase é injetado (parâmetro), então o teste usa um falso.

export const TABELA = "feedbacks";
export const TIPOS = ["Sugestão", "Elogio", "Problema", "Nova atividade"];
export const LIMITES = { nome: 100, texto: 2000 };

// Colunas conforme o Table Editor: nome_professora, feedback, tipo_feedback,
// avaliac... (nome cortado na captura: confirme que é "avaliacao"). id e criado_em são automáticos.
export const COLUNA_AVALIACAO = "avaliacao";

export function montarLinha({ nome, tipo, avaliacao, texto }) {
  const nomeLimpo = String(nome ?? "").trim();
  const textoLimpo = String(texto ?? "").trim();
  const nota = Number(avaliacao);

  if (!nomeLimpo || !textoLimpo) {
    return { erro: "Preencha seu nome e o comentário antes de enviar." };
  }
  if (nomeLimpo.length > LIMITES.nome || textoLimpo.length > LIMITES.texto) {
    return { erro: "Nome ou comentário acima do tamanho permitido." };
  }
  if (!TIPOS.includes(tipo)) return { erro: "Tipo de feedback inválido." };
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return { erro: "A avaliação deve ser de 1 a 5." };
  }
  return {
    linha: {
      nome_professora: nomeLimpo,
      feedback: textoLimpo,
      tipo_feedback: tipo,
      [COLUNA_AVALIACAO]: nota,
    },
  };
}

// Traduz o erro do PostgREST/rede em mensagem humana + pista para quem mantém o app.
export function traduzirErro(erro) {
  const codigo = erro?.code ?? "";
  const msg = String(erro?.message ?? "");
  if (codigo === "42501" || /row-level security/i.test(msg)) {
    return "O banco recusou o envio (permissão). Falta liberar INSERT para o público na tabela feedbacks — veja supabase/feedbacks.sql.";
  }
  if (codigo === "PGRST205" || codigo === "42P01") {
    return "A tabela feedbacks não foi encontrada no banco.";
  }
  if (codigo === "PGRST204" || codigo === "42703") {
    return "Alguma coluna da tabela tem nome diferente do esperado pelo app. Confira src/feedback.js.";
  }
  if (/failed to fetch|networkerror|load failed/i.test(msg)) {
    return "Sem conexão com o servidor. Verifique a internet e tente de novo.";
  }
  return "Não foi possível enviar agora. Tente novamente em instantes.";
}

// Retorna sempre { ok, mensagem, detalhe? } — nunca lança exceção para a tela.
export async function enviarFeedback(cliente, dados) {
  const { linha, erro } = montarLinha(dados);
  if (erro) return { ok: false, mensagem: erro };
  try {
    // SEM .select(): o papel anônimo só tem INSERT. Pedir o retorno exigiria SELECT
    // e faria o envio falhar com 42501 mesmo com o insert permitido.
    const { error } = await cliente.from(TABELA).insert(linha);
    if (error) return { ok: false, mensagem: traduzirErro(error), detalhe: error.code };
    return { ok: true, mensagem: "Feedback enviado. Obrigada pela contribuição!" };
  } catch (e) {
    return { ok: false, mensagem: traduzirErro(e), detalhe: "exception" };
  }
}
