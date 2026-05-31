'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

export const Navbar = () => {
  const { usuario, logout, isAuthenticated } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E9ECEF]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-[#264653]">
            Liber<span className="text-[#2A9D8F]">ate</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-[#495057] hover:text-[#2A9D8F] transition-colors font-medium"
              >
                Dashboard
              </Link>
              <span className="text-sm text-[#495057]">
                Hola, <span className="font-medium text-[#264653]">{usuario?.nombre}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg border-2 border-[#264653] text-[#264653] hover:bg-[#264653] hover:text-white transition-all duration-200 font-medium text-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[#495057] hover:text-[#2A9D8F] transition-colors font-medium"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-[#2A9D8F] text-white hover:bg-[#264653] transition-all duration-200 font-medium text-sm"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}