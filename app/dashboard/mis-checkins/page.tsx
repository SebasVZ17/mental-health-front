'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../src/hooks/useAuth'
import { checkinsService } from '../../../src/services/checkins.service'
import { Checkin } from '../../../src/types'
import { ProtectedRoute } from '../../../src/components/ProtectedRoute'
import { jsPDF } from 'jspdf'

interface Seccion {
  titulo: string
  items: string[]
}

interface TallerConfig {
  titulo: string
  descripcion: string
  secciones: Seccion[]
  reflexion: string
}

function generarTaller(estado_animo: number, nivel_estres: number, horas_sueno: number): TallerConfig {
  const secciones: Seccion[] = []

  // ESTADO DE ÁNIMO
  if (estado_animo <= 2) {
    secciones.push({
      titulo: 'Estado de animo bajo - Actividades para levantar el animo',
      items: [
        'Sal a caminar 15 minutos al aire libre aunque no tengas ganas. El movimiento activa endorfinas.',
        'Escucha una playlist de musica que asocies con momentos felices de tu vida.',
        'Escribe en un papel 3 cosas pequenas que salieron bien hoy, por minimas que sean.',
        'Llama o escribe a alguien de confianza. No tienes que hablar del problema, solo conectar.',
        'Evita el aislamiento: aunque estes en casa, cambia de habitacion o de ambiente.',
        'Limita el consumo de noticias y redes sociales a maximo 20 minutos al dia.',
      ],
    })
  } else if (estado_animo === 3) {
    secciones.push({
      titulo: 'Estado de animo neutro - Actividades para estabilizarte',
      items: [
        'Practica 10 minutos de meditacion guiada al despertar (apps como Insight Timer son gratuitas).',
        'Establece una pequena meta diaria alcanzable y celebrala cuando la cumplas.',
        'Haz una actividad creativa: dibujar, cocinar algo nuevo, escribir, tocar un instrumento.',
        'Sal a tomar el sol al menos 10 minutos. La luz natural regula el estado de animo.',
        'Revisa si hay algo pendiente que te genera tension y da un pequeno paso para resolverlo.',
      ],
    })
  } else if (estado_animo === 4) {
    secciones.push({
      titulo: 'Buen estado de animo - Actividades para mantenerlo',
      items: [
        'Aprovecha esta energia para avanzar en un proyecto personal que hayas postergado.',
        'Comparte tu bienestar: haz algo amable por alguien sin esperar nada a cambio.',
        'Documenta como te sientes hoy: escribe que hiciste diferente para replicarlo en dias dificiles.',
        'Practica gratitud activa: dile a alguien especificamente por que lo valoras.',
        'Usa este momento para planificar la semana con claridad y optimismo.',
      ],
    })
  } else {
    secciones.push({
      titulo: 'Excelente estado de animo - Potencia tu bienestar',
      items: [
        'Estas en tu mejor momento emocional. Usa esta energia para enfrentar retos pendientes.',
        'Ayuda a alguien de tu entorno que este pasando por un momento dificil.',
        'Aprende algo nuevo esta semana: un curso, un libro, una habilidad.',
        'Celebra conscientemente este estado: reconoce que habitos lo generaron.',
        'Comparte tu energia positiva en tu entorno laboral y familiar.',
      ],
    })
  }

  // NIVEL DE ESTRÉS
  if (nivel_estres >= 5) {
    secciones.push({
      titulo: 'Estres critico - Tecnicas de regulacion urgente',
      items: [
        'AHORA: Respira lento. Exhala completamente, luego inhala 4 seg, retén 4 seg, exhala 6 seg.',
        'Para todo lo que puedas parar hoy. Tu salud es la prioridad numero uno.',
        'Identifica la fuente principal de estres y escribe que parte esta en tu control.',
        'Llama a alguien de confianza o a tu psicologo hoy mismo.',
        'Elimina al menos 2 compromisos de tu agenda esta semana.',
        'Toma una ducha de agua tibia por 10 minutos. El calor reduce el cortisol.',
        'Evita cafeina, alcohol y ultraprocesados: empeoran la respuesta al estres.',
      ],
    })
  } else if (nivel_estres === 4) {
    secciones.push({
      titulo: 'Estres alto - Estrategias de reduccion',
      items: [
        'Respiracion de caja: inhala 4 seg, reten 4 seg, exhala 4 seg, reten 4 seg. Repite 5 veces.',
        'Tecnica 5-4-3-2-1: nombra 5 cosas que ves, 4 que tocas, 3 que escuchas, 2 que hueles, 1 que saboreas.',
        'Pon un limite claro: define una hora en la que dejaras de trabajar o de pensar en el problema.',
        'Delega o elimina al menos una tarea de tu lista de hoy. No todo es urgente.',
        'Haz ejercicio moderado hoy: 30 minutos de caminata rapida reduce el cortisol significativamente.',
        'Escribe en papel todo lo que te preocupa. Sacarlo de la cabeza reduce la carga mental.',
      ],
    })
  } else if (nivel_estres === 3) {
    secciones.push({
      titulo: 'Estres moderado - Gestion del equilibrio',
      items: [
        'Haz una lista de todo lo que te preocupa y clasificalo: puedo controlarlo / no puedo controlarlo.',
        'Toma pausas activas de 5 minutos cada 90 minutos de trabajo.',
        'Practica la respiracion 4-7-8: inhala 4 seg, reten 7 seg, exhala 8 seg.',
        'Reduce los compromisos no esenciales esta semana. Aprende a decir no con amabilidad.',
        'Haz ejercicio moderado 3 veces esta semana: caminar, nadar, bicicleta.',
      ],
    })
  } else {
    secciones.push({
      titulo: 'Estres bajo - Mantén este equilibrio',
      items: [
        'Excelente manejo del estres. Sigue con tus rutinas actuales.',
        'Practica mindfulness 5 minutos al dia para mantener la calma como habito.',
        'Usa este estado de calma para tener conversaciones dificiles que hayas postergado.',
        'Ayuda a alguien de tu entorno que este bajo presion.',
      ],
    })
  }

  // HORAS DE SUEÑO
  if (horas_sueno < 5) {
    secciones.push({
      titulo: 'Sueño muy insuficiente - Plan de recuperacion urgente',
      items: [
        'Esta noche: acuestate 1 hora antes de lo habitual sin excepcion.',
        'Apaga todas las pantallas 45 minutos antes de dormir. La luz azul bloquea la melatonina.',
        'Mantén tu habitacion a 18-20 grados, completamente oscura y silenciosa.',
        'Evita cafeina despues del mediodia (cafe, te negro, bebidas energeticas, chocolate).',
        'Si no puedes dormir en 20 minutos, levantate, haz algo tranquilo y vuelve cuando tengas sueno.',
        'Habla con tu medico si el insomnio persiste mas de 2 semanas.',
        'Evita el alcohol: aunque parece que ayuda a dormir, fragmenta el sueno profundo.',
      ],
    })
  } else if (horas_sueno < 7) {
    secciones.push({
      titulo: 'Sueño insuficiente - Mejora tu descanso',
      items: [
        'Intenta acostarte 30 minutos antes esta semana para llegar a las 7-8 horas.',
        'Crea un ritual de 20 minutos antes de dormir: luz tenue, lectura o musica suave.',
        'Evita el celular al menos 30 minutos antes de dormir.',
        'Una infusion de manzanilla o valeriana puede ayudarte a relajarte.',
        'Haz ejercicio durante el dia (no antes de dormir) para mejorar la calidad del sueno.',
      ],
    })
  } else if (horas_sueno <= 9) {
    secciones.push({
      titulo: 'Sueno adecuado - Mantén esta rutina',
      items: [
        'Excelente. Mantén tu horario de sueno consistente, incluso los fines de semana.',
        'Asegurate de que la calidad tambien sea buena: sin interrupciones y sintiendote descansado/a.',
        'Evita cambios bruscos de horario en vacaciones o fines de semana largos.',
      ],
    })
  } else {
    secciones.push({
      titulo: 'Sueno excesivo - Revisa tu descanso',
      items: [
        'Dormir mas de 9 horas regularmente puede indicar fatiga emocional o fisica.',
        'Comenta con tu medico si te sientes cansado/a a pesar de dormir mucho.',
        'Intenta mantener un horario fijo de sueno para regular tu ritmo circadiano.',
        'El ejercicio moderado durante el dia puede mejorar la calidad del sueno.',
      ],
    })
  }

  // TÍTULO Y DESCRIPCIÓN según combinación
  let titulo = ''
  let descripcion = ''

  if (estado_animo >= 4 && nivel_estres <= 2) {
    titulo = 'Taller de Bienestar: Estas en tu mejor momento'
    descripcion = `Tu estado de animo es excelente (${estado_animo}/5) y tu estres esta bajo control (${nivel_estres}/5). Este taller te ayuda a mantener y potenciar este estado.`
  } else if (estado_animo >= 4 && nivel_estres >= 4) {
    titulo = 'Taller de Bienestar: Buen animo bajo presion'
    descripcion = `Tienes un buen estado de animo (${estado_animo}/5) pero tu nivel de estres es alto (${nivel_estres}/5). Es importante atender el estres antes de que afecte tu bienestar.`
  } else if (estado_animo <= 2 && nivel_estres >= 4) {
    titulo = 'Taller de Bienestar: Apoyo prioritario'
    descripcion = `Tu estado de animo esta bajo (${estado_animo}/5) y tu estres es elevado (${nivel_estres}/5). Este taller te ofrece herramientas concretas de apoyo inmediato.`
  } else if (estado_animo <= 2 && nivel_estres <= 2) {
    titulo = 'Taller de Bienestar: Recuperando la energia'
    descripcion = `Tu estres esta controlado (${nivel_estres}/5) pero tu estado de animo necesita atencion (${estado_animo}/5). Enfocate en actividades que te recarguen emocionalmente.`
  } else if (estado_animo === 3 && nivel_estres === 3) {
    titulo = 'Taller de Bienestar: Equilibrio en proceso'
    descripcion = `Estado de animo: ${estado_animo}/5 | Estres: ${nivel_estres}/5. Estas en un punto intermedio. Este taller te ayuda a consolidar tu bienestar.`
  } else if (estado_animo >= 4 && nivel_estres === 3) {
    titulo = 'Taller de Bienestar: Buen animo, gestiona el estres'
    descripcion = `Tu animo es bueno (${estado_animo}/5) pero el estres moderado (${nivel_estres}/5) puede afectarte. Trabaja en reducirlo para mantener tu bienestar.`
  } else {
    titulo = 'Taller de Bienestar: Plan personalizado'
    descripcion = `Estado de animo: ${estado_animo}/5 | Estres: ${nivel_estres}/5 | Sueno: ${horas_sueno}h. Tu plan esta diseñado especificamente para tu situacion actual.`
  }

  const reflexion =
    estado_animo <= 2 && nivel_estres >= 4
      ? 'Recuerda que buscar ayuda es un acto de fortaleza. No tienes que atravesar esto solo/a. Tu psicologo esta aqui para acompañarte.'
      : estado_animo >= 4 && nivel_estres <= 2
      ? 'Estas haciendo un gran trabajo cuidando tu bienestar. Sigue asi y comparte esta energia con quienes te rodean.'
      : horas_sueno < 6
      ? 'El sueno es la base de todo lo demas. Priorizar tu descanso esta semana es lo mas importante que puedes hacer por tu salud mental.'
      : 'El bienestar es un camino, no un destino. Cada pequeno paso cuenta. Se paciente y amable contigo mismo/a.'

  return { titulo, descripcion, secciones, reflexion }
}

