# Desenvolve+

Apoio pedagógico à linguagem e ao desenvolvimento infantil. Desenvolvimento do aplicativo: Tailene Gomes.
Tabela de marcos e plano semanal: Diessica e turma.

## Rodar no VS Code
Requisitos: **Node 20.19 ou superior** (`node -v`). Baixe em https://nodejs.org (versão LTS).

1. Abra **esta pasta** (a que contém `package.json` e `index.html`) com *File > Open Folder*.
   Não abra a pasta de fora: ela não tem `index.html` e o navegador mostra "404".
2. Terminal do VS Code (`Ctrl+'`):
   ```
   npm install
   npm run dev
   ```
3. Abra o endereço mostrado (normalmente http://localhost:5173).

Se mudar o `.env`, pare (`Ctrl+C`) e rode `npm run dev` de novo.

## Banco de dados (Supabase)
- Só a aba **Feedback** usa o banco: grava em `public.feedbacks` (colunas `nome_professora`, `feedback`, `tipo_feedback`, `avaliacao`).
- **Dados de alunos nunca são enviados** (o código dos alunos está desativado nesta versão; se for reativado, fica só no aparelho).
- Antes do primeiro envio real, rode `supabase/feedbacks.sql` no SQL Editor do Supabase.
- A chave em `src/supabase.js`/`.env` é a *publishable* (pública por desenho). Nunca coloque a *secret*.

## Testes
```
npm test                       # lógica do envio (sem rede)
npm run build && npm run test:e2e   # navegador + Supabase simulado (precisa do Chromium: defina CHROMIUM_PATH)
```

## Estrutura
- `src/conteudo/` textos do material (marcos, plano semanal, conceitos) — **não reescrever sem conferir com o documento**.
- `src/feedback.js` regra de envio; `src/supabase.js` cliente; `src/views/FeedbackPage.jsx` tela.
- Desativados (código preservado, fora da navegação): Hoje/Alunos (`views/HojeView.jsx`, `componentes/StudentForm.jsx`, `util.js`, `armazenamento.js`, `conteudo/dificuldades.js`, `conteudo/dadosExemplo.js`). O banco de sugestões por dificuldade foi escrito por IA, sem fonte: não publicar sem revisão profissional.
