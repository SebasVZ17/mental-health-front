'use client'

import { useAuth } from '../../src/hooks/useAuth'
import { ProtectedRoute } from '../../src/components/ProtectedRoute'

export default function DashboardPage() {
  const { usuario, logout } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#E9ECEF]">
        {/* Sidebar */}
        <div className="fixed top-0 left-0 h-full w-64 bg-[#264653] flex flex-col justify-between p-8">
          <div>
            <span style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white">
              Liber<span className="text-[#2A9D8F]">ate</span>
            </span>
            <div className="mt-10 flex flex-col gap-2">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Menu</p>
              <a href="/dashboard" className="px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium">
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
            <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-1">Panel principal</p>
            <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653]">
              Bienvenido, {usuario?.nombre.split(' ')[0]}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
              <p className="text-[#495057] text-sm mb-1">Rol</p>
              <p style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-[#264653] capitalize">
                {usuario?.rol}
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E9ECEF]">
              <p className="text-[#495057] text-sm mb-1">Correo</p>
              <p className="text-[#264653] font-medium truncate">{usuario?.email}</p>
            </div>
            <div className="bg-[#264653] p-6 rounded-2xl">
              <p className="text-white/60 text-sm mb-1">Estado</p>
              <p style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white">
                Activo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="/dashboard/citas" className="bg-white p-8 rounded-2xl border border-[#E9ECEF] hover:shadow-md transition-shadow block">
              <div className="w-10 h-1 bg-[#2A9D8F] mb-4 rounded-full" />
              <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">
                {usuario?.rol === 'psicologo' ? 'Gestionar citas' : 'Mis citas'}
              </h3>
              <p className="text-[#495057]">
                {usuario?.rol === 'psicologo'
                  ? 'Ver y gestionar las citas de tus pacientes'
                  : 'Agenda y revisa tus sesiones con el psicólogo'}
              </p>
            </a>
            <a href="/dashboard/recomendaciones" className="bg-white p-8 rounded-2xl border border-[#E9ECEF] hover:shadow-md transition-shadow block">
              <div className="w-10 h-1 bg-[#2A9D8F] mb-4 rounded-full" />
              <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-2">
                {usuario?.rol === 'psicologo' ? 'Gestionar recomendaciones' : 'Mis recomendaciones'}
              </h3>
              <p className="text-[#495057]">
                {usuario?.rol === 'psicologo'
                  ? 'Crea y asigna recomendaciones a tus pacientes'
                  : 'Revisa los consejos de tu psicólogo'}
              </p>
            </a>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}