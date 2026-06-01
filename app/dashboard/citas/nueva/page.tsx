'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../src/hooks/useAuth'
import { citasService } from '../../../../src/services/citas.service'
import { usuariosService } from '../../../../src/services/usuarios.service'
import { Usuario } from '../../../../src/types'

export default function NuevaCitaPage() {
  const { usuario, loading } = useAuth()
  const router = useRouter()
  const [psicologos, setPsicologos] = useState<Usuario[]>([])
  const [form, setForm] = useState({
    psicologo_id: '',
    fecha_hora: '',
    duracion_minutos: 60,
    notas: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !usuario) router.push('/login')
    if (!loading && usuario?.rol !== 'empleado') router.push('/dashboard')
  }, [usuario, loading, router])

  useEffect(() => {
    const fetchPsicologos = async () => {
      try {
        const usuarios = await usuariosService.getAll()
        setPsicologos(usuarios.filter((u: Usuario) => u.rol === 'psicologo'))
      } catch {
        setError('Error al cargar los psicólogos')
      }
    }
    if (usuario) fetchPsicologos()
  }, [usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await citasService.create(form)
      router.push('/dashboard/citas')
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || 'Error al crear la cita')
    } finally {
      setSubmitting(false)
    }
  }

  const hoy = new Date()
  const minFecha = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  return (
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
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-[#495057] hover:text-[#264653] text-sm mb-4 flex items-center gap-2"
          >
            ← Volver
          </button>
          <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-1">Nueva cita</p>
          <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">
            Agenda una sesión
          </h1>
        </div>

        <div className="max-w-lg bg-white p-8 rounded-2xl border border-[#E9ECEF]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#264653]">
                Psicólogo <span className="text-red-500">*</span>
              </label>
              <select
                value={form.psicologo_id}
                onChange={(e) => setForm({ ...form, psicologo_id: e.target.value })}
                required
                className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
              >
                <option value="">Selecciona un psicólogo</option>
                {psicologos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#264653]">
                Fecha y hora <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={form.fecha_hora}
                onChange={(e) => setForm({ ...form, fecha_hora: e.target.value })}
                required
                min={minFecha}
                className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#264653]">
                Duración (minutos)
              </label>
              <select
                value={form.duracion_minutos}
                onChange={(e) => setForm({ ...form, duracion_minutos: parseInt(e.target.value) })}
                className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
              >
                <option value={30}>30 minutos</option>
                <option value={60}>60 minutos</option>
                <option value={90}>90 minutos</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#264653]">
                Notas
              </label>
              <textarea
                value={form.notas}
                onChange={(e) => setForm({ ...form, notas: e.target.value })}
                placeholder="Algo que quieras comentar antes de la sesión..."
                rows={3}
                className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 px-6 py-3.5 bg-[#2A9D8F] text-white rounded-lg font-semibold hover:bg-[#264653] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Agendando...' : 'Agendar cita'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}