import axios from 'axios'
import { getToken } from '../auth'

export const http = axios.create({ baseURL: '/api' })

http.interceptors.request.use((config) => {
  const t = getToken()
  if (t) {
    config.headers = config.headers || {}
    config.headers['authorization'] = `Bearer ${t}`
  }
  return config
})