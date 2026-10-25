// Plano semanal — cobre só 3 dos 6 grupos etários da tabela (6-11m, 2-3a, 4-5a).
// Lacuna real do material-fonte: não há plano lúdico para 1-2 anos nem 3-4 anos.
// Sinalizado na interface em vez de "preenchido" artificialmente.
export const WEEKLY_PLAN = {
  "6-11m": {
    titulo: "Bebês de 6 meses a 1 ano",
    foco: "Estímulos sensoriais, balbucio, atenção auditiva, interação com o adulto e desenvolvimento motor.",
    duracao: "5 a 10 minutos, conforme o interesse",
    atencao: "Realize as atividades por períodos curtos, conforme o interesse e os sinais de cansaço. Supervisione continuamente, evite objetos pequenos, peças soltas, balões e materiais que possam causar engasgo. Nas brincadeiras no chão, utilize uma superfície segura e mantenha o bebê sempre acompanhado.",
    dias: [
      { dia: "Segunda", nome: "Cesta das descobertas", objetivo: "Estimular a curiosidade, o tato e a linguagem receptiva.", materiais: "Objetos grandes, leves, macios e seguros, como bolas de tecido e brinquedos próprios para bebês.", comoBrincar: ["Coloque os objetos ao alcance do bebê.", "Incentive-o a tocar, pegar, soltar e explorar.", "Nomeie os objetos: “bola”, “macio”, “azul”, “pegar”."], desenvolve: "Coordenação motora fina, percepção sensorial e compreensão de palavras." },
      { dia: "Terça", nome: "Cantigas e palminhas", objetivo: "Estimular a audição, a comunicação e os movimentos das mãos.", materiais: "Músicas infantis e a voz do educador.", comoBrincar: ["Cante músicas como “Parabéns pra você” ou “Borboletinha”.", "Faça palmas e movimentos simples com as mãos.", "Espere a reação do bebê e incentive balbucios, sorrisos e gestos."], desenvolve: "Atenção auditiva, imitação, ritmo e interação comunicativa." },
      { dia: "Quarta", nome: "Cadê o brinquedo?", objetivo: "Estimular a atenção, a compreensão da linguagem e o movimento corporal.", materiais: "Brinquedo grande e colorido.", comoBrincar: ["Esconda parcialmente o brinquedo atrás de um pano leve.", "Pergunte: “Cadê a bola? Achou!”", "Incentive o bebê a olhar, esticar os braços, rolar ou se deslocar até o brinquedo, conforme sua fase de desenvolvimento."], desenvolve: "Coordenação olho-mão, atenção compartilhada e compreensão de palavras." },
      { dia: "Quinta", nome: "Brincadeira do “Cadê? Achou!”", objetivo: "Incentivar a comunicação, a interação social e a atenção visual.", materiais: "Mãos ou pano leve.", comoBrincar: ["Cubra parcialmente o rosto com as mãos e pergunte: “Cadê a professora?”", "Descubra o rosto e diga: “Achou!”", "Convide o bebê a participar, observando seus gestos, sons e expressões."], desenvolve: "Contato visual, antecipação, vínculo afetivo e comunicação não verbal." },
      { dia: "Sexta", nome: "Bola vai, bola vem", objetivo: "Trabalhar o controle dos movimentos e a interação por turnos.", materiais: "Bola grande, leve e macia.", comoBrincar: ["Sente-se de frente para o bebê, com apoio adequado quando necessário.", "Role a bola suavemente em sua direção.", "Nomeie a ação: “A bola vai!”, “A bola voltou!”.", "Permita que ele toque, empurre ou alcance a bola."], desenvolve: "Coordenação motora ampla, percepção visual e compreensão da linguagem." },
    ],
  },
  "2-3a": {
    titulo: "Crianças de 2 a 3 anos",
    foco: "Ampliação do vocabulário, comunicação oral, compreensão de comandos, equilíbrio, coordenação motora e exploração do ambiente.",
    duracao: "10 a 15 minutos",
    dica: "Nessa idade, valorize palavras, gestos e pequenas frases. Se a criança disser “bola”, você pode ampliar naturalmente: “Isso, uma bola azul! Vamos jogar a bola?”. Não é necessário exigir respostas completas.",
    dias: [
      { dia: "Segunda", nome: "Imitando os animais", objetivo: "Desenvolver a linguagem oral, a imaginação e a coordenação motora ampla.", materiais: "Figuras de animais ou brinquedos de animais.", comoBrincar: ["Apresente um animal e pergunte: “Que animal é esse?”", "Imite seu som: “O cachorro faz au-au!”", "Convide as crianças a andar como o pato, pular como o sapo ou engatinhar como o gato, respeitando suas possibilidades."], desenvolve: "Vocabulário, imitação de sons, equilíbrio e consciência corporal." },
      { dia: "Terça", nome: "Torre das cores", objetivo: "Estimular a coordenação motora fina e a identificação de cores.", materiais: "Blocos grandes de encaixe.", comoBrincar: ["Convide as crianças a empilhar os blocos.", "Peça: “Vamos pegar o bloco vermelho?” ou “Coloque um bloco em cima”.", "Incentive-as a contar os blocos e falar sobre a torre construída."], desenvolve: "Coordenação olho-mão, atenção, vocabulário e compreensão de instruções simples." },
      { dia: "Quarta", nome: "Caminho das aventuras", objetivo: "Desenvolver equilíbrio, orientação espacial e compreensão verbal.", materiais: "Fita adesiva bem fixada ao chão ou marcas planas antiderrapantes.", comoBrincar: ["Crie um caminho curto e seguro.", "Convide as crianças a caminhar até um brinquedo.", "Dê comandos simples: “Ande devagar”, “Pare”, “Vire” e “Pegue a bola”."], desenvolve: "Coordenação motora ampla, equilíbrio e compreensão de comandos." },
      { dia: "Quinta", nome: "História com movimentos", objetivo: "Ampliar o vocabulário, estimular a escuta e incentivar a expressão corporal.", materiais: "Livro ilustrado com uma história curta.", comoBrincar: ["Conte uma história com animais, pessoas ou elementos da natureza.", "Convide as crianças a imitar as ações: pular, bater palmas, dormir ou correr sem sair do lugar.", "Faça perguntas simples: “Quem apareceu?”, “O que ele fez?”."], desenvolve: "Linguagem oral, atenção, memória, imaginação e coordenação motora." },
      { dia: "Sexta", nome: "Acerte o cesto", objetivo: "Trabalhar a coordenação motora, a percepção espacial e a comunicação.", materiais: "Bolas macias grandes e um cesto ou caixa ampla.", comoBrincar: ["Coloque o cesto a uma curta distância.", "Convide cada criança a rolar a bola até ele.", "Incentive frases como “Minha bola!”, “Acertou!” e “Vamos tentar de novo?”."], desenvolve: "Coordenação motora ampla, controle da força, turnos de participação e linguagem funcional." },
    ],
  },
  "4-5a": {
    titulo: "Crianças de 4 a 5 anos",
    foco: "Construção de frases, narrativa, consciência dos sons da fala, coordenação motora fina e ampla, criatividade e cooperação.",
    duracao: "15 a 25 minutos",
    dica: "Incentive as crianças a contar experiências, descrever imagens, formular perguntas e conversar umas com as outras. Corrija indiretamente, oferecendo o modelo adequado de fala, sem constranger ou interromper a participação.",
    dias: [
      { dia: "Segunda", nome: "Adivinhe o que estou imitando", objetivo: "Estimular a expressão oral, o vocabulário e o controle corporal.", materiais: "Cartões ilustrados com animais, profissões ou ações.", comoBrincar: ["Uma criança sorteia um cartão e representa o que está vendo, sem falar.", "Os colegas tentam adivinhar.", "Depois, a criança conta o que representou e como é esse animal, profissão ou ação."], desenvolve: "Linguagem expressiva, criatividade, expressão corporal e interação social." },
      { dia: "Terça", nome: "Colar de cores e sequências", objetivo: "Trabalhar a coordenação motora fina, a atenção e a linguagem matemática.", materiais: "Peças grandes próprias para a idade e cordões adequados, utilizados com supervisão direta.", comoBrincar: ["Proponha uma sequência de cores, como vermelho, azul, vermelho, azul.", "Peça às crianças que continuem o padrão.", "Convide-as a explicar a sequência: “O que vem agora? Por quê?”."], desenvolve: "Destreza manual, percepção visual, raciocínio lógico e organização da fala." },
      { dia: "Quarta", nome: "História maluca em grupo", objetivo: "Desenvolver a oralidade, a criatividade e a sequência lógica dos acontecimentos.", materiais: "Cartões com imagens de personagens, lugares e objetos.", comoBrincar: ["Mostre três imagens, por exemplo, um cachorro, uma floresta e uma bicicleta.", "Comece uma história: “Certo dia, um cachorro encontrou...”.", "Cada criança acrescenta uma parte à narrativa.", "Ao final, o grupo conta a história novamente."], desenvolve: "Construção de frases, vocabulário, memória, imaginação e organização temporal." },
      { dia: "Quinta", nome: "Circuito dos desafios", objetivo: "Desenvolver a coordenação motora ampla, o equilíbrio e a compreensão de instruções.", materiais: "Cones grandes, almofadas firmes e túnel infantil apropriado.", comoBrincar: ["Organize um percurso simples com obstáculos seguros.", "Oriente as crianças a passar por dentro, contornar, caminhar entre marcas e saltar sobre pequenas linhas.", "Peça que expliquem o percurso: “Primeiro eu passei pelo túnel, depois...”."], desenvolve: "Equilíbrio, planejamento motor, orientação espacial, compreensão verbal e sequência de ações." },
      { dia: "Sexta", nome: "Desenho que vira história", objetivo: "Estimular a coordenação motora fina, a criatividade e a expressão oral.", materiais: "Papel, giz de cera grosso e lápis adequados à faixa etária.", comoBrincar: ["Peça que cada criança desenhe algo de que gosta.", "Convide-a a contar o que desenhou, quem aparece e o que está acontecendo.", "Registre uma frase ditada pela criança e compartilhe os desenhos com o grupo."], desenvolve: "Controle dos movimentos das mãos, vocabulário, construção de frases, imaginação e confiança para se expressar." },
    ],
  },
};

// Duração do cronômetro = limite superior da faixa sugerida no material
// (5-10, 10-15, 15-25 min). É referência flexível.
export const PLANO_MINUTOS = { "6-11m": 10, "2-3a": 15, "4-5a": 25 };
