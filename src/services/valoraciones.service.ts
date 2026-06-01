import { apiClient } from './api'

export interface TopPsicologo {
  id: string
  nombre: string
  email: string
  promedio: number
  total_valoraciones: number
}

export const valoracionesService = {
  create: async (data: {
    psicologo_id: string
    cita_id: string
    puntuacion: number
    comentario?: string
  }): Promise<void> => {
    return apiClient<void>('/valoraciones', {
      method: 'POST',
      body: data,
    })
  },

  getTop: async (): Promise<TopPsicologo[]> => {
    return apiClient<TopPsicologo[]>('/valoraciones/top')
  },
}
