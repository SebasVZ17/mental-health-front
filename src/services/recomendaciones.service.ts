import { apiClient } from './api'
import { Recomendacion, RecomendacionEmpleado } from '../types'

export const recomendacionesService = {
  getAll: async (): Promise<Recomendacion[]> => {
    return apiClient<Recomendacion[]>('/recomendaciones')
  },

  getById: async (id: string): Promise<Recomendacion> => {
    return apiClient<Recomendacion>(`/recomendaciones/${id}`)
  },

  getMisRecomendaciones: async (): Promise<RecomendacionEmpleado[]> => {
    return apiClient<RecomendacionEmpleado[]>('/recomendaciones/mis-recomendaciones')
  },

  create: async (data: {
    titulo: string
    descripcion?: string
    tipo?: string
  }): Promise<Recomendacion> => {
    return apiClient<Recomendacion>('/recomendaciones', {
      method: 'POST',
      body: data,
    })
  },

  asignar: async (data: {
    empleado_id: string
    recomendacion_id: string
  }): Promise<RecomendacionEmpleado> => {
    return apiClient<RecomendacionEmpleado>('/recomendaciones/asignar', {
      method: 'POST',
      body: data,
    })
  },

  completar: async (id: string): Promise<RecomendacionEmpleado> => {
    return apiClient<RecomendacionEmpleado>(`/recomendaciones/completar/${id}`, {
      method: 'PUT',
    })
  },

  deactivate: async (id: string): Promise<void> => {
    return apiClient<void>(`/recomendaciones/${id}`, {
      method: 'DELETE',
    })
  },
}