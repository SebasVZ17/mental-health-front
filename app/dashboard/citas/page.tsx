'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../src/hooks/useAuth'
import { citasService } from '../../../src/services/citas.service'
import { Cita } from '../../../src/types'
import { ProtectedRoute } from '../../../src/components/ProtectedRoute'

export default function CitasPage() {
  const { usuario } = useAuth()
  const [citas, setCitas] = useState<Cita[]>([])
  const [loadingCitas, setLoadingCitas] = useState(true)
  const [error, setError] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')

  useEffect(() => {
    if (usuario) fetchCitas()
  }, [usuario, filtroEstado])

  const fetchCitas = async () => {
    try {
      setLoadingCitas(true)
      const response = await citasService.getAll({ estado: filtroEstado || undefined })
      setCitas(response.data)
    } catch {
      setError('Error al cargar las citas')
    } finally {
      setLoadingCitas(false)
    }
  }

  const handleCancelar = async (id: string) => {
    try {
      await citasService.cancel(id)
      fetchCitas()
    } catch {
      setError('Error al cancelar la cita')
    }
  }

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      pendiente: 'bg-yellow-100 text-yellow-700',
      confirmada: 'bg-green-100 text-green-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
    }
    return colores[estado] || 'bg-gray-100 text-gray-700'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#E9ECEF]">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-[#264653] flex flex-col justify-between p-8">
          <div>
            <a href="/" style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white">
              Liber<span className="text-[#2A9D8F]">ate</span>
            </a>
            <div className="mt-10 flex flex-col gap-2">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Menu</p>
              <a href="/dashboard" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">
                Inicio
              </a>
              <a href="/dashboard/citas" className="px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium">
                Citas
              </a>
              {usuario?.rol === 'psicologo' && (
                <a href="/dashboard/checkins" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">
                  Checkins
                </a>
              )}
              <a href="/dashboard/recomendaciones" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">
                Recomendaciones
              </a>
            </div>
          </div>
          <div>
            <div className="mb-4 p-4 bg-white/10 rounded-lg">
              <p className="text-white font-medium">{usuario?.nombre}</p>
              <p className="text-white/50 text-sm capitalize">{usuario?.rol}</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="ml-64 p-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-1">Agenda</p>
              <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">
                {usuario?.rol === 'psicologo' ? 'Citas de pacientes' : 'Mis citas'}
              </h1>
            </div>
            {usuario?.rol === 'empleado' && (
              <Link
                href="/dashboard/citas/nueva"
                className="px-5 py-2.5 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-[#264653] transition-all"
              >
                Nueva cita
              </Link>
            )}
          </div>

          {/* Filtros */}
          <div className="mb-6 flex gap-3 flex-wrap">
            {['', 'pendiente', 'confirmada', 'completada', 'cancelada'].map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtroEstado === estado
                    ? 'bg-[#264653] text-white'
                    : 'bg-white text-[#495057] hover:bg-[#E9ECEF]'
                }`}
              >
                {estado === '' ? 'Todas' : estado.charAt(0).toUpperCase() + estado.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {loadingCitas ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : citas.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E9ECEF]">
              <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">
                No hay citas
              </p>
              <p className="text-[#495057]">
                {usuario?.rol === 'empleado'
                  ? 'Agenda tu primera cita con un psicólogo'
                  : 'No tienes citas programadas'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {citas.map((cita) => (
                <div key={cita.id} className="bg-white p-6 rounded-2xl border border-[#E9ECEF] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado || '')}`}>
                        {cita.estado}
                      </span>
                      <span className="text-[#495057] text-sm">
                        {new Date(cita.fecha_hora).toLocaleDateString('es-CO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-[#495057] text-sm">
                        {new Date(cita.fecha_hora).toLocaleTimeString('es-CO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="font-medium text-[#264653]">
                      {usuario?.rol === 'empleado'
                        ? `Psicólogo: ${cita.usuarios_citas_psicologo_idTousuarios?.nombre || 'N/A'}`
                        : `Paciente: ${cita.usuarios_citas_empleado_idTousuarios?.nombre || 'N/A'}`}
                    </p>
                    {cita.notas && <p className="text-[#495057] text-sm mt-1">{cita.notas}</p>}
                  </div>
                  <div className="flex gap-3">
                    {cita.estado === 'pendiente' && usuario?.rol === 'psicologo' && (
                      <button
                        onClick={() => citasService.update(cita.id, { estado: 'confirmada' }).then(fetchCitas)}
                        className="px-4 py-2 bg-[#2A9D8F] text-white rounded-lg text-sm font-medium hover:bg-[#264653] transition-all"
                      >
                        Confirmar
                      </button>
                    )}
                    {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                      <button
                        onClick={() => handleCancelar(cita.id)}
                        className="px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}