import { http } from './http'
import type { Paged, Role } from './types'

export const getRoles = (
  page = 1,
  pageSize = 15,
  params?: Partial<{ id: number; name: string; description: string }>,
) => http.get('/roles', { params: { page, pageSize, ...(params || {}) } }).then(r => r.data as Paged<Role>)

export const getRole = (id: number) => http.get(`/roles/${id}`).then(r => r.data as Role)
export const createRole = (dto: { name: string; description?: string }) => http.post('/roles', dto).then(r => r.data as Role)
export const updateRole = (id: number, dto: Partial<{ name: string; description?: string }>) => http.patch(`/roles/${id}`, dto).then(r => r.data as Role)
export const deleteRole = (id: number) => http.delete(`/roles/${id}`).then(r => r.data)