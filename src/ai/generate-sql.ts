import { google } from "@ai-sdk/google"
import { generateText, Output } from "ai"
import { GEMINI_MODEL } from "../config.ts"
import { validateSql } from "../sql/validate.ts"
import { buildSqlSystemPrompt, buildSqlUserPrompt } from "./prompts.ts"
import { sqlSuggestionSchema } from "./schemas.ts"

export async function generateSqlObject(question: string) {
  const { output } = await generateText({
    model: google(GEMINI_MODEL),
    output: Output.object({ schema: sqlSuggestionSchema }),
    system: buildSqlSystemPrompt(),
    prompt: buildSqlUserPrompt(question)
  })

  if (!output?.sql) {
    throw new Error("O modelo nao retornou uma sugestão SQL valida.")
  }

  return {
    sql: validateSql(output.sql),
    explanation: output.explanation
  }
}
