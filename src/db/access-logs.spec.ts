import { describe, it } from "node:test"
import { equal } from "node:assert"
import { createDb } from "./connection.ts"
import { createAccessLogInserter } from "./access-logs.ts"
import { generateLogEntry, generateUser } from "../mocks/access-logs.ts"

describe("Testes para a camada de dados", () => {
  const db = createDb()
  const insertAccessLog = createAccessLogInserter(db)

  it("Deve inserir um registro no banco de dados", () => {
    const user = generateUser()
    const record = generateLogEntry(user)

    insertAccessLog(record)

    const all = db.prepare("SELECT COUNT(*) FROM access_logs").all()
    equal(all[0]["COUNT(*)"], 1)
  })
})
