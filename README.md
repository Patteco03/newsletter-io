# Newsletter io

## Visão geral

Monorepo que reúne um backend em Node.js + TypeScript (Express), um frontend em React com Vite, e serviços auxiliares:

* **Broker (RabbitMQ)** — fila de mensageria para comunicação assíncrona entre serviços.
* **Banco de dados (Postgres)** — armazenamento relacional das entidades principais.
* **Agent `curador-de-noticias`** — Serviço separado integrado com chatGPT que por enquanto só gera um resumo para complementar a criação e atualização das notícias.
* **Worker (opcional)** — processa tarefas assíncronas (envio de e-mails, indexação, enriquecimento, etc.).
---

## Por que Postgres (em vez de Mongo)?

Escolheu-se **Postgres** por alguns motivos práticos para esse tipo de aplicação:

* **Consistência relacional**: modelos como usuários, categorias, relações entre conteúdos e histórico de resumos se beneficiam de constraints, joins e transações.
* **Consultas avançadas**: filtros, ordenações, agregações e pesquisas com `ILIKE` / índices funcionam naturalmente com SQL; para features como "listar categorias dinamicamente" e filtros combináveis, SQL costuma ser mais direto.
* **Maturidade de ferramentas**: migrações, observabilidade e back-ups são simples com Postgres no ecossistema Docker/Cloud.
* **Possibilidade de dados semi-estruturados**: se houver necessidade, Postgres tem `JSONB`, então ainda podemos armazenar payloads flexíveis sem migrar para Mongo.
* **Teorema PACELC**: de acordo com o teorema de pacelc ambos prioziram a consistência ao invés de disponibilidade ou  baixa latência, então dependendo do fluxo do site de notícias poderia-se migrar para um outro banco de dados como por exemplo o Cassanda que prioriza a alta disponibilidade e baixa latência.


---

## Tecnologias principais

* TypeScript
* Express (API REST)
* Vite + React (SPA)
* RabbitMQ (messaging)
* PostgreSQL
* turborepo
* zod (validação)
* dotenv (configuração por ambiente)
* axios (HTTP client)
* tsdown (documentação/typing helper)

---

## Arquitetura de serviços

* **server**: provê endpoints REST, autenticação (JWT), expõe endpoints para listar notícias, categorias e resultados de resumos.
* **agent-curador**: consome uma fila (ex.: `news.to.summarize`) ou HTTP, gera resumo (pode usar LLMs, heurísticas ou bibliotecas de NLP) e publica resultado em `news.summaries` ou via chamada HTTP para o `server`.
* **web**: interface para visualizar notícias, solicitar resumo, ver histórico.
* **rabbitmq**: exchange/queues para entregar trabalho de resumo e receber respostas.
* **postgres**: tabelas: `users`, `news`, `categories`.

---


## Variáveis de ambiente (.env.example)

```
# server
PORT=3000
DATABASE_URL=postgres://app:secret@postgres:5432/appdb
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
JWT_SECRET=uma_chave_secreta
ADMIN_EMAIL=user@admin.com
ADMIN_PASSWORD=user@2025

# web
VITE_API_URL=http://localhost:3000
```

---

## Pré-requisitos

* Git (opcional, para clonar o repositório)
* Docker & Docker Compose instalados e em execução
* Node.js (recomendado para desenvolvimento local, mas o ambiente de desenvolvimento aqui usa Docker)
* Yarn instalado (ou use `npm` se preferir, mas os comandos abaixo assumem `yarn`)

---

## 1. Copiar o arquivo de ambiente

Copie o exemplo de variáveis de ambiente para `.env` em `apps/server`:

```bash
cp .env.example .env
```

Abra o arquivo `.env` e ajuste as variáveis (como dados do banco, chaves, portas, etc.) conforme necessário antes de subir os serviços.

> Dica: se o projeto usa variáveis para o usuário admin do seed, confira se as variáveis correspondentes estão corretas (por exemplo `ADMIN_EMAIL`, `ADMIN_PASSWORD`), ou ajuste o seed depois.

---

## 2. Instalar dependências (se necessário)

Se você for usar o ambiente local (fora do Docker) ou precisar instalar dependências no host:

```bash
yarn install
```

---

## 3. Subir containers com Docker Compose

Inicie os serviços em segundo plano:

```bash
docker compose up -d
```

Para parar e remover containers:

```bash
docker compose down
```

---

## 4. Executar em modo desenvolvimento

Roda a aplicação em modo dev (hot-reload, etc.):

```bash
yarn dev
```

---

## 5. Gerar migrations

Rode as migrations para criar/atualizar o schema do banco:

```bash
yarn db:migrate
```

Se o comando falhar, verifique:

* Se o banco de dados está acessível (host/porta/usuário/senha no `.env`)
* Se as dependências do ORM/CLI estão instaladas
* Logs do serviço do banco

---

## 6. Gerar seed (criar usuário admin)

Rode o seed para criar o usuário administrador. A instrução informada foi:

```bash
yarn db:seed
```

Por padrão o projeto pode criar um admin com senha `admin@admin2025` — confirme (no código/seed) qual é a senha padrão ou se o seed lê variáveis do `.env` (ex.: `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

---



## Scripts úteis (exemplo com yarn + turborepo)

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  }
}
```

Cada pacote/app terá seus próprios scripts (`apps/web/package.json`, `apps/server/package.json`, etc.).


## Boas práticas e dependências sugeridas

* **Validação**: zod para validar payloads dentro de `shared/schemas` e reutilizar entre todo o ecossistema.
* **Config**: dotenv + validator (checar envs na inicialização).
* **HTTP client**: axios wrapper no `packages/shared` com retry/backoff.
* **Logs**: pino ou winston, com saída JSON para observabilidade.
* **Queue patterns**: ACK/NACK, dead-letter exchanges, retry delays.

---

## Pontos de melhoria (prioridades)

**Autenticação & Segurança**

* Implementar refresh token (rotacionamento seguro).
* Hardening de JWT (exp, aud, iss), rate limiting e CORS estrito.

**Frontend**

* Listar categorias dinamicamente (endpoint `GET /categories`).
* Adicionar filtros (por data, categoria, autor, relevância).
* Paginação eficiente e cache (SWR / react-query).

**Backend / API**

* Endpoints para pesquisa avançada (filtros combináveis).
* Indexes no Postgres para queries mais comuns (text search).
* Health checks e readiness probes.

**Agent & Worker**

* Retry com backoff exponencial, DLQ para falhas permanentes.
* Métricas (Prometheus) e tracing (OpenTelemetry).
* Paralelismo controlado e limitação de concorrência.

**Observability & Infra**

* Logs estruturados, dashboards, alertas (erro/latência/política de retries).
* Backup e restore automatizado do Postgres.


