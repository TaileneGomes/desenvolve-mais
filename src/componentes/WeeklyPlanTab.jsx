import { WEEKLY_PLAN } from "../conteudo/planoSemanal.js";
import { styles } from "../estilos.js";

export default function WeeklyPlanTab({ planoKey }) {
  const plano = WEEKLY_PLAN[planoKey];
  if (!plano) return null; // não ocorre: o seletor só oferece faixas com plano

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