function descargarTaller(checkin: Checkin, nombreUsuario: string) {
  const horas = Number(checkin.horas_sueno ?? 7)
  const taller = generarTaller(checkin.estado_animo, checkin.nivel_estres, horas)
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

  // Título
  doc.setTextColor(38, 70, 83)
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  const tituloLines = doc.splitTextToSize(taller.titulo, ancho)
  doc.text(tituloLines, margen, y)
  y += tituloLines.length * 8 + 4

  // Datos
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(`Para: ${nombreUsuario}`, margen, y); y += 6
  doc.text(`Fecha: ${new Date(checkin.fecha).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, margen, y); y += 6
  doc.text(`Estado de animo: ${checkin.estado_animo}/5  |  Nivel de estres: ${checkin.nivel_estres}/5  |  Horas de sueno: ${horas}h`, margen, y); y += 10

  // Línea
  doc.setDrawColor(42, 157, 143)
  doc.setLineWidth(0.5)
  doc.line(margen, y, 190, y); y += 10

  // Descripción
  doc.setTextColor(73, 80, 87)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  const descLines = doc.splitTextToSize(taller.descripcion, ancho)
  doc.text(descLines, margen, y)
  y += descLines.length * 6 + 10

  // Secciones
  for (const seccion of taller.secciones) {
    if (y > 250) { doc.addPage(); y = 20 }

    // Fondo del título de sección
    doc.setFillColor(42, 157, 143)
    doc.rect(margen - 2, y - 5, ancho + 4, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    const secTituloLines = doc.splitTextToSize(seccion.titulo, ancho)
    doc.text(secTituloLines, margen, y)
    y += secTituloLines.length * 6 + 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(73, 80, 87)
    for (const item of seccion.items) {
      const lines = doc.splitTextToSize(`• ${item}`, ancho)
      if (y + lines.length * 6 > 275) { doc.addPage(); y = 20 }
      doc.text(lines, margen, y)
      y += lines.length * 6 + 3
    }
    y += 6
  }

  // Reflexión
  if (y > 250) { doc.addPage(); y = 20 }
  doc.setDrawColor(42, 157, 143)
  doc.line(margen, y, 190, y); y += 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(38, 70, 83)
  doc.text('Reflexion final', margen, y); y += 7
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(10)
  doc.setTextColor(73, 80, 87)
  const reflexionLines = doc.splitTextToSize(taller.reflexion, ancho)
  doc.text(reflexionLines, margen, y)

  doc.save(`taller-bienestar-${new Date(checkin.fecha).toLocaleDateString('es-CO').replace(/\//g, '-')}.pdf`)
}

export default function MisCheckinsPage() {
  const { usuario } = useAuth()
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (usuario) fetchCheckins()
  }, [usuario])

  const fetchCheckins = async () => {
    try {
      setLoading(true)
      const response = await checkinsService.getAll()
      setCheckins(response.data)
    } catch {
      setError('Error al cargar tus checkins')
    } finally {
      setLoading(false)
    }
  }

  const getNivelBadge = (estado_animo: number, nivel_estres: number) => {
    const score = nivel_estres - estado_animo
    if (score <= 0) return { label: 'Bienestar bueno', cls: 'bg-green-100 text-green-700' }
    if (score <= 2) return { label: 'Estres moderado', cls: 'bg-yellow-100 text-yellow-700' }
    return { label: 'Atencion requerida', cls: 'bg-red-100 text-red-700' }
  }

  const getNivelColor = (nivel: number) => {
    if (nivel <= 2) return 'text-green-600'
    if (nivel <= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <ProtectedRoute allowedRoles={['empleado']}>
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
              <a href="/dashboard/mis-checkins" className="px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium">Mis checkins</a>
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
          <div className="mb-8">
            <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-1">Bienestar</p>
            <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">
              Mis checkins
            </h1>
            <p className="text-[#495057] mt-1">Cada taller PDF es generado especificamente segun tu valoracion.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : checkins.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#E9ECEF]">
              <p style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">Sin checkins aun</p>
              <p className="text-[#495057]">Tu psicologo registrara un checkin despues de cada sesion.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {checkins.map((checkin) => {
                const badge = getNivelBadge(checkin.estado_animo, checkin.nivel_estres)
                const horas = Number(checkin.horas_sueno ?? 0)
                return (
                  <div key={checkin.id} className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[#495057] text-sm">
                        {new Date(checkin.fecha).toLocaleDateString('es-CO', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-[#495057] mb-1">Estado de animo</p>
                        <p className={`text-2xl font-bold ${getNivelColor(6 - checkin.estado_animo)}`}>
                          {checkin.estado_animo}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#495057] mb-1">Nivel de estres</p>
                        <p className={`text-2xl font-bold ${getNivelColor(checkin.nivel_estres)}`}>
                          {checkin.nivel_estres}/5
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#495057] mb-1">Horas de sueno</p>
                        <p className={`text-2xl font-bold ${getNivelColor(horas < 6 ? 5 : horas < 7 ? 3 : 1)}`}>
                          {horas}h
                        </p>
                      </div>
                    </div>

                    {checkin.notas && (
                      <p className="text-[#495057] text-sm border-t border-[#E9ECEF] pt-3 mb-4">
                        {checkin.notas}
                      </p>
                    )}

                    <button
                      onClick={() => descargarTaller(checkin, usuario?.nombre ?? '')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#264653] text-white rounded-lg text-sm font-medium hover:bg-[#2A9D8F] transition-all"
                    >
                      📄 Descargar taller PDF
                    </button>
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
