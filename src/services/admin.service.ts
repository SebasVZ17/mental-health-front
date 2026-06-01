import { apiClient } from './api'
import { Usuario } from '../types'

export interface EstadisticasAdmin {
  usuarios: { total: number; empleados: number; psicologos: number }
  citas: { total: number; ultimos7Dias: number; porEstado: Record<string, number> }
  checkins: { total: number }
  empleadosCriticos: {
    id: string
    nombre: string
    email: string
    empresa: string
    estado_animo: number
    nivel_estres: number
    horas_sueno: number
    fecha: string
  }[]
  topPsicologos: {
    id: string
    nombre: string
    email: string
    promedio: number
    total_valoraciones: number
  }[]
}

export const adminService = {
  getEstadisticas: (): Promise<EstadisticasAdmin> =>
    apiClient<EstadisticasAdmin>('/admin/estadisticas'),

  getUsuarios: (): Promise<Usuario[]> =>
    apiClient<Usuario[]>('/admin/usuarios'),

  toggleActivo: (id: string): Promise<{ id: string; nombre: string; activo: boolean }> =>
    apiClient(`/admin/usuarios/${id}/toggle`, { method: 'PATCH' }),
}
