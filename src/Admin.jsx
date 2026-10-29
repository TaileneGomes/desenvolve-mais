
import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";

const FAIXAS = [
  { value: "6-11m", label: "6 meses a 1 ano" },
  { value: "2-3a", label: "2 a 3 anos" },
  { value: "4-5a", label: "4 a 5 anos" },
];

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const NOVO_DIA = (dia) => ({
  dia,
  nome: "",
  objetivo: "",
  materiais: "",
  comoBrincar: [""],
  desenvolve: "",
});

const NOVO_FORM = () => ({
  id: null,
  faixa_etaria: "6-11m",
  semana: 1,
  titulo: "",
  foco: "",
  duracao: "",
  dica: "",
  atencao: "",
  dias: DIAS.map(NOVO_DIA),
  publicado: false,
});

function normalizarDia(dia, indice) {
  let passos = dia?.comoBrincar;

  if (Array.isArray(passos)) {
    passos = passos;
  } else {
    passos = String(passos || "")
      .split("\n")
      .filter((passo) => passo.trim());
  }

  return {
    ...NOVO_DIA(DIAS[indice] || dia?.dia || ""),
    ...dia,
    dia: DIAS[indice] || dia?.dia || "",
    nome: dia?.nome || "",
    objetivo: dia?.objetivo || "",
    materiais: dia?.materiais || "",
    comoBrincar: passos,
    desenvolve: dia?.desenvolve || "",
  };
}

