import type { DatabaseSync } from "node:sqlite"
import type { AccessLog } from "../domain/types.ts"

export function createAccessLogInserter(db: DatabaseSync) {
  const statement = db.prepare(
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
  )

  return (record: AccessLog) =>
    statement.run(
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
}
