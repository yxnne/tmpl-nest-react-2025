export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number }
export type User = { id: number; name: string; email: string; roleId?: number; phone?: string }
export type Role = { id: number; name: string; description?: string }