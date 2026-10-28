import { ALLOWED_TABLES, BLOCKED_KEYWORDS } from "./rules.ts"

export function validateSql(sql: string) {
  if (typeof sql !== "string" || !sql.trim()) {
    throw new Error("SQL vazia")
  }

  const normalized = sql.trim().replace(/;\s*$/, "").trim()

  // Remove literais de string para nao gerar falso positivo nas checagens abaixo
  const withoutStrings = normalized.replace(/'(?:[^']|'')*'/g, "''")

  if (/--|\/\*|\*\//.test(withoutStrings)) {
    throw new Error("Comentarios SQL nao sao permitidos")
  }

  if (withoutStrings.includes(";")) {
    throw new Error("Multiplas queries nao sao permitidas")
  }

  if (!/^select\b/i.test(withoutStrings)) {
    throw new Error("Apenas queries SELECT sao permitidas")
  }

  const blocked = BLOCKED_KEYWORDS.find((keyword) =>
    new RegExp(`\\b${keyword}\\b`, "i").test(withoutStrings)
  )

  if (blocked) {
    throw new Error(`Palavra-chave nao permitida: ${blocked}`)
  }

  const tables = [...withoutStrings.matchAll(/\b(?:from|join)\s+["`[]?(\w+)/gi)].map(
    (match) => match[1].toLowerCase()
  )

  if (!tables.length) {
    throw new Error(`A query precisa consultar uma das tabelas: ${ALLOWED_TABLES.join(", ")}`)
  }

  const invalidTable = tables.find((table) => !ALLOWED_TABLES.includes(table))

  if (invalidTable) {
    throw new Error(`Tabela nao permitida: ${invalidTable}`)
  }

  return normalized
}
