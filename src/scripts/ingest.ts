import { createReadStream } from "node:fs"
import { createInterface } from "node:readline"
import { DB_NAME, LOG_FILE, LOG_INTERVAL } from "../config.ts"
import { createDb } from "../db/connection.ts"
import { createAccessLogInserter } from "../db/access-logs.ts"
import type { AccessLog } from "../domain/types.ts"

const db = createDb(DB_NAME)
const insertAccessLog = createAccessLogInserter(db)
const fileStream = createReadStream(LOG_FILE)
const rl = createInterface({
  input: fileStream,
  crlfDelay: Infinity
})

console.log(`Lendo ${LOG_FILE} e inserindo no banco de dados`)

let count = 0

for await (const line of rl) {
  if (!line.trim()) continue

  let record: AccessLog

  try {
    record = JSON.parse(line)
  } catch (_) {
    continue
  }

  insertAccessLog(record)

  count++

  if (count % LOG_INTERVAL === 0) {
    console.log(`Ingeridos ${count} registros...`)
  }
}

console.log(`Ingestão concluída. Total de registros ingeridos: ${count}`)
db.close()
