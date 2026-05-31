'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../src/hooks/useAuth'
import { recomendacionesService } from '../../../src/services/recomendaciones.service'
import { usuariosService } from '../../../src/services/usuarios.service'
import { Recomendacion, RecomendacionEmpleado, Usuario } from '../../../src/types'
import { ProtectedRoute } from '../../../src/components/ProtectedRoute'

export default function RecomendacionesPage() {
  const { usuario } = useAuth()
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([])
  const [misRecomendaciones, setMisRecomendaciones] = useState<RecomendacionEmpleado[]>([])
  const [empleados, setEmpleados] = useState<Usuario[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ titulo: '', descripcion: '', tipo: '' })
  const [submitting, setSubmitting] = useState(false)

  // Para asignar
  const [asignandoId, setAsignandoId] = useState<string | null>(null)
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('')
  const [asignando, setAsignando] = useState(false)

  useEffect(() => {
    if (usuario) fetchData()
  }, [usuario])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      if (usuario?.rol === 'empleado') {
        const data = await recomendacionesService.getMisRecomendaciones()
        setMisRecomendaciones(data)
      } else {
        const [recsData, usuariosData] = await Promise.all([
          recomendacionesService.getAll(),
          usuariosService.getAll(),
        ])
        setRecomendaciones(recsData)
        setEmpleados(usuariosData.filter((u: Usuario) => u.rol === 'empleado'))
      }
    } catch {
      setError('Error al cargar las recomendaciones')
    } finally {
      setLoadingData(false)
    }
  }

  const handleCompletar = async (id: string) => {
    try {
      await recomendacionesService.completar(id)
      fetchData()
    } catch {
      setError('Error al completar la recomendación')
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await recomendacionesService.create(form)
      setForm({ titulo: '', descripcion: '', tipo: '' })
      setShowForm(false)
      fetchData()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Error al crear la recomendación')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAsignar = async (recomendacion_id: string) => {
    if (!empleadoSeleccionado) return
    setAsignando(true)
    try {
      await recomendacionesService.asignar({
        empleado_id: empleadoSeleccionado,
        recomendacion_id,
      })
      setAsignandoId(null)
      setEmpleadoSeleccionado('')
      setError('')
      alert('Recomendación asignada correctamente')
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Error al asignar la recomendación')
    } finally {
      setAsignando(false)
    }
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
              <a href="/dashboard/citas" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">
                Citas
              </a>
              {usuario?.rol === 'psicologo' && (
                <a href="/dashboard/checkins" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">
                  Checkins
                </a>
              )}
              <a href="/dashboard/recomendaciones" className="px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium">
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
              <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-1">Recursos</p>
              <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">
                {usuario?.rol === 'psicologo' ? 'Gestionar recomendaciones' : 'Mis recomendaciones'}
              </h1>
            </div>
            {usuario?.rol === 'psicologo' && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-5 py-2.5 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-[#264653] transition-all"
              >
                {showForm ? 'Cancelar' : 'Nueva recomendación'}
              </button>
            )}
          </div>

          {/* Formulario crear */}
          {showForm && (
            <div className="bg-white p-8 rounded-2xl border border-[#E9ECEF] mb-6">
              <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-6">
                Nueva recomendación
              </h2>
              <form onSubmit={handleCrear} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#264653]">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                    required
                    placeholder="Ej: Técnica de respiración"
                    className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#264653]">Descripción</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    placeholder="Describe la recomendación..."
                    rows={3}
                    className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#264653]">Tipo</label>
                  <input
                    type="text"
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    placeholder="Ej: consejo, ejercicio..."
                    className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-[#2A9D8F] text-white rounded-lg font-semibold hover:bg-[#264653] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creando...' : 'Crear recomendación'}
                </button>
              </form>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : usuario?.rol === 'empleado' ? (
            misRecomendaciones.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#E9ECEF]">
                <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">
                  Sin recomendaciones aún
                </p>
                <p className="text-[#495057]">Tu psicólogo te enviará recomendaciones después de cada sesión</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {misRecomendaciones.map((rec) => (
                  <div key={rec.id} className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {rec.completado && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Completado
                            </span>
                          )}
                          {rec.recomendaciones.tipo && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E9ECEF] text-[#495057]">
                              {rec.recomendaciones.tipo}
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-lg font-bold text-[#264653] mb-1">
                          {rec.recomendaciones.titulo}
                        </h3>
                        {rec.recomendaciones.descripcion && (
                          <p className="text-[#495057]">{rec.recomendaciones.descripcion}</p>
                        )}
                      </div>
                      {!rec.completado && (
                        <button
                          onClick={() => handleCompletar(rec.id)}
                          className="ml-4 px-4 py-2 bg-[#2A9D8F] text-white rounded-lg text-sm font-medium hover:bg-[#264653] transition-all shrink-0"
                        >
                          Marcar completado
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : recomendaciones.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E9ECEF]">
              <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">
                No hay recomendaciones
              </p>
              <p className="text-[#495057]">Crea tu primera recomendación para asignarla a tus pacientes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {recomendaciones.map((rec) => (
                <div key={rec.id} className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {rec.tipo && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E9ECEF] text-[#495057]">
                            {rec.tipo}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-lg font-bold text-[#264653] mb-1">
                        {rec.titulo}
                      </h3>
                      {rec.descripcion && (
                        <p className="text-[#495057]">{rec.descripcion}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setAsignandoId(asignandoId === rec.id ? null : rec.id)
                        setEmpleadoSeleccionado('')
                      }}
                      className="ml-4 px-4 py-2 bg-[#264653] text-white rounded-lg text-sm font-medium hover:bg-[#2A9D8F] transition-all shrink-0"
                    >
                      Asignar a empleado
                    </button>
                  </div>

                  {/* Panel de asignación */}
                  {asignandoId === rec.id && (
                    <div className="mt-4 pt-4 border-t border-[#E9ECEF] flex gap-3 items-end">
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-sm font-medium text-[#264653]">
                          Selecciona un empleado
                        </label>
                        <select
                          value={empleadoSeleccionado}
                          onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                          className="px-4 py-2.5 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                        >
                          <option value="">Elige un empleado...</option>
                          {empleados.map((e) => (
                            <option key={e.id} value={e.id}>{e.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleAsignar(rec.id)}
                        disabled={!empleadoSeleccionado || asignando}
                        className="px-5 py-2.5 bg-[#2A9D8F] text-white rounded-lg text-sm font-medium hover:bg-[#264653] transition-all disabled:opacity-50"
                      >
                        {asignando ? 'Asignando...' : 'Confirmar'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}