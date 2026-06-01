export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: 'empleado' | 'psicologo' | 'admin'
  empresa?: string
  cargo?: string
  activo?: boolean
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface Cita {
  id: string
  empleado_id: string
  psicologo_id: string
  fecha_hora: string
  duracion_minutos: number
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  notas?: string
  link_reunion?: string | null
  creado_en: string
  usuarios_citas_empleado_idTousuarios?: { nombre: string; email: string; empresa: string }
  usuarios_citas_psicologo_idTousuarios?: { nombre: string; email: string }
}

export interface Checkin {
  id: string
  empleado_id: string
  fecha: string
  estado_animo: number
  nivel_estres: number
  horas_sueno?: number
  notas?: string
  creado_en: string
  usuarios?: { nombre: string; email: string }
}

export interface Recomendacion {
  id: string
  titulo: string
  descripcion?: string
  tipo?: string
  activo: boolean
  creado_en: string
}

export interface RecomendacionEmpleado {
  id: string
  empleado_id: string
  recomendacion_id: string
  completado: boolean
  completado_en?: string
  asignado_en: string
  recomendaciones: Recomendacion
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export interface ApiError {
  error: string
}