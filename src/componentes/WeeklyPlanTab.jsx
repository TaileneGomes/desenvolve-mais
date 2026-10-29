
import { useEffect, useState } from "react";
import { supabase } from "../supabase.js";
import { WEEKLY_PLAN } from "../conteudo/planoSemanal.js";
import { styles } from "../estilos.js";

export default function WeeklyPlanTab({ planoKey }) {
  const [planoBanco, setPlanoBanco] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    async function carregarPlano() {
      setCarregando(true);

      const { data, error } = await supabase
        .from("atividades_semanais")
        .select("*")
        .eq("faixa_etaria", planoKey)
        .eq("publicado", true)
        .order("semana", { ascending: false })
        .limit(1);

      if (!ativo) return;

      if (error) {
        console.error("Erro ao carregar planejamento:", error.message);
        setPlanoBanco(null);
      } else {
        setPlanoBanco(data?.[0] ?? null);
      }

      setCarregando(false);
    }

    carregarPlano();

    return () => {
      ativo = false;
    };
  }, [planoKey]);

  const planoLocal = WEEKLY_PLAN[planoKey];

  if (carregando && !planoLocal) {
    return <p>Carregando planejamento...</p>;
  }

  const plano = planoBanco
    ? {
        titulo: planoBanco.titulo,
        foco: planoBanco.foco,
        duracao: planoBanco.duracao,
        dica: planoBanco.dica,
        atencao: planoBanco.atencao,
        dias: Array.isArray(planoBanco.dias)
          ? planoBanco.dias
          : [],
      }
    : planoLocal;

  if (!plano) return null;

  return (
    <div style={{ marginTop: 16 }}>
      {carregando && (
        <p>Atualizando planejamento...</p>
      )}

      <div style={styles.devFaixaLabel}>
        {plano.titulo}
      </div>

      <div style={styles.devCardText}>
        {plano.foco}
      </div>

      <div style={styles.planoMeta}>
        <span style={styles.tag}>
          ⏱ {plano.duracao}
        </span>
      </div>

      {plano.dica && (
        <div style={styles.dicaBox}>
          <strong>Dica pedagógica:</strong> {plano.dica}
        </div>
      )}

      {plano.atencao && (
        <div style={styles.dicaBox}>
          <strong>Atenção:</strong> {plano.atencao}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 14,
        }}
      >
        {plano.dias.map((d, i) => (
          <details key={i} style={styles.diaCard}>
            <summary style={styles.diaSummary}>
              <span style={styles.diaDia}>
                {d.dia}
              </span>{" "}
              — {d.nome}
            </summary>

            <div style={{ marginTop: 8 }}>
              {d.imagem && (
                <img
                  src={d.imagem}
                  alt={d.nome}
                  style={styles.atvImg}
                />
              )}

              <div style={styles.devCardText}>
                <strong>Objetivo:</strong> {d.objetivo}
              </div>

              <div style={styles.devCardText}>
                <strong>Materiais:</strong> {d.materiais}
              </div>

              <div style={styles.devCardText}>
                <strong>Como brincar:</strong>
              </div>

              <ul style={styles.diaLista}>
                {(Array.isArray(d.comoBrincar)
                  ? d.comoBrincar
                  : []
                ).map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>

              <div style={styles.devCardText}>
                <strong>Desenvolve:</strong> {d.desenvolve}
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
