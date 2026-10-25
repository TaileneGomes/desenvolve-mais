import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Monta o app; se algo falhar na montagem, mostra mensagem em vez de tela branca.
const raiz = document.getElementById("root");
if (!raiz) throw new Error("Elemento #root não encontrado no index.html.");

try {
  createRoot(raiz).render(<React.StrictMode><App /></React.StrictMode>);
} catch (erro) {
  console.error("Não foi possível iniciar o Desenvolve+:", erro);
  raiz.innerHTML = '<main style="font-family:sans-serif;padding:2rem"><h1>Não foi possível abrir o aplicativo</h1><p>Veja o erro no terminal do VS Code.</p></main>';
}
