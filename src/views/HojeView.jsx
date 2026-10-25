import { useEffect, useState } from "react";
import { PLANO_MINUTOS, WEEKLY_PLAN } from "../conteudo/planoSemanal.js";
import { fmtTempo, planoKeyFromMeses } from "../util.js";
import { styles } from "../estilos.js";

export default function HojeView({ students, onRegistrar }) {
  const dow = new Date().getDay(); // 0 dom ... 6 sáb
  const fimDeSemana = dow === 0 || dow === 6;
  const [faixa, setFaixa] = useState("4-5a");
  const [diaIdx, setDiaIdx] = useState(fimDeSemana ? 0 : dow - 1);
  const [segundos, setSegundos] = useState(PLANO_MINUTOS["4-5a"] * 60);
  const [rodando, setRodando] = useState(false);
  const [marcados, setMarcados] = useState({});

  useEffect(() => {
    if (!rodando) return undefined;
    const id = setInterval(() => {
      setSegundos((s) => {
        if (s <= 1) {
          setRodando(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [rodando]);

  const escolherFaixa = (k) => {
    setFaixa(k);
    setRodando(false);
    setSegundos(PLANO_MINUTOS[k] * 60);
    setMarcados({});
  };

  const escolherDia = (i) => {
    setDiaIdx(i);
    setRodando(false);
    setSegundos(PLANO_MINUTOS[faixa] * 60);
    setMarcados({});
  };

  const plano = WEEKLY_PLAN[faixa];
  const atv = plano.dias[diaIdx];
  const turma = students.filter((s) => planoKeyFromMeses(s.idadeMeses) === faixa);

  const marcar = (aluno, rotulo) => {
    onRegistrar(aluno.id, `${atv.nome} — ${rotulo}.`);
    setMarcados((prev) => ({ ...prev, [aluno.id]: rotulo }));
  };

  return (
    <div>
      <div style={styles.formTitle}>⚡ Atividade de hoje</div>
      {fimDeSemana && (
        <div style={styles.dicaBox}>Hoje não é dia letivo no plano (segunda a sexta). Mostrando segunda-feira.</div>
      )}

      <div style={styles.chipsWrap}>
        {Object.keys(WEEKLY_PLAN).map((k) => (
          <button key={k} onClick={() => escolherFaixa(k)} style={{ ...styles.chip, ...(faixa === k ? styles.chipActive : {}) }}>
            {WEEKLY_PLAN[k].titulo}
          </button>
        ))}
      </div>
      <div style={{ ...styles.chipsWrap, marginTop: 8 }}>
        {plano.dias.map((d, i) => (
          <button key={d.dia} onClick={() => escolherDia(i)} style={{ ...styles.chip, ...(diaIdx === i ? styles.chipActive : {}) }}>
            {d.dia}
          </button>
        ))}
      </div>

      <div style={styles.hojeCard}>
        <div style={styles.hojeNome}>{atv.nome}</div>
        {atv.imagem && <img src={atv.imagem} alt={atv.nome} style={styles.atvImg} />}
        <div style={styles.hojeObj}>{atv.objetivo}</div>
        <div style={styles.hojeBloco}><strong>Materiais:</strong> {atv.materiais}</div>
        <ol style={styles.hojePassos}>
          {atv.comoBrincar.map((p, i) => <li key={i}>{p}</li>)}
        </ol>
        <div style={styles.hojeBloco}><strong>Desenvolve:</strong> {atv.desenvolve}</div>
        {plano.atencao && <div style={styles.dicaBox}><strong>Atenção:</strong> {plano.atencao}</div>}
        {plano.dica && <div style={styles.dicaBox}><strong>Dica:</strong> {plano.dica}</div>}
      </div>

      <div style={styles.timerBox}>
        <div style={styles.timerNum} aria-live="off">{fmtTempo(segundos)}</div>
        <div style={styles.timerMeta}>Referência: {plano.duracao}. Encerre antes se a turma cansar.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
          <button style={styles.primaryBtn} onClick={() => setRodando((r) => !r)} disabled={segundos === 0}>
            {rodando ? "Pausar" : segundos === PLANO_MINUTOS[faixa] * 60 ? "Iniciar" : "Continuar"}
          </button>
          <button style={styles.ghostBtn} onClick={() => { setRodando(false); setSegundos(PLANO_MINUTOS[faixa] * 60); }}>
            Zerar
          </button>
        </div>
        {segundos === 0 && <div style={{ ...styles.timerMeta, color: "#8A5A17", marginTop: 8 }}>Tempo de referência esgotado.</div>}
      </div>

      <div style={styles.formTitle}>Registro rápido</div>
      {turma.length === 0 && (
        <div style={styles.emptyState}>Nenhuma criança cadastrada nesta faixa. Cadastre em "+ Cadastrar aluno".</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {turma.map((s) => (
          <div key={s.id} style={styles.rapidoRow}>
            <div style={styles.studentName}>{s.nome}{s.exemplo ? " (exemplo)" : ""}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Participou", "Precisou de apoio", "Não quis hoje"].map((r) => (
                <button key={r} onClick={() => marcar(s, r)} style={{ ...styles.chip, ...(marcados[s.id] === r ? styles.chipActive : {}), padding: "10px 14px" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...styles.fonteBox, border: "none" }}>
        Cada toque grava uma linha em Acompanhamento da criança. Registre o progresso individual, sem comparar crianças entre si.
      </div>
    </div>
  );
}
