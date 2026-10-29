# SQL Terminal Agent

Agente de terminal que transforma perguntas em linguagem natural em consultas SQL sobre uma base de logs de acesso, usando o **Google Gemini** via [AI SDK](https://ai-sdk.dev). O agente sugere a query, explica o que ela faz, pede sua confirmação antes de executar e, por fim, responde à pergunta em português com base nos dados retornados.

Tudo roda com **Node.js puro**: TypeScript executado nativamente, banco de dados com `node:sqlite` e testes com `node:test` — sem build, sem ORM e sem test runner externo.

## Como funciona

```
Pergunta (linguagem natural)
        │
        ▼
Gemini gera SQL + explicação  ──►  validação de segurança (somente SELECT)
        │
        ▼
Usuário confirma a execução (s/n)
        │
        ▼
Query executada no SQLite (logs.db)
        │
        ▼
Gemini resume o resultado em português
```

Exemplo de sessão:

```
Bem-vindo ao SQL Terminal Agent! Pressione CTRL+C para sair
Pergunta: Quais são as 3 empresas com mais acessos?

SQL sugerido
SELECT company, COUNT(*) AS total FROM access_logs GROUP BY company ORDER BY total DESC LIMIT 3

Explicação
Agrupa os acessos por empresa e retorna as três com maior quantidade.

Deseja executar este SQL? (s/n): s

Resposta:
As empresas com mais acessos são ...
```

## Segurança das queries

Antes de qualquer execução, o SQL gerado pela IA passa por [src/sql/validate.ts](src/sql/validate.ts), que garante:

- apenas queries `SELECT`;
- uma única query por vez (sem `;` no meio);
- nenhum comentário SQL (`--`, `/* */`);
- nenhuma palavra-chave bloqueada (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `PRAGMA`, `ATTACH`, etc.);
- acesso somente às tabelas permitidas (`access_logs`).

As regras ficam centralizadas em [src/sql/rules.ts](src/sql/rules.ts) e também são injetadas no prompt do modelo. Além disso, nenhuma query é executada sem confirmação explícita do usuário.

## Requisitos

- **Node.js 22.18+** (ou 24+), com suporte nativo a TypeScript e `node:sqlite`
- Uma chave de API do Google Gemini ([Google AI Studio](https://aistudio.google.com/apikey))

## Instalação

```bash
git clone https://github.com/marquesmaycon/sql-terminal-agent-node-ia.git
cd sql-terminal-agent-node-ia
npm install
```

Copie o arquivo de exemplo e preencha sua chave do Gemini:

```bash
cp .env.example .env
```

```env
GOOGLE_GENERATIVE_AI_API_KEY=sua-chave-aqui
```

| Variável                       | Obrigatória | Descrição                                   |
| ------------------------------ | ----------- | ------------------------------------------- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Sim         | Chave de API do Google Gemini usada pelo AI SDK |

## Uso

### 1. Gerar logs falsos

Gera registros de acesso fictícios (com [Faker](https://fakerjs.dev)) no arquivo `access.log`, um JSON por linha:

```bash
npm run seed -- 10000
```

Sem informar a quantidade, a geração continua até você pressionar `CTRL+C`.

### 2. Ingerir os logs no banco

Lê o `access.log` em streaming e insere os registros no SQLite (`logs.db`):

```bash
npm run ingest
```

### 3. Iniciar o agente

```bash
npm start
```

Para desenvolvimento, com recarregamento automático:

```bash
npm run dev
```

## Scripts

| Comando              | Descrição                                           |
| -------------------- | --------------------------------------------------- |
| `npm run seed -- N`  | Gera `N` logs de acesso falsos em `access.log`      |
| `npm run ingest`     | Importa `access.log` para o banco `logs.db`         |
| `npm start`          | Inicia o agente no terminal                         |
| `npm run dev`        | Inicia o agente em modo watch                       |
| `npm test`           | Executa os testes                                   |
| `npm run test:watch` | Executa os testes em modo watch                     |

## Testes

Os testes usam o runner nativo `node:test`, com mock de módulos para não depender da API do Gemini:

```bash
npm test
```

Cobrem a validação de SQL, a inserção no banco e a camada de geração de SQL.

## Configuração

Os parâmetros principais ficam em [src/config.ts](src/config.ts):

| Constante      | Padrão             | Descrição                                     |
| -------------- | ------------------ | --------------------------------------------- |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Modelo do Gemini usado                        |
| `DB_NAME`      | `logs.db`          | Arquivo do banco SQLite                       |
| `LOG_FILE`     | `access.log`       | Arquivo de logs gerado/lido                   |
| `LOG_INTERVAL` | `1000`             | Intervalo de registros entre logs de progresso |

## Estrutura do projeto

```
src/
├── ai/           # Geração de SQL e de respostas com o Gemini (prompts e schemas Zod)
├── db/           # Conexão SQLite e inserção de logs
├── domain/       # Tipos de domínio
├── mocks/        # Geradores de dados falsos com Faker
├── scripts/      # Scripts de seed e ingestão
├── sql/          # Schema, regras e validação de SQL
├── config.ts     # Configurações gerais
└── index.ts      # Loop interativo do agente
```

## Tecnologias

- [Node.js](https://nodejs.org) — TypeScript nativo, `node:sqlite`, `node:test`, `node:readline`
- [AI SDK](https://ai-sdk.dev) + [@ai-sdk/google](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai) — integração com o Gemini e saída estruturada
- [Zod](https://zod.dev) — schema da resposta do modelo
- [Faker](https://fakerjs.dev) — geração de dados fictícios

## Licença

ISC
