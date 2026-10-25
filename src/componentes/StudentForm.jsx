import { useState } from "react";
import { DIFFICULTIES } from "../conteudo/dificuldades.js";
import { styles } from "../estilos.js";

export default function StudentForm({ inicial, onSave, onCancel }) {
  const mesesIni = inicial ? inicial.idadeMeses : 48;
  const [nome, setNome] = useState(inicial ? inicial.nome : "");
  const [anos, setAnos] = useState(String(Math.floor(mesesIni / 12)));
  const [meses, setMeses] = useState(String(mesesIni % 12));
  const [serie, setSerie] = useState(inicial && inicial.serie !== "—" ? inicial.serie : "");
  const [dif, setDif] = useState(inicial ? inicial.dificuldades : []);

  const totalMeses = (Number(anos) || 0) * 12 + (Number(meses) || 0);
  const toggleDif = (k) => setDif((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <div style={styles.formCard}>
      <div style={styles.formTitle}>{inicial ? "Editar aluno" : "Novo aluno"}</div>
      <label style={styles.label}>Nome</label>
      <input style={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do aluno" />
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Anos</label>
          <input style={styles.input} type="number" min="0" max="16" value={anos} onChange={(e) => setAnos(e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Meses</label>
          <input style={styles.input} type="number" min="0" max="11" value={meses} onChange={(e) => setMeses(e.target.value)} />
        </div>
        <div style={{ flex: 2 }}>
          <label style={styles.label}>Turma</label>
          <input style={styles.input} value={serie} onChange={(e) => setSerie(e.target.value)} placeholder="Ex: 3º ano / Berçário" />
        </div>
      </div>
      {totalMeses >= 48 && (
        <>
          <label style={styles.label}>Dificuldades observadas (a partir de 4 anos)</label>
          <div style={styles.chipsWrap}>
            {DIFFICULTIES.map((d) => (
              <button key={d.key} onClick={() => toggleDif(d.key)} style={{ ...styles.chip, ...(dif.includes(d.key) ? styles.chipActive : {}) }}>
                {d.label}
              </button>
            ))}
          </div>
        </>
      )}
      {totalMeses < 48 && (
        <div style={{ ...styles.emptyState, padding: "10px 0 0" }}>
          Abaixo de 4 anos, o app usa marcos de desenvolvimento gerais em vez de dificuldades específicas.
        </div>
      )}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button
          style={styles.primaryBtn}
          onClick={() => {
            if (!nome.trim()) return;
            onSave({
              ...(inicial || {}),
              id: inicial ? inicial.id : Date.now(),
              nome: nome.trim(),
              idadeMeses: totalMeses,
              idadeAnos: Math.floor(totalMeses / 12),
              serie: serie.trim() || "—",
              dificuldades: dif,
              registros: inicial ? inicial.registros : [],
            });
          }}
        >
          Salvar aluno
        </button>
        <button style={styles.ghostBtn} onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
