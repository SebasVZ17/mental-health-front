'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../src/hooks/useAuth'
import { checkinsService } from '../../../src/services/checkins.service'
import { citasService } from '../../../src/services/citas.service'
import { Checkin } from '../../../src/types'
import { ProtectedRoute } from '../../../src/components/ProtectedRoute'
import { jsPDF } from 'jspdf'

type Nivel = 'bajo' | 'medio' | 'alto'

interface TallerConfig {
  titulo: string
  descripcion: string
  actividades: string[]
  reflexion: string
}

const talleres: Record<Nivel, TallerConfig> = {
  bajo: {
    titulo: 'Taller de Bienestar: Manteniendo tu equilibrio',
    descripcion: 'Tu valoración indica un buen estado general. Este taller te ayudará a mantener y fortalecer tu bienestar.',
    actividades: [
      '1. Diario de gratitud: Escribe 3 cosas positivas de tu día cada noche durante 7 días.',
      '2. Movimiento consciente: 20 minutos de caminata al aire libre 3 veces por semana.',
      '3. Conexión social: Agenda una actividad con alguien de confianza esta semana.',
      '4. Hobby creativo: Dedica 30 minutos a una actividad que disfrutes (música, dibujo, lectura).',
      '5. Rutina de sueño: Establece un horario fijo para dormir y despertar.',
    ],
    reflexion: 'Recuerda que el bienestar es un proceso continuo. Celebra tus logros y sigue construyendo hábitos positivos.',
  },
  medio: {
    titulo: 'Taller de Bienestar: Gestionando el estrés',
    descripcion: 'Tu valoración indica niveles moderados de estrés. Este taller te brinda herramientas prácticas para recuperar el equilibrio.',
    actividades: [
      '1. Respiración 4-7-8: Inhala 4 seg, retén 7 seg, exhala 8 seg. Repite 4 veces al día.',
      '2. Técnica de grounding: Identifica 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas.',
      '3. Gestión del tiempo: Haz una lista de tareas priorizando las 3 más importantes del día.',
      '4. Pausas activas: Cada 2 horas de trabajo, toma 5 minutos para estirarte y respirar.',
      '5. Límites digitales: Desconéctate de pantallas 1 hora antes de dormir.',
      '6. Journaling: Escribe qué situaciones te generan estrés y qué está en tu control cambiar.',
    ],
    reflexion: 'El estrés moderado es manejable con las herramientas correctas. Sé amable contigo mismo durante este proceso.',
  },
  alto: {
    titulo: 'Taller de Bienestar: Recuperando tu calma',
    descripcion: 'Tu valoración indica niveles elevados de estrés o bajo estado de ánimo. Este taller te ofrece apoyo inmediato y estrategias de recuperación.',
    actividades: [
      '1. Respiración de emergencia: Cuando sientas crisis, exhala completamente y respira lento por 2 minutos.',
      '2. Autocuidado básico: Asegúrate de comer, hidratarte y dormir. Son la base de todo lo demás.',
      '3. Red de apoyo: Identifica 2 personas de confianza con quienes puedas hablar esta semana.',
      '4. Reducción de carga: Delega o pospone tareas no urgentes. No todo tiene que hacerse hoy.',
      '5. Movimiento suave: 10 minutos de estiramiento o yoga restaurativo cada mañana.',
      '6. Autocompasión: Escribe una carta amable hacia ti mismo como si le escribieras a un amigo.',
      '7. Consulta profesional: Considera hablar con tu psicólogo sobre lo que estás viviendo.',
    ],
    reflexion: 'Pedir ayuda es un acto de valentía. No estás solo/a en esto. Tu bienestar es la prioridad.',
  },
}

function getNivel(estado_animo: number, nivel_estres: number): Nivel {
  const score = nivel_estres - estado_animo
  if (score <= 0) return 'bajo'
  if (score <= 2) return 'medio'
  return 'alto'
}

