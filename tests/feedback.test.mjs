// Teste unitário da lógica de envio (sem rede). Rodar: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { montarLinha, traduzirErro, enviarFeedback } from "../src/feedback.js";

const ok = { nome: "  Maria Silva ", tipo: "Elogio", avaliacao: "5", texto: " Muito bom " };

test("monta a linha com os nomes de coluna do banco e aparas", () => {
  const { linha } = montarLinha(ok);
  assert.deepEqual(linha, { nome_professora: "Maria Silva", feedback: "Muito bom", tipo_feedback: "Elogio", avaliacao: 5 });
});

test("rejeita campos vazios, tipo e nota inválidos", () => {
  assert.ok(montarLinha({ ...ok, nome: " " }).erro);
  assert.ok(montarLinha({ ...ok, texto: "" }).erro);
  assert.ok(montarLinha({ ...ok, tipo: "Outro" }).erro);
  assert.ok(montarLinha({ ...ok, avaliacao: "9" }).erro);
});

test("insert sem select e sucesso", async () => {
  let chamado;
  const cliente = { from: (t) => ({ insert: async (l) => { chamado = { t, l }; return { error: null }; } }) };
  const r = await enviarFeedback(cliente, ok);
  assert.equal(r.ok, true);
  assert.equal(chamado.t, "feedbacks");
});

test("erro de RLS vira mensagem clara", async () => {
  const cliente = { from: () => ({ insert: async () => ({ error: { code: "42501", message: "new row violates row-level security policy" } }) }) };
  const r = await enviarFeedback(cliente, ok);
  assert.equal(r.ok, false);
  assert.match(r.mensagem, /permiss/i);
});

test("coluna errada e rede fora do ar", async () => {
  assert.match(traduzirErro({ code: "PGRST204" }), /coluna/i);
  const cliente = { from: () => ({ insert: async () => { throw new TypeError("Failed to fetch"); } }) };
  const r = await enviarFeedback(cliente, ok);
  assert.equal(r.ok, false);
  assert.match(r.mensagem, /conex/i);
});
