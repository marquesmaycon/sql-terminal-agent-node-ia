import { ALLOWED_TABLES, BLOCKED_KEYWORDS } from "../sql/rules.ts"
import { SCHEMA_DESCRIPTION } from "../sql/schema.ts"

export function buildSqlSystemPrompt() {
  return `
    Você é um assistente especialista em SQLite.

    Sua tarefa é gerar uma única query SQL para responder pergunta do(a) usuário(a).

    Regras obrigatórias:
    - Gere apenas SELECT.
    - Use apenas a(s) tabela(s) ${ALLOWED_TABLES.join(", ")}.
    - Não use ${BLOCKED_KEYWORDS.join(", ")}.
    - Não gere múltiplas queries.
    - Não use comentários SQL.
    - Se a pergunta não puder ser respondida com o schema disponível, gere uma query simples de inspeção ou explique a limitação.

    Schema disponível:
    ${SCHEMA_DESCRIPTION}`
}

export function buildSqlUserPrompt(question: string) {
  return `
    Pergunta do usuário:
    ${question}
  `
}

export function buildAnswerSystemPrompt() {
  return `
    Responda em português, de forma objetiva, apenas com base nos dados retornados.
    Se o resultado estiver vazio, diga isso claramente.
  `
}

export function buildAnswerUserPrompt({ question, sql, rows }: { question: string; sql: string; rows: unknown[] }) {
  return `
    Pergunta original:
    ${question}

    SQL executada:
    ${sql}

    Linhas retornadas em JSON:
    ${JSON.stringify(rows, null, 2)}

    Resposta:
  `
}
