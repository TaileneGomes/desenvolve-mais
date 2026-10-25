import { WEEKLY_PLAN } from "../conteudo/planoSemanal.js";
import { faixaInfantilFromMeses } from "../util.js";
import { styles } from "../estilos.js";

export default function WeeklyPlanTab({ meses }) {
  const faixa = faixaInfantilFromMeses(meses);
  // O material agrupa "4 a 5 anos" num só plano; "por volta dos 5 anos" usa o mesmo.
  const planoKey = faixa ? (faixa.key === "5a" ? "4-5a" : faixa.key) : null;
  const plano = planoKey ? WEEKLY_PLAN[planoKey] : null;

  if (!plano) {
    return (
      <div style={styles.emptyState}>
        Não há plano semanal de brincadeiras para a faixa "{faixa ? faixa.label : "—"}" no material de referência — ele cobre apenas 6 a 11 meses, 2 a 3 anos e 4 a 5 anos. Use a aba "Marcos de desenvolvimento" para esta idade.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={styles.devFaixaLabel}>{plano.titulo}</div>
      <div style={styles.devCardText}>{plano.foco}</div>
      <div style={styles.planoMeta}>
        <span style={styles.tag}>⏱ {plano.duracao}</span>
      </div>
      {plano.dica && <div style={styles.dicaBox}><strong>Dica pedagógica:</strong> {plano.dica}</div>}
      {plano.atencao && <div style={styles.dicaBox}><strong>Atenção:</strong> {plano.atencao}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {plano.dias.map((d, i) => (
          <details key={i} style={styles.diaCard}>
            <summary style={styles.diaSummary}>
              <span style={styles.diaDia}>{d.dia}</span> — {d.nome}
            </summary>
            <div style={{ marginTop: 8 }}>
              {d.imagem && <img src={d.imagem} alt={d.nome} style={styles.atvImg} />}
              <div style={styles.devCardText}><strong>Objetivo:</strong> {d.objetivo}</div>
              <div style={styles.devCardText}><strong>Materiais:</strong> {d.materiais}</div>
              <div style={styles.devCardText}><strong>Como brincar:</strong></div>
              <ul style={styles.diaLista}>
                {d.comoBrincar.map((p, j) => <li key={j}>{p}</li>)}
              </ul>
              <div style={styles.devCardText}><strong>Desenvolve:</strong> {d.desenvolve}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
