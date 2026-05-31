'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../src/hooks/useAuth'
import { checkinsService } from '../../../src/services/checkins.service'
import { usuariosService } from '../../../src/services/usuarios.service'
import { Checkin, Usuario } from '../../../src/types'
import { ProtectedRoute } from '../../../src/components/ProtectedRoute'

export default function CheckinsPage() {
  const { usuario } = useAuth()
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [empleados, setEmpleados] = useState<Usuario[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    empleado_id: '',
    estado_animo: 3,
    nivel_estres: 3,
    horas_sueno: 7,
    notas: '',
  })

  useEffect(() => {
    if (usuario) fetchData()
  }, [usuario])

  const fetchData = async () => {
    try {
      setLoadingData(true)
      const [checkinsData, usuariosData] = await Promise.all([
        checkinsService.getAll(),
        usuariosService.getAll(),
      ])
      setCheckins(checkinsData.data)
      setEmpleados(usuariosData.filter((u: Usuario) => u.rol === 'empleado'))
    } catch {
      setError('Error al cargar los datos')
    } finally {
      setLoadingData(false)
    }
  }

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await checkinsService.create({
        ...form,
        horas_sueno: Number(form.horas_sueno),
      })
      setForm({ empleado_id: '', estado_animo: 3, nivel_estres: 3, horas_sueno: 7, notas: '' })
      setShowForm(false)
      fetchData()
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Error al crear el checkin')
    } finally {
      setSubmitting(false)
    }
  }

  const getNivelColor = (nivel: number) => {
    if (nivel <= 2) return 'text-green-600'
    if (nivel <= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <ProtectedRoute allowedRoles={['psicologo']}>
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
              <a href="/dashboard/checkins" className="px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium">
                Checkins
              </a>
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
              <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-1">Bienestar</p>
              <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">
                Checkins de empleados
              </h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-[#264653] transition-all"
            >
              {showForm ? 'Cancelar' : 'Nuevo checkin'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-8 rounded-2xl border border-[#E9ECEF] mb-6">
              <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-6">
                Registrar checkin
              </h2>
              <form onSubmit={handleCrear} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#264653]">
                    Empleado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.empleado_id}
                    onChange={(e) => setForm({ ...form, empleado_id: e.target.value })}
                    required
                    className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                  >
                    <option value="">Selecciona un empleado</option>
                    {empleados.map((e) => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#264653]">Estado de ánimo (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={form.estado_animo}
                      onChange={(e) => setForm({ ...form, estado_animo: parseInt(e.target.value) })}
                      className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#264653]">Nivel de estrés (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={form.nivel_estres}
                      onChange={(e) => setForm({ ...form, nivel_estres: parseInt(e.target.value) })}
                      className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#264653]">Horas de sueño</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      step={0.5}
                      value={form.horas_sueno}
                      onChange={(e) => setForm({ ...form, horas_sueno: parseFloat(e.target.value) })}
                      className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#264653]">Notas</label>
                  <textarea
                    value={form.notas}
                    onChange={(e) => setForm({ ...form, notas: e.target.value })}
                    placeholder="Observaciones de la sesión..."
                    rows={3}
                    className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-[#2A9D8F] text-white rounded-lg font-semibold hover:bg-[#264653] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar checkin'}
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
          ) : checkins.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E9ECEF]">
              <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">
                Sin checkins registrados
              </p>
              <p className="text-[#495057]">Registra el primer checkin después de una sesión</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {checkins.map((checkin) => (
                <div key={checkin.id} className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[#495057] text-sm">
                      {new Date(checkin.fecha).toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[#495057] mb-1">Estado de ánimo</p>
                      <p className={`text-2xl font-bold ${getNivelColor(6 - checkin.estado_animo)}`}>
                        {checkin.estado_animo}/5
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#495057] mb-1">Nivel de estrés</p>
                      <p className={`text-2xl font-bold ${getNivelColor(checkin.nivel_estres)}`}>
                        {checkin.nivel_estres}/5
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#495057] mb-1">Horas de sueño</p>
                      <p className="text-2xl font-bold text-[#264653]">
                        {checkin.horas_sueno}h
                      </p>
                    </div>
                  </div>
                  {checkin.notas && (
                    <p className="mt-3 text-[#495057] text-sm border-t border-[#E9ECEF] pt-3">
                      {checkin.notas}
                    </p>
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