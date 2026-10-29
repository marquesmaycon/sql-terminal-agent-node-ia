import { faker } from "@faker-js/faker"
import { createWriteStream, statSync } from "node:fs"
import { LOG_FILE, LOG_INTERVAL } from "./config.ts"
import { generateLogEntry, generateUser } from "./mocks.ts"

const maxRecords = Number(process.argv[2] || Infinity)

if ((!Number.isInteger(maxRecords) && Number.isFinite(maxRecords)) || Number.isNaN(maxRecords) || maxRecords <= 0) {
  console.error("Uso: npm run seed -- <quantidade>")
  console.error("A quantidade deve ser um número inteiro maior que zero")
  process.exit(1)
}

const stream = createWriteStream(LOG_FILE)

function writeRecord(line: string): Promise<void> {
  return new Promise((res) => {
    if (!stream.write(line)) {
      stream.once("drain", res)
    } else {
      res()
    }
  })
}

console.log(`Gerando logs de acesso falsos em ${LOG_FILE}... ctrl + c para parar`)
console.log(`Limite de registros: ${maxRecords.toLocaleString()}`)

const users = Array.from({ length: 5 }, generateUser)

function convertBytesToGB(bytes: number) {
  return (bytes / 1024 / 1024 / 1024).toFixed(4)
}

process.on("SIGINT", () => {
  stream.end(() => {
    const { size } = statSync(LOG_FILE)
    console.log(
      `Geração interrompida. Registros: ${count.toLocaleString()}, tamanho do arquivo: ${convertBytesToGB(size)} GB`
    )
  })
})

let count = 0

while (count < maxRecords) {
  const user = faker.helpers.arrayElement(users)
  const record = generateLogEntry(user)

  await writeRecord(JSON.stringify(record) + "\n")
  count++

  if (count % LOG_INTERVAL === 0) {
    const { size } = statSync(LOG_FILE)
    console.log(`Registros: ${count.toLocaleString()}, tamanho do arquivo: ${convertBytesToGB(size)} GB`)
  }
}

stream.end(() => {
  const { size } = statSync(LOG_FILE)
  console.log(
    `Geração concluída. Registros: ${count.toLocaleString()}, tamanho do arquivo: ${convertBytesToGB(size)} GB`
  )
})
