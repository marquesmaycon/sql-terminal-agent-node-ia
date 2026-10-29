import { createInterface } from "node:readline"
import { DB_NAME } from "./config.ts"
import { createDb } from "./db/connection.ts"
import { styleText } from "node:util"
import { generateSqlObject } from "./ai/generate-sql.ts"
import { generateAnswer } from "./ai/generate-answer.ts"

const db = createDb(DB_NAME)

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

function prompt(text: string): Promise<string> {
  return new Promise((res) => rl.question(text, res))
}

rl.on("close", () => {
  db.close()
  console.log(styleText("gray", "Encerrando o agente, até a próxima!"))
  process.exit(0)
})

console.log(styleText(["bold", "blue"], "Bem-vindo ao SQL Terminal Agent! Pressione CTRL+C para sair"))

while (true) {
  const question = await prompt(styleText(["bold", "magenta"], "Pergunta: "))
  if (!question.trim()) continue

  try {
    const { sql, explanation } = await generateSqlObject(question)

    console.log(styleText("cyan", "\nSQL sugerido"))
    console.log(styleText("red", sql))
    console.log(styleText("cyan", "\nExplicação"))
    console.log(styleText("yellow", explanation))

    const confirm = await prompt(styleText(["bold", "green"], "\nDeseja executar este SQL? (s/n):"))

    if (confirm.toLowerCase() === "s") {
      const rows = db
        .prepare(sql)
        .all()
        .map((row) => ({ ...row }))

      const answer = await generateAnswer({ question, sql, rows })
      console.log(styleText("green", "\nResposta: "))
      console.log(answer)
    } else {
      console.log(styleText("yellow", "SQL não executado"))
    }
  } catch (error) {
    console.error(styleText("red", `\nErro: ${error instanceof Error ? error.message : String(error)}`))
  }
}
