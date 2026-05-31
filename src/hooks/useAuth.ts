'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '../services/auth.service'
import { Usuario } from '../types'

export const useAuth = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const usuarioGuardado = authService.getUsuario()
    setUsuario(usuarioGuardado)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    localStorage.setItem('token', response.token)
    localStorage.setItem('usuario', JSON.stringify(response.usuario))
    document.cookie = `token=${response.token}; path=/; max-age=86400`
    setUsuario(response.usuario)
    return response
  }

  const register = async (data: {
    nombre: string
    email: string
    password: string
    rol?: string
    empresa?: string
    cargo?: string
  }) => {
    const response = await authService.register(data)
    localStorage.setItem('token', response.token)
    localStorage.setItem('usuario', JSON.stringify(response.usuario))
    document.cookie = `token=${response.token}; path=/; max-age=86400`
    setUsuario(response.usuario)
    return response
  }

  const logout = () => {
    authService.logout()
    document.cookie = 'token=; path=/; max-age=0'
    setUsuario(null)
    router.push('/login')
  }

  const isAuthenticated = !!usuario

  return { usuario, loading, login, register, logout, isAuthenticated }
}