import { describe, it } from "node:test"
import { equal, throws } from "node:assert"
import { validateSql } from "./validate.ts"

describe("Testes para a validação de SQL", () => {
  it("Deve aceitar um SELECT simples e remover o ponto e vírgula final", () => {
    equal(validateSql("SELECT COUNT(*) FROM access_logs;"), "SELECT COUNT(*) FROM access_logs")
  })

  it("Deve ignorar palavras bloqueadas dentro de strings", () => {
    const sql = "SELECT * FROM access_logs WHERE job_title = 'Delete Manager'"
    equal(validateSql(sql), sql)
  })

  it("Deve rejeitar queries que não são SELECT", () => {
    throws(() => validateSql("DELETE FROM access_logs"), /Apenas queries SELECT/)
  })

  it("Deve rejeitar múltiplas queries", () => {
    throws(() => validateSql("SELECT * FROM access_logs; DROP TABLE access_logs"), /Multiplas queries/)
  })

  it("Deve rejeitar comentários SQL", () => {
    throws(() => validateSql("SELECT * FROM access_logs -- comentario"), /Comentarios SQL/)
  })

  it("Deve rejeitar tabelas fora da lista permitida", () => {
    throws(() => validateSql("SELECT * FROM sqlite_master"), /Tabela nao permitida/)
  })
})
