import { z } from "zod"

export const sqlSuggestionSchema = z.object({
  sql: z.string().describe("Uma única query SELECT em SQLite, sem comentários e sem ponto e vírgula no meio"),
  explanation: z.string().describe("Explicação curta, em português, do que a query faz")
})

export type SqlSuggestion = z.infer<typeof sqlSuggestionSchema>
