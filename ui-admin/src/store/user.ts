import { atom } from 'jotai'
export type AuthState = { username?: string; roles?: number[] } | null
export const userAtom = atom<AuthState>(null)