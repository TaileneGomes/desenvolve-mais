import { useState } from "react";
import { styles } from "../estilos.js";
import { supabase } from "../supabase.js";
import { enviarFeedback, TIPOS, LIMITES } from "../feedback.js";

// Aba de feedback: grava na tabela public.feedbacks do Supabase.
// Não lista feedbacks de outras pessoas (o público só tem permissão de INSERT).
export default function FeedbackPage() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState(TIPOS[0]);
  const [avaliacao, setAvaliacao] = useState("5");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null); // { ok, mensagem }

  const enviar = async (e) => {
    e.preventDefault();
    if (enviando) return; // evita duplo clique gravar duas linhas
    setEnviando(true);
    setResultado(null);
    const r = await enviarFeedback(supabase, { nome, tipo, avaliacao, texto });
    setResultado(r);
    setEnviando(false);
    // Só limpa o formulário se gravou; se falhou, a professora não perde o texto.
    if (r.ok) { setNome(""); setTexto(""); }
  };

  return (
    <form onSubmit={enviar} style={{ ...styles.formCard, maxWidth: 620 }}>
      <div style={styles.formTitle}>Feedback das professoras</div>
      <div style={styles.devCardText}>Sua opinião ajuda a melhorar o Desenvolve+. Seu nome e seu comentário são enviados para a equipe do aplicativo.</div>

      <label style={styles.label} htmlFor="feedback-nome">Seu nome</label>
      <input id="feedback-nome" style={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Digite seu nome" maxLength={LIMITES.nome} autoComplete="name" />

      <label style={styles.label} htmlFor="feedback-tipo">Tipo de feedback</label>
      <select id="feedback-tipo" style={styles.input} value={tipo} onChange={(e) => setTipo(e.target.value)}>
        {TIPOS.map((t) => <option key={t}>{t}</option>)}
      </select>

      <label style={styles.label} htmlFor="feedback-avaliacao">Como você avalia o aplicativo?</label>
      <select id="feedback-avaliacao" style={styles.input} value={avaliacao} onChange={(e) => setAvaliacao(e.target.value)}>
        <option value="5">5 — Excelente</option>
        <option value="4">4 — Muito bom</option>
        <option value="3">3 — Bom</option>
        <option value="2">2 — Pode melhorar</option>
        <option value="1">1 — Precisa melhorar bastante</option>
      </select>

      <label style={styles.label} htmlFor="feedback-texto">Comentário</label>
      <textarea id="feedback-texto" style={{ ...styles.input, minHeight: 110, resize: "vertical" }} placeholder="O que funcionou? O que poderia melhorar?" value={texto} onChange={(e) => setTexto(e.target.value)} maxLength={LIMITES.texto} />

      <div>
        <button type="submit" disabled={enviando} style={{ ...styles.primaryBtn, opacity: enviando ? 0.6 : 1 }}>
          {enviando ? "Enviando…" : "Enviar feedback"}
        </button>
      </div>
      {resultado && (
        <div role={resultado.ok ? "status" : "alert"} style={styles.dicaBox}>
          {resultado.mensagem}
        </div>
      )}
    </form>
  );
}
