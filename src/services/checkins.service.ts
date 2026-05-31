import { apiClient } from './api'
import { Checkin, PaginatedResponse } from '../types'

export const checkinsService = {
  getAll: async (params?: {
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Checkin>> => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', String(params.page))
    if (params?.limit) query.append('limit', String(params.limit))

    return apiClient<PaginatedResponse<Checkin>>(`/checkins?${query.toString()}`)
  },

  getByEmpleado: async (id: string): Promise<Checkin[]> => {
    return apiClient<Checkin[]>(`/checkins/empleado/${id}`)
  },

  create: async (data: {
    empleado_id: string
    estado_animo: number
    nivel_estres: number
    horas_sueno?: number
    notas?: string
  }): Promise<Checkin> => {
    return apiClient<Checkin>('/checkins', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: string, data: {
    estado_animo?: number
    nivel_estres?: number
    horas_sueno?: number
    notas?: string
  }): Promise<Checkin> => {
    return apiClient<Checkin>(`/checkins/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  delete: async (id: string): Promise<void> => {
    return apiClient<void>(`/checkins/${id}`, {
      method: 'DELETE',
    })
  },
}