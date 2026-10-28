import { openai } from "@ai-sdk/openai"
import { generateText, Output } from "ai"
import { OPENAI_MODEL } from "./config.ts"
import { buildSystemPrompt, buildUserPrompt } from "./prompts.ts"
import { sqlSuggestionSchema } from "./schemas.ts"
import { validateSql } from "./sql/validate.ts"

export async function generateSqlObject(question: string) {
  const { output } = await generateText({
    model: openai(OPENAI_MODEL),
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