function descargarTaller(checkin: Checkin, nombreEmpleado: string) {
  const nivel = getNivel(checkin.estado_animo, checkin.nivel_estres)
  const taller = talleres[nivel]
  const doc = new jsPDF()
  const margen = 20
  const ancho = 170
  let y = 20

  // Encabezado
  doc.setFillColor(38, 70, 83)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Liberate', margen, 18)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Plataforma de Salud Mental', margen, 26)
  doc.text(`Generado: ${new Date().toLocaleDateString('es-CO')}`, margen, 33)
  y = 55

  // Título del taller
  doc.setTextColor(38, 70, 83)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  const tituloLines = doc.splitTextToSize(taller.titulo, ancho)
  doc.text(tituloLines, margen, y)
  y += tituloLines.length * 8 + 4

  // Datos del empleado
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Empleado: ${nombreEmpleado}`, margen, y)
  y += 6
  doc.text(`Fecha del checkin: ${new Date(checkin.fecha).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, margen, y)
  y += 6
  doc.text(`Estado de ánimo: ${checkin.estado_animo}/5  |  Nivel de estrés: ${checkin.nivel_estres}/5  |  Horas de sueño: ${checkin.horas_sueno ?? 'N/A'}h`, margen, y)
  y += 10

  // Línea separadora
  doc.setDrawColor(42, 157, 143)
  doc.setLineWidth(0.5)
  doc.line(margen, y, 190, y)
  y += 10

  // Descripción
  doc.setTextColor(73, 80, 87)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'italic')
  const descLines = doc.splitTextToSize(taller.descripcion, ancho)
  doc.text(descLines, margen, y)
  y += descLines.length * 6 + 10

  // Actividades
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(38, 70, 83)
  doc.text('Actividades recomendadas', margen, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(73, 80, 87)
  for (const actividad of taller.actividades) {
    const lines = doc.splitTextToSize(actividad, ancho)
    if (y + lines.length * 6 > 270) {
      doc.addPage()
      y = 20
    }
    doc.text(lines, margen, y)
    y += lines.length * 6 + 4
  }

  y += 6
  // Línea separadora
  doc.setDrawColor(42, 157, 143)
  doc.line(margen, y, 190, y)
  y += 10

  // Reflexión final
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(38, 70, 83)
  doc.text('Reflexión final', margen, y)
  y += 7
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(10)
  doc.setTextColor(73, 80, 87)
  const reflexionLines = doc.splitTextToSize(taller.reflexion, ancho)
  doc.text(reflexionLines, margen, y)

  doc.save(`taller-bienestar-${nombreEmpleado.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}

export default function CheckinsPage() {
  const { usuario } = useAuth()
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [empleados, setEmpleados] = useState<{ id: string; nombre: string; email: string }[]>([])
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
      const [checkinsData, pacientesData] = await Promise.all([
        checkinsService.getAll(),
        citasService.getMisPacientes(),
      ])
      setCheckins(checkinsData.data)
      setEmpleados(pacientesData)
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
      await checkinsService.create({ ...form, horas_sueno: Number(form.horas_sueno) })
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

  const getNivelBadge = (estado_animo: number, nivel_estres: number) => {
    const nivel = getNivel(estado_animo, nivel_estres)
    const config = {
      bajo: { label: 'Bienestar bueno', cls: 'bg-green-100 text-green-700' },
      medio: { label: 'Estrés moderado', cls: 'bg-yellow-100 text-yellow-700' },
      alto: { label: 'Atención requerida', cls: 'bg-red-100 text-red-700' },
    }
    return config[nivel]
  }

  const getNombreEmpleado = (checkin: Checkin) => {
    if (checkin.usuarios?.nombre) return checkin.usuarios.nombre
    const emp = empleados.find((e) => e.id === checkin.empleado_id)
    return emp?.nombre || 'Empleado desconocido'
  }

  return (
    <ProtectedRoute allowedRoles={['psicologo']}>
      <div className="min-h-screen bg-[#E9ECEF]">
        <div className="fixed top-0 left-0 h-full w-64 bg-[#264653] flex flex-col justify-between p-8">
          <div>
            <a href="/" style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white">
              Liber<span className="text-[#2A9D8F]">ate</span>
            </a>
            <div className="mt-10 flex flex-col gap-2">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Menu</p>
              <a href="/dashboard" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">Inicio</a>
              <a href="/dashboard/citas" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">Citas</a>
              <a href="/dashboard/checkins" className="px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium">Checkins</a>
              <a href="/dashboard/recomendaciones" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">Recomendaciones</a>
            </div>
          </div>
          <div>
            <div className="mb-4 p-4 bg-white/10 rounded-lg">
              <p className="text-white font-medium">{usuario?.nombre}</p>
              <p className="text-white/50 text-sm capitalize">{usuario?.rol}</p>
            </div>
          </div>
        </div>

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
                      type="number" min={1} max={5}
                      value={form.estado_animo}
                      onChange={(e) => setForm({ ...form, estado_animo: parseInt(e.target.value) })}
                      className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#264653]">Nivel de estrés (1-5)</label>
                    <input
                      type="number" min={1} max={5}
                      value={form.nivel_estres}
                      onChange={(e) => setForm({ ...form, nivel_estres: parseInt(e.target.value) })}
                      className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[#264653]">Horas de sueño</label>
                    <input
                      type="number" min={1} max={12} step={0.5}
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : checkins.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E9ECEF]">
              <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">Sin checkins registrados</p>
              <p className="text-[#495057]">Registra el primer checkin después de una sesión</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {checkins.map((checkin) => {
                const nombreEmpleado = getNombreEmpleado(checkin)
                const badge = getNivelBadge(checkin.estado_animo, checkin.nivel_estres)
                return (
                  <div key={checkin.id} className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-[#264653] text-base">{nombreEmpleado}</p>
                        <p className="text-[#495057] text-sm">
                          {new Date(checkin.fecha).toLocaleDateString('es-CO', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
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
                        <p className="text-2xl font-bold text-[#264653]">{checkin.horas_sueno}h</p>
                      </div>
                    </div>

                    {checkin.notas && (
                      <p className="text-[#495057] text-sm border-t border-[#E9ECEF] pt-3 mb-4">{checkin.notas}</p>
                    )}


                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
