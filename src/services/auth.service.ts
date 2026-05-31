import { apiClient } from './api'
import { AuthResponse } from '../types'

export const authService = {
  register: async (data: {
    nombre: string
    email: string
    password: string
    rol?: string
    empresa?: string
    cargo?: string
  }): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
      auth: false,
    })
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    return apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: data,
      auth: false,
    })
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
  },

  getUsuario: () => {
    if (typeof window === 'undefined') return null
    const usuario = localStorage.getItem('usuario')
    return usuario ? JSON.parse(usuario) : null
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('token')
  },
}