import { http } from './http'

export const login = (username: string, password: string) =>
  http.post('/auth/login', { username, password }).then(r => r.data)