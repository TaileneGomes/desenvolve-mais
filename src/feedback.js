
 // Lógica de envio do feedback, separada da tela para poder ser testada sem rede.
// O cliente do Supabase é injetado (parâmetro), então o teste usa um falso.

export const TABELA = "feedbacks";
export const TIPOS = ["Sugestão", "Elogio", "Problema", "Nova atividade"];
export const LIMITES = { nome: 100, texto: 2000 };

// Colunas da tabela public.feedbacks.
export const COLUNA_AVALIACAO = "avaliacao";

export function montarLinha({ nome, tipo, avaliacao, texto }) {
  const nomeLimpo = String(nome ?? "").trim();
  const textoLimpo = String(texto ?? "").trim();
  const nota = Number(avaliacao);

  if (!nomeLimpo || !textoLimpo) {
    return {
      erro: "Preencha seu nome e o comentário antes de enviar.",
    };
  }

  if (
    nomeLimpo.length > LIMITES.nome ||
    textoLimpo.length > LIMITES.texto
  ) {
    return {
      erro: "Nome ou comentário acima do tamanho permitido.",
    };
  }

  if (!TIPOS.includes(tipo)) {
    return { erro: "Tipo de feedback inválido." };
  }

  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return { erro: "A avaliação deve ser de 1 a 5." };
  }

  return {
    linha: {
      nome_professora: nomeLimpo,
      feedback: textoLimpo,
      tipo_feedback: tipo,
      [COLUNA_AVALIACAO]: nota,

      // Todo feedback novo começa pendente.
      publicado: false,
      status: "pendente",
    },
  };
}

// Traduz erros do Supabase em mensagens compreensíveis.
export function traduzirErro(erro) {
  const codigo = erro?.code ?? "";
  const msg = String(erro?.message ?? "");

  if (codigo === "42501" || /row-level security/i.test(msg)) {
    return "O banco recusou o envio. Verifique a política de INSERT da tabela feedbacks no Supabase.";
  }

  if (codigo === "PGRST205" || codigo === "42P01") {
    return "A tabela feedbacks não foi encontrada no banco.";
  }

  if (codigo === "PGRST204" || codigo === "42703") {
    return "Alguma coluna da tabela tem nome diferente do esperado. Confira as colunas no Supabase.";
  }

  if (/failed to fetch|networkerror|load failed/i.test(msg)) {
    return "Sem conexão com o servidor. Verifique a internet e tente novamente.";
  }

  return "Não foi possível enviar agora. Tente novamente em instantes.";
}

// Retorna sempre { ok, mensagem, detalhe? }.
export async function enviarFeedback(cliente, dados) {
  const { linha, erro } = montarLinha(dados);

  if (erro) {
    return { ok: false, mensagem: erro };
  }

  try {
    // Não usa .select(): o público precisa apenas inserir o feedback.
    const { error } = await cliente
      .from(TABELA)
      .insert(linha);

    if (error) {
      return {
        ok: false,
        mensagem: traduzirErro(error),
        detalhe: error.code,
      };
    }

    return {
      ok: true,
      mensagem:
        "Feedback enviado com sucesso! Ele ficará aguardando aprovação da equipe.",
    };
  } catch (e) {
    return {
      ok: false,
      mensagem: traduzirErro(e),
      detalhe: "exception",
    };
  }
}
