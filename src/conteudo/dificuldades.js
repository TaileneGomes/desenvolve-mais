// Módulo 2 — apoio a dificuldades (a partir de ~4 anos).
// ATENÇÃO: o banco BANK foi escrito por IA, sem fonte e sem revisão de
// fonoaudióloga/psicopedagoga. Não publicar sem revisão profissional.

export const AREAS = [
  { key: "linguagem", label: "Linguagem", icon: "🗣️" },
  { key: "leitura", label: "Leitura", icon: "📖" },
  { key: "escrita", label: "Escrita", icon: "✏️" },
  { key: "comunicacao", label: "Comunicação", icon: "💬" },
  { key: "atencao", label: "Atenção", icon: "🎯" },
];

export const DIFFICULTIES = [
  { key: "fala", label: "Fala / articulação" },
  { key: "leitura", label: "Leitura" },
  { key: "escrita", label: "Escrita" },
  { key: "atencao", label: "Atenção / concentração" },
  { key: "vocabulario", label: "Vocabulário / compreensão" },
];

export const BANK = {
  fala: {
    inicial: [
      { area: "linguagem", habilidade: "Consciência fonológica", atividade: "Jogo de rimas com bichos e objetos do dia a dia" },
      { area: "comunicacao", habilidade: "Articulação de sons", atividade: "Repetição lúdica de palavras com o som-alvo em canções curtas" },
    ],
    intermediaria: [
      { area: "linguagem", habilidade: "Discriminação de sons parecidos", atividade: "Jogo de associação: cartas com pares mínimos (ex: 'faca' x 'vaca')" },
      { area: "comunicacao", habilidade: "Expressão verbal", atividade: "Contar uma história curta em 3 frases, com apoio de imagens" },
    ],
    avancada: [
      { area: "comunicacao", habilidade: "Fluência na fala", atividade: "Leitura em voz alta de textos curtos, com gravação para autoavaliação" },
    ],
  },
  leitura: {
    inicial: [
      { area: "leitura", habilidade: "Reconhecimento de letras", atividade: "Cartões ilustrados letra + imagem + palavra" },
      { area: "linguagem", habilidade: "Consciência silábica", atividade: "Bater palmas para contar sílabas de palavras do cotidiano" },
    ],
    intermediaria: [
      { area: "leitura", habilidade: "Reconhecimento de palavras", atividade: "Caça-palavras com termos do tema estudado em sala" },
      { area: "leitura", habilidade: "Fluência leitora", atividade: "Leitura compartilhada em dupla, revezando frases" },
    ],
    avancada: [
      { area: "leitura", habilidade: "Compreensão leitora", atividade: "Leitura de texto curto seguida de 3 perguntas abertas" },
    ],
  },
  escrita: {
    inicial: [
      { area: "escrita", habilidade: "Coordenação motora fina", atividade: "Traçado de letras com massinha ou areia colorida" },
    ],
    intermediaria: [
      { area: "escrita", habilidade: "Formação de palavras", atividade: "Jogo de montar palavras com sílabas móveis" },
      { area: "escrita", habilidade: "Estruturação de frases", atividade: "Completar frases com banco de palavras dado" },
    ],
    avancada: [
      { area: "escrita", habilidade: "Produção textual", atividade: "Escrever um pequeno relato guiado por 4 perguntas norteadoras" },
    ],
  },
  atencao: {
    inicial: [
      { area: "atencao", habilidade: "Concentração breve", atividade: "Atividades de 5 minutos com cronômetro visual e pausa ativa" },
    ],
    intermediaria: [
      { area: "atencao", habilidade: "Sustentação da atenção", atividade: "Jogo dos 7 erros com tempo progressivo" },
    ],
    avancada: [
      { area: "atencao", habilidade: "Autorregulação", atividade: "Checklist próprio de tarefas com automonitoramento" },
    ],
  },
  vocabulario: {
    inicial: [
      { area: "linguagem", habilidade: "Ampliação de vocabulário", atividade: "Nomear e categorizar objetos por temas (frutas, animais, cores)" },
    ],
    intermediaria: [
      { area: "linguagem", habilidade: "Compreensão de instruções", atividade: "Sequência de 2 comandos simples em jogos de tabuleiro" },
    ],
    avancada: [
      { area: "linguagem", habilidade: "Vocabulário acadêmico", atividade: "Glossário ilustrado dos termos-chave da matéria da semana" },
    ],
  },
};
