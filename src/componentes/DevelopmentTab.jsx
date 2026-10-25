import { useState } from "react";
import { MOSTRAR_MOTOR } from "../conteudo/marcos.js";
import { LINGUAGEM_CONCEITOS } from "../conteudo/linguagem.js";
import { faixaInfantilFromMeses } from "../util.js";
import { styles } from "../estilos.js";

export default function DevelopmentTab({ meses }) {
  const faixa = faixaInfantilFromMeses(meses);
  const [showConceito, setShowConceito] = useState(false);
  if (!faixa) {
    return <div style={styles.emptyState}>Idade abaixo de 6 meses — fora da faixa coberta pela tabela de referência.</div>;
  }
  return (
    <div style={{ marginTop: 16 }}>
      <div style={styles.devFaixaLabel}>{faixa.label}</div>
      <div style={styles.devGrid}>
        {MOSTRAR_MOTOR && (
          <div style={styles.devCard}><div style={styles.devCardTitle}>🏃 Desenvolvimento motor</div><div style={styles.devCardText}>{faixa.motor}</div></div>
        )}
        <div style={styles.devCard}><div style={styles.devCardTitle}>🗣️ Linguagem e comunicação</div><div style={styles.devCardText}>{faixa.linguagem}</div></div>
        <div style={styles.devCard}><div style={styles.devCardTitle}>🧠 Desenvolvimento cognitivo</div><div style={styles.devCardText}>{faixa.cognitivo}</div></div>
        <div style={styles.devCard}><div style={styles.devCardTitle}>💛 Socialização e emoções</div><div style={styles.devCardText}>{faixa.socioemocional}</div></div>
      </div>
      <div style={styles.devSugestao}>
        <div style={styles.devCardTitle}>🎲 Sugestões pedagógicas para esta faixa</div>
        <div style={styles.devCardText}>{faixa.sugestoes}</div>
      </div>

      <button style={styles.linkBtn} onClick={() => setShowConceito((v) => !v)}>
        {showConceito ? "Ocultar" : "O que é linguagem, afinal?"}
      </button>
      {showConceito && (
        <div style={styles.conceitoBox}>
          {LINGUAGEM_CONCEITOS.map((c, i) => (
            <div key={i} style={styles.conceitoItem}>
              {c.texto}{c.citacao && <> <span style={styles.conceitoAutor}>({c.citacao})</span></>}
            </div>
          ))}
        </div>
      )}

      <div style={styles.fonteBox}>
        <strong>Fonte:</strong> Elaborado pela autora, com base na Base Nacional Comum Curricular (BRASIL, 2018), na Caderneta da Criança e nas orientações do Ministério da Saúde sobre desenvolvimento infantil. As descrições e sugestões pedagógicas foram organizadas e adaptadas para fins de acompanhamento na Educação Infantil. Os indicadores são referências, não exigências rígidas para todas as crianças.
        <div style={{ marginTop: 8 }}>Tabela de acompanhamento do desenvolvimento infantil: Diessica e turma.</div>
        <div style={{ marginTop: 8 }}><strong>Referências bibliográficas</strong></div>
        <ol style={{ margin: "4px 0 0", paddingLeft: 18 }}>
          <li>BRASIL. Ministério da Educação. <em>Base Nacional Comum Curricular (BNCC).</em> Brasília, DF: MEC, 2018. Disponível em: <a href="https://basenacionalcomum.mec.gov.br/" target="_blank" rel="noopener noreferrer">https://basenacionalcomum.mec.gov.br/</a>. Acesso em: 12 out. 2026.</li>
          <li>BRASIL. Ministério da Saúde. <em>Caderneta da Criança — Passaporte da Cidadania.</em> Brasília, DF: Ministério da Saúde. Disponível em: <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta/caderneta" target="_blank" rel="noopener noreferrer">https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/caderneta/caderneta</a>. Acesso em: 12 out. 2026.</li>
          <li>BRASIL. Ministério da Saúde. <em>Desenvolvimento Infantil.</em> Brasília, DF: Ministério da Saúde. Disponível em: <a href="https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/primeira-infancia/desenvolvimento-infantil" target="_blank" rel="noopener noreferrer">https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/saude-da-crianca/primeira-infancia/desenvolvimento-infantil</a>. Acesso em: 12 out. 2026.</li>
        </ol>
      </div>
    </div>
  );
}
