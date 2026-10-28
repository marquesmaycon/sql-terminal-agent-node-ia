import { google } from "@ai-sdk/google"
import { generateText, Output } from "ai"
import { GEMINI_MODEL } from "./config.ts"
import { buildSystemPrompt, buildUserPrompt } from "./prompts.ts"
import { sqlSuggestionSchema } from "./schemas.ts"
import { validateSql } from "./sql/validate.ts"
import type { SQLOutputValue } from "node:sqlite"

export async function generateSqlObject(question: string) {
  const { output } = await generateText({
    model: google(GEMINI_MODEL),
    output: Output.object({ schema: sqlSuggestionSchema }),
    system: buildSystemPrompt(),
    prompt: buildUserPrompt(question)
  })

  if (!output?.sql) {
    throw new Error("O modelo nao retornou uma sugestão SQL valida.")
  }

  return {
    sql: validateSql(output.sql),
    explanation: output.explanation
  }
}

export async function generateAnswer({
  question,
  sql,
  rows
}: {
  question: string
  sql: string
  rows: Record<string, SQLOutputValue>[]
}) {
  const { text } = await generateText({
    model: google(GEMINI_MODEL),
    system: `
      Responda em português, de forma objetiva, apenas com base nos dados retornados.
      Se o resultado estiver vazio, diga isso claramente.
    `,
    prompt: `
      Pergunta original:
      ${question}

      SQL executada:
      ${sql}

      Linhas retornadas em JSON:
      ${JSON.stringify(rows, null, 2)}

      Resposta:
    `
  })

  return text.trim()
}
