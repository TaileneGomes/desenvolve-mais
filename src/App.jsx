import { useState } from "react";
import { FONTS, styles } from "./estilos.js";
import { DEV_TABLE } from "./conteudo/marcos.js";
import { PLANO_OPCOES } from "./conteudo/planoSemanal.js";
import { LINGUAGEM_CONCEITOS } from "./conteudo/linguagem.js";
import DevelopmentTab from "./componentes/DevelopmentTab.jsx";
import WeeklyPlanTab from "./componentes/WeeklyPlanTab.jsx";
import FeedbackPage from "./views/FeedbackPage.jsx";
import Admin from "./Admin.jsx";

// Navegação e telas de consulta. Texto das telas mantido como no código enviado.
export default function App() {
  const [view, setView] = useState("conceito");
  const [faixaKey, setFaixaKey] = useState("6-11m");
  const faixa = DEV_TABLE.find(f => f.key === faixaKey) || DEV_TABLE[0];
  const meses = faixa.minMeses;
  // Aba de atividades tem seletor próprio: só as 3 faixas que possuem plano.
  const [planoKey, setPlanoKey] = useState(PLANO_OPCOES[0].key);

  const nav = [
    { key: "conceito", label: "Conceito de linguagem", icon: "🗣️" },
    { key: "marcos", label: "Marcos do desenvolvimento", icon: "🌱" },
    { key: "atividades", label: "Atividades da semana", icon: "🎲" },
    { key: "feedback", label: "Feedback", icon: "💬" },
    { key: "admin", label: "Admin", icon: "🔐" },
  ];

  return (
    <div style={styles.page}>
      <style>{FONTS}{`html { scroll-behavior: smooth; } @media (max-width: 600px) { .dm-nav { display:grid !important; grid-template-columns:1fr 1fr; } .dm-main { padding:16px !important; } }`}</style>
      <div style={styles.shell}>
        <header style={styles.sidebar}>
          <div style={styles.topBar}>
            <div style={{ ...styles.brand, marginBottom: 0 }}><span style={styles.brandMark}>🌱</span><span style={styles.brandName}>Desenvolve+</span></div>
            <div style={{ color: "#7A8C7F", fontSize: 13 }}>Linguagem e desenvolvimento infantil</div>
          </div>
          <nav className="dm-nav" aria-label="Navegação principal" style={{ ...styles.topActions, marginTop: 18 }}>
            {nav.map(item => <button key={item.key} style={{ ...styles.navBtn, ...(view === item.key ? styles.navBtnActive : {}), minHeight: 42 }} onClick={() => setView(item.key)}>{item.icon} {item.label}</button>)}
          </nav>
        </header>

        <main className="dm-main" style={styles.main}>
          {view !== "feedback" && <div style={{ marginBottom: 18 }}>
            <div style={styles.pageTitle}>{nav.find(n => n.key === view)?.label}</div>
            <div style={styles.pageSub}>Material de consulta para apoiar o planejamento pedagógico. Use as informações como referência e considere as características de cada criança.</div>
          </div>}

          {view === "conceito" && <div>
            <div style={styles.devSugestao}>
              <div style={styles.devCardTitle}>A linguagem é muito mais do que falar</div>
              <div style={styles.devCardText}>A linguagem é uma forma de expressar, compreender e compartilhar ideias, necessidades, sentimentos e experiências. Ela pode acontecer pela fala, pelos gestos, pelo olhar, pelas expressões faciais, por imagens, sinais, desenhos, leitura e escrita.</div>
              <div style={styles.devCardText}>Na Educação Infantil, observe como a criança busca interação, responde ao outro, aponta, imita, vocaliza, brinca, compreende e comunica suas intenções — não apenas quantas palavras pronuncia.</div>
            </div>
            <div style={styles.devFaixaLabel}>Conceitos do material de referência</div>
            <div style={{ display: "grid", gap: 10 }}>
              {LINGUAGEM_CONCEITOS.map((c, i) => <article key={i} style={styles.devCard}>
                <div style={styles.devCardText}>{c.texto}</div>
                {c.citacao && <div style={styles.conceitoAutor}>{c.citacao}</div>}
              </article>)}
            </div>
            <div style={styles.dicaBox}>Nota acadêmica: confira as referências originais das citações antes da entrega final. Este aplicativo é um apoio pedagógico e não substitui avaliação de profissionais habilitados.</div>
          </div>}

          {view === "marcos" && <div>
            <label style={styles.label} htmlFor="faixa-marcos">Selecione a faixa etária</label>
            <select id="faixa-marcos" style={{ ...styles.input, maxWidth: 360, marginBottom: 16 }} value={faixaKey} onChange={e => setFaixaKey(e.target.value)}>
              {DEV_TABLE.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
            <DevelopmentTab meses={meses} />
          </div>}

          {view === "atividades" && <div>
            <label style={styles.label} htmlFor="faixa-atividades">Selecione a faixa etária</label>
            <select id="faixa-atividades" style={{ ...styles.input, maxWidth: 360, marginBottom: 16 }} value={planoKey} onChange={e => setPlanoKey(e.target.value)}>
              {PLANO_OPCOES.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
            </select>
            <WeeklyPlanTab planoKey={planoKey} />
          </div>}

          {view === "feedback" && <FeedbackPage />}
          {view === "admin" && (<Admin onVoltar={() => setView("conceito")} />
)}

            
        </main>
      </div>
      <footer style={styles.disclaimer}>Desenvolve+ · Apoio à consulta pedagógica sobre linguagem e desenvolvimento infantil.<div style={{ marginTop: 4 }}>Desenvolvimento do aplicativo: Tailene Gomes.</div></footer>
    </div>
  );
}