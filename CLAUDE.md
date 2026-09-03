# JR Motos — Contexto do projeto

Estou criando o site da JR Motos, uma oficina de motos que também vende motos
usadas. Já tenho o projeto Next.js (App Router + TypeScript + Tailwind) criado
e um arquivo Supabase configurado em `.env.local`
(`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`).

Há um mockup em HTML/CSS puro em `mockup/jr-motos-mockup-v2-canto-cortado.html`
que já define o visual que eu quero: paleta, tipografia (Oswald + Inter via
Google Fonts), o painel diagonal vermelho do hero, os botões com canto cortado
(clip-path) e o grid de cards de moto. Use esse arquivo como referência fiel
de design — não invente um visual novo, apenas recrie fielmente em componentes
React/Tailwind.

## O que preciso que você construa

### 1. Estrutura de páginas
- `/` — home: header fixo, hero, seção de serviços, "motos em destaque"
  (3 mais recentes), seção sobre/localização, footer, botão flutuante de
  WhatsApp
- `/motos` — grid com todas as motos cadastradas
- `/admin` — protegida por senha simples (variável de ambiente
  `ADMIN_PASSWORD`, sem tabela de usuários, é uso pessoal do meu pai)

### 2. Banco de dados no Supabase
Criar a tabela `motos` com:
- `id` (uuid, pk)
- `titulo` (text)
- `ano` (int)
- `km` (int)
- `preco` (numeric)
- `descricao` (text)
- `fotos` (text[], urls do Supabase Storage)
- `status` (text: `'disponivel'` | `'vendida'`)
- `criado_em` (timestamp default now())

### 3. Painel /admin
- Login com campo de senha único (compara com `ADMIN_PASSWORD`)
- Lista de motos cadastradas com botões "Editar", "Marcar como vendida" e
  "Remover"
- Formulário "Anunciar moto nova": título, ano, km, preço, descrição, upload
  múltiplo de fotos (Supabase Storage), botão "Publicar"
- **IMPORTANTE**: essa tela vai ser usada pelo meu pai, que não tem prática
  com tecnologia. Priorize botões grandes, poucos passos, mensagens de erro
  claras e o formulário funcionando bem no celular (ele vai tirar foto e
  subir direto do telefone)

### 4. WhatsApp
Cada card de moto tem um botão "Chamar no WhatsApp" que abre
`https://wa.me/55SEUNUMEROAQUI?text=...` com uma mensagem pré-preenchida
mencionando o modelo e ano da moto.

### 5. Responsividade
Site responsivo, testado em mobile (breakpoint principal já está no CSS do
mockup).

## Como proceder

Comece criando a estrutura de pastas e os componentes de layout (Header,
Footer, WhatsappFloat), depois a home, depois `/motos`, e por último `/admin`
com a integração Supabase. Vá me mostrando o progresso por etapas em vez de
gerar tudo de uma vez.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
