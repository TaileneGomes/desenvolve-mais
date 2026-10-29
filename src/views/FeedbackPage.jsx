
import { useEffect, useState } from "react";
import { styles } from "../estilos.js";
import { supabase } from "../supabase.js";
import { enviarFeedback, TIPOS, LIMITES } from "../feedback.js";

export default function FeedbackPage() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [avaliacao, setAvaliacao] = useState("5");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [feedbacks, setFeedbacks] = useState([]);
  const [carregandoFeedbacks, setCarregandoFeedbacks] = useState(true);
  const [erroFeedbacks, setErroFeedbacks] = useState("");

  async function carregarFeedbacks() {
    setCarregandoFeedbacks(true);
    setErroFeedbacks("");

    const { data, error } = await supabase
      .from("feedbacks")
      .select("id, nome_professora, feedback, tipo_feedback, avaliacao, criado_em")
      .eq("publicado", true)
      .eq("status", "aprovado")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("Erro ao carregar feedbacks:", error);
      setErroFeedbacks("Não foi possível carregar os feedbacks aprovados.");
      setFeedbacks([]);
    } else {
      setFeedbacks(data ?? []);
    }

    setCarregandoFeedbacks(false);
  }

  useEffect(() => {
    carregarFeedbacks();
  }, []);

  async function enviar(e) {
    e.preventDefault();

    if (enviando) return;

    setEnviando(true);
    setResultado(null);

    const r = await enviarFeedback(supabase, {
      nome,
      tipo,
      avaliacao,
      texto,
    });

    setResultado(r);
    setEnviando(false);

    if (r.ok) {
      setNome("");
      setTexto("");
    }
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <form
        onSubmit={enviar}
        style={{ ...styles.formCard, maxWidth: 620 }}
      >
        <div style={styles.formTitle}>Feedback das professoras</div>

        <div style={styles.devCardText}>
          Sua opinião ajuda a melhorar o Desenvolve+. Seu nome e seu
          comentário são enviados para a equipe do aplicativo. Os comentários
          só aparecem publicamente depois da aprovação da equipe.
        </div>

        <label style={styles.label} htmlFor="feedback-nome">
          Seu nome
        </label>
        <input
          id="feedback-nome"
          style={styles.input}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite seu nome"
          maxLength={LIMITES.nome}
          autoComplete="name"
          required
        />

        <label style={styles.label} htmlFor="feedback-tipo">
          Tipo de feedback
        </label>
        <select
          id="feedback-tipo"
          style={styles.input}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label style={styles.label} htmlFor="feedback-avaliacao">
          Como você avalia o aplicativo?
        </label>
        <select
          id="feedback-avaliacao"
          style={styles.input}
          value={avaliacao}
          onChange={(e) => setAvaliacao(e.target.value)}
        >
          <option value="5">5 — Excelente</option>
          <option value="4">4 — Muito bom</option>
          <option value="3">3 — Bom</option>
          <option value="2">2 — Pode melhorar</option>
          <option value="1">1 — Precisa melhorar bastante</option>
        </select>

        <label style={styles.label} htmlFor="feedback-texto">
          Comentário
        </label>
        <textarea
          id="feedback-texto"
          style={{
            ...styles.input,
            minHeight: 110,
            resize: "vertical",
          }}
          placeholder="O que funcionou? O que poderia melhorar?"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          maxLength={LIMITES.texto}
          required
        />

        <div>
          <button
            type="submit"
            disabled={enviando}
            style={{
              ...styles.primaryBtn,
              opacity: enviando ? 0.6 : 1,
            }}
          >
            {enviando ? "Enviando…" : "Enviar feedback"}
          </button>
        </div>

        {resultado && (
          <div
            role={resultado.ok ? "status" : "alert"}
            style={styles.dicaBox}
          >
            {resultado.mensagem}
          </div>
        )}
      </form>

      <section style={{ ...styles.formCard, maxWidth: 800 }}>
        <div style={styles.formTitle}>O que as professoras dizem</div>

        <p style={styles.devCardText}>
          Somente feedbacks aprovados pela equipe aparecem nesta seção.
        </p>

        <button
          type="button"
          onClick={carregarFeedbacks}
          disabled={carregandoFeedbacks}
          style={styles.primaryBtn}
        >
          {carregandoFeedbacks ? "Atualizando…" : "Atualizar feedbacks"}
        </button>

        {carregandoFeedbacks && <p>Carregando feedbacks...</p>}

        {erroFeedbacks && (
          <p role="alert">{erroFeedbacks}</p>
        )}

        {!carregandoFeedbacks &&
          !erroFeedbacks &&
          feedbacks.length === 0 && (
            <p>Ainda não há feedbacks aprovados para exibir.</p>
          )}

        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {feedbacks.map((item) => (
            <article
              key={item.id}
              style={{
                padding: 16,
                border: "1px solid #d9e2dc",
                borderRadius: 12,
                background: "#ffffff",
              }}
            >
              <strong>{item.nome_professora}</strong>

              <p style={{ margin: "10px 0" }}>{item.feedback}</p>

              <p style={{ margin: "6px 0", fontSize: 14 }}>
                Tipo: {item.tipo_feedback}
                {" · "}
                Avaliação: {item.avaliacao}/5
              </p>

              {item.criado_em && (
                <small>
                  {new Date(item.criado_em).toLocaleDateString("pt-BR")}
                </small>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
