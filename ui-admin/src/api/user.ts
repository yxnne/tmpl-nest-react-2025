import { http } from './http'
import type { Paged, User } from './types'

export const getUsers = (
  page = 1,
  pageSize = 15,
  params?: Partial<{ id: number; name: string; email: string; roleId: number; phone: string }>,
) => http.get('/users', { params: { page, pageSize, ...(params || {}) } }).then(r => r.data as Paged<User>)

export const getUser = (id: number) => http.get(`/users/${id}`).then(r => r.data as User)
export const createUser = (dto: { name: string; email: string; password: string; phone?: string }) =>
  http.post('/users', dto).then(r => r.data as User)
export const updateUser = (id: number, dto: Partial<{ name: string; email: string; password: string; phone?: string }>) =>
  http.patch(`/users/${id}`, dto).then(r => r.data as User)
export const deleteUser = (id: number) => http.delete(`/users/${id}`).then(r => r.data)
export const setUserRole = (id: number, roleId: number) => http.patch(`/users/${id}/role`, { roleId }).then(r => r.data as User)