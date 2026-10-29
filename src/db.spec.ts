import { describe, it } from "node:test"
import { createDb } from "./db.ts"
import { generateLogEntry, generateUser } from "./mocks.ts"
import { equal } from "node:assert"

describe("Testes para a camada de dados", () => {
  const db = createDb()

  it("Deve inserir um registro no banco de dados", () => {
    const user = generateUser()
    const record = generateLogEntry(user)

    db.prepare(
      `INSERT INTO access_logs (
      id,
      user_id,
      ip,
      username,
      first_name,
      last_name,
      email,
      location,
      job_area,
      company,
      job_title,
      timestamp
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`
    ).run(
      record.id,
      record.user_id,
      record.ip,
      record.username,
      record.first_name,
      record.last_name,
      record.email,
      record.location,
      record.job_area,
      record.company,
      record.job_title,
      record.timestamp
    )

    const all = db.prepare("SELECT COUNT(*) FROM access_logs").all()
    equal(all[0]["COUNT(*)"], 1)
  })
})
