import { faker } from "@faker-js/faker"
import type { User } from "./types.ts"

export function generateUser(): User {
  return {
    id: faker.string.uuid(),
    ip: faker.internet.ip(),
    username: faker.internet.username(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    location: faker.location.city(),
    job_area: faker.person.jobArea(),
    company: faker.company.name(),
    job_title: faker.person.jobTitle()
  }
}

export function generateLogEntry(user: User) {
  const { id: user_id, ...rest } = user
  return {
    id: faker.string.uuid(),
    user_id,
    ...rest,
    timestamp: faker.date.recent().toISOString()
  }
}
