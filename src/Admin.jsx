
import { useState } from "react";
import { supabase } from "./supabase";

export default function Admin({ onVoltar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setMensagem("Não foi possível entrar. Confira o e-mail e a senha.");
      setCarregando(false);
      return;
    }

    const { data: admin, error: erroAdmin } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (erroAdmin || !admin) {
      await supabase.auth.signOut();
      setMensagem("Este usuário não tem permissão de administrador.");
      setCarregando(false);
      return;
    }

    setUsuario(data.user);
    setCarregando(false);
  }

  async function sair() {
    await supabase.auth.signOut();
    setUsuario(null);
    setEmail("");
    setSenha("");
  }

  if (!usuario) {
    return (
      <section style={{ maxWidth: 420, margin: "30px auto" }}>
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
            style={{ display: "block", width: "100%", padding: 10, margin: "8px 0 16px" }}
          />

          <label htmlFor="admin-senha">Senha</label>
          <input
            id="admin-senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ display: "block", width: "100%", padding: 10, margin: "8px 0 16px" }}
          />

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {mensagem && <p role="alert">{mensagem}</p>}

        {onVoltar && (
          <button type="button" onClick={onVoltar} style={{ marginTop: 12 }}>
            Voltar ao aplicativo
          </button>
        )}
      </section>
    );
  }

  return (
    <section style={{ padding: 20 }}>
      <h2>Painel administrativo</h2>
      <p>Login realizado: {usuario.email}</p>
      <p>Próxima etapa: gerenciamento das atividades e feedbacks.</p>

      {mensagem && <p role="alert">{mensagem}</p>}

      <button onClick={sair}>Sair</button>
      {onVoltar && (
        <button onClick={onVoltar} style={{ marginLeft: 8 }}>
          Voltar ao aplicativo
        </button>
      )}
    </section>
  );
}
