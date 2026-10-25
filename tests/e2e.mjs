// Teste ponta a ponta: sobe o build, abre no navegador, simula a API do Supabase
// (sucesso, RLS negado, coluna errada) e confere a tela. Rodar: npm run build && npm run test:e2e
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import assert from "node:assert/strict";

const PORTA = 4399;
const servidor = spawn("npx", ["vite", "preview", "--port", String(PORTA), "--strictPort"], { stdio: "ignore" });
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
await esperar(2500);

const exe = process.env.CHROMIUM_PATH || undefined;
const browser = await chromium.launch({ executablePath: exe, args: ["--no-sandbox"] });
let falhas = 0;
const passo = async (nome, fn) => { try { await fn(); console.log("OK  ", nome); } catch (e) { falhas++; console.log("FALHA", nome, "\n     ", e.message); } };

async function novaPagina(respostaApi) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const erros = []; const posts = [];
  page.on("pageerror", (e) => erros.push(e.message));
  await page.route("**/rest/v1/feedbacks**", async (route) => {
    posts.push({ metodo: route.request().method(), corpo: route.request().postDataJSON?.(), prefer: route.request().headers()["prefer"] });
    await route.fulfill(respostaApi);
  });
  await page.goto(`http://localhost:${PORTA}/`);
  return { page, erros, posts };
}
async function preencher(page) {
  await page.getByRole("button", { name: /Feedback/ }).click();
  await page.fill("#feedback-nome", "Maria Silva");
  await page.selectOption("#feedback-tipo", "Elogio");
  await page.fill("#feedback-texto", "A atividade foi muito interessante");
  await page.getByRole("button", { name: "Enviar feedback" }).click();
}

await passo("app abre e mostra as 4 abas, sem erro de JS", async () => {
  const { page, erros } = await novaPagina({ status: 201, body: "" });
  await page.getByText("Conceito de linguagem").first().waitFor();
  for (const n of ["Marcos do desenvolvimento", "Atividades da semana", "Feedback"]) await page.getByRole("button", { name: new RegExp(n) }).waitFor();
  assert.deepEqual(erros, []);
  await page.close();
});

await passo("envio com sucesso: POST correto, sem pedir retorno, formulário limpo", async () => {
  const { page, posts } = await novaPagina({ status: 201, body: "" });
  await preencher(page);
  await page.getByText("Feedback enviado").waitFor();
  assert.equal(posts.length, 1);
  assert.equal(posts[0].metodo, "POST");
  assert.deepEqual(posts[0].corpo, { nome_professora: "Maria Silva", feedback: "A atividade foi muito interessante", tipo_feedback: "Elogio", avaliacao: 5 });
  assert.ok(!/return=representation/.test(posts[0].prefer || ""), "não deve pedir representação (exige SELECT)");
  assert.equal(await page.inputValue("#feedback-nome"), "");
  await page.close();
});

await passo("RLS negado (42501): mostra erro e preserva o texto digitado", async () => {
  const { page } = await novaPagina({ status: 401, contentType: "application/json", body: JSON.stringify({ code: "42501", message: 'new row violates row-level security policy for table "feedbacks"' }) });
  await preencher(page);
  await page.getByText(/permissão/).waitFor();
  assert.equal(await page.inputValue("#feedback-nome"), "Maria Silva");
  await page.close();
});

await passo("coluna inexistente (PGRST204): mensagem de coluna", async () => {
  const { page } = await novaPagina({ status: 400, contentType: "application/json", body: JSON.stringify({ code: "PGRST204", message: "Could not find the 'avaliacao' column" }) });
  await preencher(page);
  await page.getByText(/coluna/).waitFor();
  await page.close();
});

await passo("servidor fora do ar: mensagem de conexão", async () => {
  const { page } = await novaPagina({ status: 200, body: "" });
  await page.unroute("**/rest/v1/feedbacks**");
  await page.route("**/rest/v1/feedbacks**", (r) => r.abort("failed"));
  await preencher(page);
  await page.getByText(/conexão/).waitFor();
  await page.close();
});

await passo("campos vazios: valida antes de chamar a rede", async () => {
  const { page, posts } = await novaPagina({ status: 201, body: "" });
  await page.getByRole("button", { name: /Feedback/ }).click();
  await page.getByRole("button", { name: "Enviar feedback" }).click();
  await page.getByText(/Preencha seu nome/).waitFor();
  assert.equal(posts.length, 0);
  await page.close();
});

await browser.close(); servidor.kill();
console.log(falhas ? `\n${falhas} falha(s)` : "\nTodos os passos passaram");
process.exit(falhas ? 1 : 0);
