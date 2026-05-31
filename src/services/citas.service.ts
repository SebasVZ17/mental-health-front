import { apiClient } from './api'
import { Cita, PaginatedResponse } from '../types'

export const citasService = {
  getAll: async (params?: {
    page?: number
    limit?: number
    estado?: string
    fecha_inicio?: string
    fecha_fin?: string
  }): Promise<PaginatedResponse<Cita>> => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', String(params.page))
    if (params?.limit) query.append('limit', String(params.limit))
    if (params?.estado) query.append('estado', params.estado)
    if (params?.fecha_inicio) query.append('fecha_inicio', params.fecha_inicio)
    if (params?.fecha_fin) query.append('fecha_fin', params.fecha_fin)

    return apiClient<PaginatedResponse<Cita>>(`/citas?${query.toString()}`)
  },

  getById: async (id: string): Promise<Cita> => {
    return apiClient<Cita>(`/citas/${id}`)
  },

  create: async (data: {
    psicologo_id: string
    fecha_hora: string
    duracion_minutos?: number
    notas?: string
  }): Promise<Cita> => {
    return apiClient<Cita>('/citas', {
      method: 'POST',
      body: data,
    })
  },

  update: async (id: string, data: {
    estado?: string
    link_reunion?: string
    notas?: string
    duracion_minutos?: number
  }): Promise<Cita> => {
    return apiClient<Cita>(`/citas/${id}`, {
      method: 'PUT',
      body: data,
    })
  },

  cancel: async (id: string): Promise<void> => {
    return apiClient<void>(`/citas/${id}`, {
      method: 'DELETE',
    })
  },
}