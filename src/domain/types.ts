export type User = {
  id: string
  ip: string
  username: string
  first_name: string
  last_name: string
  email: string
  location: string
  job_area: string
  company: string
  job_title: string
}

export type AccessLog = Omit<User, "id"> & {
  id: string
  user_id: string
  timestamp: string
}
