export const SCHEMA_DESCRIPTION = `
  Tabela: access_logs
  - id TEXT PRIMARY KEY: identificador único do registro de acesso
  - user_id TEXT: identificador do usuário
  - ip TEXT: endereço IP de origem do acesso
  - username TEXT: nome de usuário
  - first_name TEXT: primeiro nome
  - last_name TEXT: sobrenome
  - email TEXT: e-mail do usuário
  - location TEXT: localização do acesso
  - job_area TEXT: área de atuação
  - company TEXT: empresa
  - job_title TEXT: cargo
  - timestamp TIMESTAMP: data/hora do acesso em ISO 8601 (ex: 2026-10-28T14:30:00.000Z)

  Observações:
  - Para filtrar ou agrupar por data use funções do SQLite como date(timestamp), strftime('%Y-%m-%d', timestamp) ou datetime('now', '-7 days').
  - Um mesmo user_id pode ter vários acessos.
`
