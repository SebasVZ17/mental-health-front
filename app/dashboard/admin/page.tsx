'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../../src/hooks/useAuth'
import { adminService, EstadisticasAdmin } from '../../../src/services/admin.service'
import { Usuario } from '../../../src/types'
import { ProtectedRoute } from '../../../src/components/ProtectedRoute'

export default function AdminPage() {
  const { usuario, logout } = useAuth()
  const [stats, setStats] = useState<EstadisticasAdmin | null>(null)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [tab, setTab] = useState<'estadisticas' | 'usuarios'>('estadisticas')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsData, usuariosData] = await Promise.all([
        adminService.getEstadisticas(),
        adminService.getUsuarios(),
      ])
      setStats(statsData)
      setUsuarios(usuariosData)
    } catch {
      setError('Error al cargar los datos de administración')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (id: string) => {
    try {
      const result = await adminService.toggleActivo(id)
      setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, activo: result.activo } : u))
    } catch {
      setError('Error al cambiar el estado del usuario')
    }
  }

  const getNivelColor = (valor: number, invertido = false) => {
    const nivel = invertido ? 6 - valor : valor
    if (nivel <= 2) return 'text-green-600'
    if (nivel <= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const estadoColors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    confirmada: 'bg-green-100 text-green-700',
    completada: 'bg-blue-100 text-blue-700',
    cancelada: 'bg-red-100 text-red-700',
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#E9ECEF]">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-[#264653] flex flex-col justify-between p-8">
          <div>
            <a href="/" style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white">
              Liber<span className="text-[#2A9D8F]">ate</span>
            </a>
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Menu</p>
              <a href="/dashboard" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">Inicio</a>
              <a href="/dashboard/citas" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">Citas</a>
              <a href="/dashboard/recomendaciones" className="px-4 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all font-medium">Recomendaciones</a>
              <div className="mt-2 mb-1 border-t border-white/10 pt-3">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Admin</p>
              </div>
              <button
                onClick={() => setTab('estadisticas')}
                className={`px-4 py-2.5 rounded-lg text-left font-medium transition-all ${tab === 'estadisticas' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                Estadísticas
              </button>
              <button
                onClick={() => setTab('usuarios')}
                className={`px-4 py-2.5 rounded-lg text-left font-medium transition-all ${tab === 'usuarios' ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
              >
                Usuarios
              </button>
            </div>
          </div>
          <div>
            <div className="mb-4 p-4 bg-white/10 rounded-lg">
              <p className="text-white font-medium">{usuario?.nombre}</p>
              <p className="text-white/50 text-sm capitalize">{usuario?.rol}</p>
            </div>
            <button
              onClick={logout}
              className="w-full px-4 py-2.5 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="ml-64 p-10">
          <div className="mb-8">
            <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-1">Administración</p>
            <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">
              {tab === 'estadisticas' ? 'Panel de estadísticas' : 'Gestión de usuarios'}
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tab === 'estadisticas' && stats ? (
            <div className="flex flex-col gap-8">

              {/* Cards resumen */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total usuarios', valor: stats.usuarios.total, sub: `${stats.usuarios.empleados} empleados · ${stats.usuarios.psicologos} psicólogos` },
                  { label: 'Total citas', valor: stats.citas.total, sub: `${stats.citas.ultimos7Dias} en los últimos 7 días` },
                  { label: 'Total checkins', valor: stats.checkins.total, sub: 'Registros de bienestar' },
                  { label: 'Empleados críticos', valor: stats.empleadosCriticos.length, sub: 'Requieren atención' },
                ].map((card) => (
                  <div key={card.label} className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                    <p className="text-[#495057] text-sm mb-1">{card.label}</p>
                    <p style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">{card.valor}</p>
                    <p className="text-[#495057] text-xs mt-1">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Citas por estado */}
              <div className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-4">Citas por estado</h2>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(stats.citas.porEstado).map(([estado, cantidad]) => (
                    <div key={estado} className={`px-4 py-3 rounded-xl ${estadoColors[estado] || 'bg-gray-100 text-gray-700'}`}>
                      <p className="text-xs font-medium capitalize">{estado}</p>
                      <p className="text-2xl font-bold">{cantidad}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empleados críticos */}
              <div className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-4">
                  Empleados en estado crítico
                </h2>
                {stats.empleadosCriticos.length === 0 ? (
                  <p className="text-[#495057]">No hay empleados en estado crítico actualmente.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {stats.empleadosCriticos.map((emp) => (
                      <div key={emp.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                        <div>
                          <p className="font-semibold text-[#264653]">{emp.nombre}</p>
                          <p className="text-sm text-[#495057]">{emp.email} {emp.empresa ? `· ${emp.empresa}` : ''}</p>
                          <p className="text-xs text-[#495057] mt-1">
                            Checkin: {new Date(emp.fecha).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex gap-4 text-center">
                          <div>
                            <p className="text-xs text-[#495057]">Ánimo</p>
                            <p className={`text-xl font-bold ${getNivelColor(emp.estado_animo, true)}`}>{emp.estado_animo}/5</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#495057]">Estrés</p>
                            <p className={`text-xl font-bold ${getNivelColor(emp.nivel_estres)}`}>{emp.nivel_estres}/5</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#495057]">Sueño</p>
                            <p className={`text-xl font-bold ${getNivelColor(emp.horas_sueno < 6 ? 5 : 1)}`}>{emp.horas_sueno}h</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top psicólogos */}
              <div className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
                <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-4">
                  Top psicólogos por valoración
                </h2>
                {stats.topPsicologos.length === 0 ? (
                  <p className="text-[#495057]">Aún no hay valoraciones registradas.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {stats.topPsicologos.map((p, i) => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-[#E9ECEF] rounded-xl">
                        <div className="flex items-center gap-4">
                          <span style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-[#264653]/30">#{i + 1}</span>
                          <div>
                            <p className="font-semibold text-[#264653]">{p.nombre}</p>
                            <p className="text-sm text-[#495057]">{p.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex gap-0.5 justify-end mb-1">
                            {[1, 2, 3, 4, 5].map((e) => (
                              <span key={e} className={`text-lg ${p.promedio >= e ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                          <p className="text-sm text-[#495057]">{p.promedio} · {p.total_valoraciones} valoraciones</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          ) : tab === 'usuarios' ? (
            <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#264653] text-white">
                  <tr>
                    {['Nombre', 'Email', 'Rol', 'Empresa', 'Estado', 'Acción'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u, i) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#E9ECEF]/40'}>
                      <td className="px-4 py-3 font-medium text-[#264653]">{u.nombre}</td>
                      <td className="px-4 py-3 text-[#495057]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.rol === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.rol === 'psicologo' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#495057]">{u.empresa ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.rol !== 'admin' && (
                          <button
                            onClick={() => handleToggle(u.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              u.activo
                                ? 'border border-red-200 text-red-500 hover:bg-red-50'
                                : 'border border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </ProtectedRoute>
  )
}
