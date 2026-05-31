'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { usuario, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !usuario) {
      router.push('/login')
    }
    if (!loading && usuario && allowedRoles && !allowedRoles.includes(usuario.rol)) {
      router.push('/dashboard')
    }
  }, [usuario, loading, router, allowedRoles])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E9ECEF]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#495057]">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!usuario) return null
  if (allowedRoles && !allowedRoles.includes(usuario.rol)) return null

  return <>{children}</>
}