export default function Admin({ onVoltar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [atividades, setAtividades] = useState([]);
  const [form, setForm] = useState(NOVO_FORM());
  const [salvando, setSalvando] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [carregandoFeedbacks, setCarregandoFeedbacks] = useState(false);

  const estiloInput = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: 10,
    margin: "6px 0 14px",
    border: "1px solid #ccd5ce",
    borderRadius: 8,
  };

  const estiloBotao = {
    padding: "9px 13px",
    margin: "4px 6px 4px 0",
    borderRadius: 8,
    border: "1px solid #cbd5cc",
    cursor: "pointer",
  };

  async function entrar(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

      if (error) {
        setMensagem(
          "Não foi possível entrar. Confira o e-mail e a senha."
        );
        return;
      }

      const { data: admin, error: erroAdmin } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (erroAdmin || !admin) {
        await supabase.auth.signOut();
        setMensagem(
          "Este usuário não tem permissão de administrador."
        );
        return;
      }

      setUsuario(data.user);
    } catch (erro) {
      setMensagem("Erro ao entrar: " + erro.message);
    } finally {
      setCarregando(false);
    }
  }

  async function carregarAtividades() {
    setMensagem("Carregando atividades...");

    const { data, error } = await supabase
      .from("atividades_semanais")
      .select("*")
      .order("faixa_etaria")
      .order("semana");

    if (error) {
      setMensagem(
        "Erro ao carregar atividades: " + error.message
      );
      return;
    }

    setAtividades(data || []);
    setMensagem("");
  }

  useEffect(() => {
    if (usuario) {
      carregarAtividades();
      carregarFeedbacks();
    }
  }, [usuario]);

  async function carregarFeedbacks() {
    setCarregandoFeedbacks(true);
    const { data, error } = await supabase
      .from("feedbacks")
      .select("id, nome_professora, feedback, criado_em, tipo_feedback, avaliacao, atividade, publicado, status")
      .order("criado_em", { ascending: false });

    if (error) {
      setMensagem("Erro ao carregar feedbacks: " + error.message);
    } else {
      setFeedbacks(data || []);
    }
    setCarregandoFeedbacks(false);
  }

  async function moderarFeedback(item, novoStatus) {
    const aprovado = novoStatus === "aprovado";
    const { error } = await supabase
      .from("feedbacks")
      .update({ status: novoStatus, publicado: aprovado })
      .eq("id", item.id);

    if (error) {
      setMensagem("Erro ao atualizar feedback: " + error.message);
      return;
    }

    setMensagem(
      aprovado
        ? "Feedback aprovado e publicado."
        : novoStatus === "rejeitado"
          ? "Feedback rejeitado e mantido oculto."
          : "Feedback voltou para pendente."
    );
    await carregarFeedbacks();
  }

  function editarAtividade(item) {
    const dias = Array.isArray(item.dias) && item.dias.length
      ? item.dias.map((dia, indice) =>
          normalizarDia(dia, indice)
        )
      : DIAS.map(NOVO_DIA);

    setForm({
      ...NOVO_FORM(),
      ...item,
      semana: item.semana || 1,
      dias,
      publicado: Boolean(item.publicado),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function atualizarDia(indice, campo, valor) {
    setForm((atual) => ({
      ...atual,
      dias: atual.dias.map((dia, i) =>
        i === indice
          ? { ...dia, [campo]: valor }
          : dia
      ),
    }));
  }

  function atualizarPassos(indice, valor) {
    atualizarDia(
      indice,
      "comoBrincar",
      valor.split("\n")
    );
  }

  async function salvar(e) {
    e.preventDefault();
    setSalvando(true);
    setMensagem("");

    try {
      const registro = {
        faixa_etaria: form.faixa_etaria,
        semana: String(form.semana),
        titulo: form.titulo.trim(),
        foco: form.foco.trim(),
        duracao: form.duracao.trim(),
        dica: form.dica.trim(),
        atencao: form.atencao.trim(),

        dias: form.dias.map((dia, indice) => {
          const diaNormalizado = normalizarDia(
            dia,
            indice
          );

          return {
            dia: diaNormalizado.dia,
            nome: diaNormalizado.nome,
            objetivo: diaNormalizado.objetivo,
            materiais: diaNormalizado.materiais,
            comoBrincar:
              diaNormalizado.comoBrincar.filter(
                (passo) => String(passo).trim()
              ),
            desenvolve: diaNormalizado.desenvolve,
          };
        }),

        publicado: Boolean(form.publicado),
        atualizado_em: new Date().toISOString(),
      };

      const resultado = form.id
        ? await supabase
            .from("atividades_semanais")
            .update(registro)
            .eq("id", form.id)
        : await supabase
            .from("atividades_semanais")
            .insert(registro);

      if (resultado.error) {
        setMensagem(
          "Erro ao salvar: " + resultado.error.message
        );
        return;
      }

      setForm(NOVO_FORM());
      setMensagem("Planejamento salvo com sucesso!");

      await carregarAtividades();
    } catch (erro) {
      setMensagem("Erro ao salvar: " + erro.message);
    } finally {
      setSalvando(false);
    }
  }

  async function alterarPublicacao(item) {
    const { error } = await supabase
      .from("atividades_semanais")
      .update({
        publicado: !item.publicado,
        atualizado_em: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (error) {
      setMensagem(
        "Erro ao alterar publicação: " + error.message
      );
      return;
    }

    setMensagem(
      item.publicado
        ? "Planejamento despublicado."
        : "Planejamento publicado."
    );

    await carregarAtividades();
  }

  async function excluir(item) {
    const confirmar = window.confirm(
      `Excluir o planejamento "${item.titulo}"? ` +
      "Essa ação não pode ser desfeita."
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("atividades_semanais")
      .delete()
      .eq("id", item.id);

    if (error) {
      setMensagem("Erro ao excluir: " + error.message);
      return;
    }

    if (form.id === item.id) {
      setForm(NOVO_FORM());
    }

    setMensagem("Planejamento excluído.");
    await carregarAtividades();
  }

  async function sair() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMensagem("Erro ao sair: " + error.message);
      return;
    }

    setUsuario(null);
    setEmail("");
    setSenha("");
    setAtividades([]);
    setForm(NOVO_FORM());
    setMensagem("");
  }

  if (!usuario) {
    return (
      <section
        style={{
          maxWidth: 420,
          margin: "30px auto",
        }}
      >
        <h2>Área administrativa</h2>
        <p>Entre com seu usuário administrador.</p>

        <form onSubmit={entrar}>
          <label htmlFor="admin-email">E-mail</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={estiloInput}
          />

          <label htmlFor="admin-senha">Senha</label>
          <input
            id="admin-senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={estiloInput}
          />

          <button
            type="submit"
            disabled={carregando}
            style={estiloBotao}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {mensagem && (
          <p role="alert">{mensagem}</p>
        )}

        {onVoltar && (
          <button
            type="button"
            onClick={onVoltar}
            style={estiloBotao}
          >
            Voltar ao aplicativo
          </button>
        )}
      </section>
    );
  }

  return (
    <section
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <h2>Painel administrativo</h2>
      <p>Login realizado: {usuario.email}</p>

      {mensagem && (
        <p role="status">{mensagem}</p>
      )}

      <form onSubmit={salvar}>
        <h3>
          {form.id
            ? "Editar planejamento"
            : "Cadastrar planejamento"}
        </h3>

        <label>Faixa etária</label>
        <select
          value={form.faixa_etaria}
          onChange={(e) =>
            atualizarCampo("faixa_etaria", e.target.value)
          }
          style={estiloInput}
        >
          {FAIXAS.map((faixa) => (
            <option
              key={faixa.value}
              value={faixa.value}
            >
              {faixa.label}
            </option>
          ))}
        </select>

        <label>Número da semana</label>
        <input
          type="number"
          min="1"
          required
          value={form.semana}
          onChange={(e) =>
            atualizarCampo("semana", e.target.value)
          }
          style={estiloInput}
        />

        <label>Título do planejamento</label>
        <input
          required
          value={form.titulo}
          onChange={(e) =>
            atualizarCampo("titulo", e.target.value)
          }
          style={estiloInput}
        />

        <label>Foco pedagógico</label>
        <textarea
          required
          value={form.foco}
          onChange={(e) =>
            atualizarCampo("foco", e.target.value)
          }
          style={estiloInput}
          rows={3}
        />

        <label>Duração sugerida</label>
        <input
          value={form.duracao}
          onChange={(e) =>
            atualizarCampo("duracao", e.target.value)
          }
          style={estiloInput}
          placeholder="Ex.: 10 a 15 minutos"
        />

        <label>Dica pedagógica</label>
        <textarea
          value={form.dica}
          onChange={(e) =>
            atualizarCampo("dica", e.target.value)
          }
          style={estiloInput}
          rows={3}
        />

        <label>Atenção / segurança</label>
        <textarea
          value={form.atencao}
          onChange={(e) =>
            atualizarCampo("atencao", e.target.value)
          }
          style={estiloInput}
          rows={3}
        />

        <h3>Atividades de segunda a sexta</h3>

        {form.dias.map((dia, i) => (
          <fieldset
            key={DIAS[i]}
            style={{
              border: "1px solid #d6dfd8",
              borderRadius: 10,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <legend>{DIAS[i]}</legend>

            <label>Nome da atividade</label>
            <input
              required
              value={dia.nome || ""}
              onChange={(e) =>
                atualizarDia(i, "nome", e.target.value)
              }
              style={estiloInput}
            />

            <label>Objetivo</label>
            <textarea
              value={dia.objetivo || ""}
              onChange={(e) =>
                atualizarDia(
                  i,
                  "objetivo",
                  e.target.value
                )
              }
              style={estiloInput}
              rows={2}
            />

            <label>Materiais</label>
            <textarea
              value={dia.materiais || ""}
              onChange={(e) =>
                atualizarDia(
                  i,
                  "materiais",
                  e.target.value
                )
              }
              style={estiloInput}
              rows={2}
            />

            <label>
              Como brincar (um passo por linha)
            </label>
            <textarea
              value={(dia.comoBrincar || []).join("\n")}
              onChange={(e) =>
                atualizarPassos(i, e.target.value)
              }
              style={estiloInput}
              rows={4}
            />

            <label>O que desenvolve</label>
            <textarea
              value={dia.desenvolve || ""}
              onChange={(e) =>
                atualizarDia(
                  i,
                  "desenvolve",
                  e.target.value
                )
              }
              style={estiloInput}
              rows={2}
            />
          </fieldset>
        ))}

        <label>
          <input
            type="checkbox"
            checked={form.publicado}
            onChange={(e) =>
              atualizarCampo(
                "publicado",
                e.target.checked
              )
            }
          />{" "}
          Publicar este planejamento para o público
        </label>

        <div style={{ marginTop: 16 }}>
          <button
            type="submit"
            disabled={salvando}
            style={estiloBotao}
          >
            {salvando
              ? "Salvando..."
              : form.id
                ? "Salvar alterações"
                : "Cadastrar planejamento"}
          </button>

          {form.id && (
            <button
              type="button"
              onClick={() => setForm(NOVO_FORM())}
              style={estiloBotao}
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "28px 0" }} />

      <h3>
        Planejamentos cadastrados ({atividades.length})
      </h3>

      <button
        type="button"
        onClick={carregarAtividades}
        style={estiloBotao}
      >
        Atualizar lista
      </button>

      {atividades.length === 0 && (
        <p>Nenhum planejamento cadastrado ainda.</p>
      )}

      {atividades.map((item) => (
        <article
          key={item.id}
          style={{
            border: "1px solid #d6dfd8",
            borderRadius: 10,
            padding: 14,
            margin: "12px 0",
          }}
        >
          <strong>{item.titulo}</strong>

          <p>
            {FAIXAS.find(
              (faixa) =>
                faixa.value === item.faixa_etaria
            )?.label || item.faixa_etaria}{" "}
            · Semana {item.semana}
          </p>

          <p>
            Status:{" "}
            {item.publicado ? "Publicado" : "Rascunho"}
          </p>

          <button
            type="button"
            onClick={() => editarAtividade(item)}
            style={estiloBotao}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => alterarPublicacao(item)}
            style={estiloBotao}
          >
            {item.publicado ? "Despublicar" : "Publicar"}
          </button>

          <button
            type="button"
            onClick={() => excluir(item)}
            style={estiloBotao}
          >
            Excluir
          </button>
        </article>
      ))}

      <hr style={{ margin: "28px 0" }} />

      <h3>Moderação de feedbacks ({feedbacks.length})</h3>
      <p>Somente feedbacks aprovados devem ficar visíveis no aplicativo público.</p>
      <button
        type="button"
        onClick={carregarFeedbacks}
        disabled={carregandoFeedbacks}
        style={estiloBotao}
      >
        {carregandoFeedbacks ? "Atualizando..." : "Atualizar feedbacks"}
      </button>

      {!carregandoFeedbacks && feedbacks.length === 0 && (
        <p>Nenhum feedback encontrado.</p>
      )}

      {feedbacks.map((item) => (
        <article
          key={item.id}
          style={{
            border: "1px solid #d6dfd8",
            borderRadius: 10,
            padding: 14,
            margin: "12px 0",
          }}
        >
          <strong>{item.nome_professora || "Nome não informado"}</strong>
          <p>{item.feedback}</p>
          <p>
            Tipo: {item.tipo_feedback || "Não informado"} · Avaliação: {item.avaliacao ?? "Não informada"}/5
          </p>
          {item.atividade && <p>Atividade: {item.atividade}</p>}
          <p>
            Recebido em: {item.criado_em ? new Date(item.criado_em).toLocaleString("pt-BR") : "Data não informada"}
          </p>
          <p>
            Status: {item.status || (item.publicado ? "aprovado" : "pendente")}
          </p>
          <button
            type="button"
            onClick={() => moderarFeedback(item, "aprovado")}
            style={estiloBotao}
          >
            Aprovar e publicar
          </button>
          <button
            type="button"
            onClick={() => moderarFeedback(item, "rejeitado")}
            style={estiloBotao}
          >
            Rejeitar
          </button>
          {(item.status === "aprovado" || item.publicado) && (
            <button
              type="button"
              onClick={() => moderarFeedback(item, "pendente")}
              style={estiloBotao}
            >
              Despublicar / voltar para pendente
            </button>
          )}
        </article>
      ))}

      <hr style={{ margin: "28px 0" }} />

      <button
        type="button"
        onClick={sair}
        style={estiloBotao}
      >
        Sair
      </button>

      {onVoltar && (
        <button
          type="button"
          onClick={onVoltar}
          style={estiloBotao}
        >
          Voltar ao aplicativo
        </button>
      )}
    </section>
  );
}
