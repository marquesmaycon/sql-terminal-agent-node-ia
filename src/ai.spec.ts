import { describe, it } from "node:test"
import { equal } from "node:assert"

describe("Testes para a camada de IA", () => {
  it("Deve gerar uma query SQL valida para uma pergunta simples", async (ctx) => {
    ctx.mock.module("ai", {
      namedExports: {
        generateText: async () => {
          return {
            output: {
              sql: "SELECT COUNT(*) AS total FROM access_logs;",
              explanation: "Conta o total de registros na tabela access_logs"
            }
          }
        },
        Output: { object: (options: unknown) => options }
      }
    })

    const { generateSqlObject } = await import("./ai.ts")

    const question = "Quantos acessos existem no total?"
    const { sql, explanation } = await generateSqlObject(question)

    equal(typeof sql, "string")
    equal(sql.trim().length > 0, true)

    equal(sql.trim().toUpperCase().startsWith("SELECT"), true)
  })
})
