import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import type { SQLOutputValue } from "node:sqlite"
import { GEMINI_MODEL } from "../config.ts"
import { buildAnswerSystemPrompt, buildAnswerUserPrompt } from "./prompts.ts"

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
    system: buildAnswerSystemPrompt(),
    prompt: buildAnswerUserPrompt({ question, sql, rows })
  })

  return text.trim()
}
