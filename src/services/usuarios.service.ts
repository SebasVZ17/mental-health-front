import { apiClient } from './api'
import { Usuario } from '../types'

export const usuariosService = {
  getAll: async (): Promise<Usuario[]> => {
    return apiClient<Usuario[]>('/usuarios', { auth: false })
  },

  getById: async (id: string): Promise<Usuario> => {
    return apiClient<Usuario>(`/usuarios/${id}`, { auth: false })
  },
}