'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../src/hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await login(form.email, form.password)
      if (response.usuario.rol === 'psicologo') {
        router.push('/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      setErrors({ general: err.message || 'Credenciales inválidas' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E9ECEF] flex">
      {/* Panel izquierdo */}
      <div className="hidden md:flex w-1/2 bg-[#264653] flex-col justify-between p-12">
        <Link href="/" style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white">
          Liber<span className="text-[#2A9D8F]">ate</span>
        </Link>
        <div>
          <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-4">Bienvenido de nuevo</p>
          <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-4xl font-bold text-white leading-snug mb-6">
            Tu bienestar te estaba esperando
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Inicia sesión para ver tus citas, checkins y recomendaciones personalizadas.
          </p>
        </div>
        <p className="text-white/30 text-sm">© 2026 Liberate</p>
      </div>

      {/* Panel derecho */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8">
            <Link href="/" style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-[#264653]">
              Liber<span className="text-[#2A9D8F]">ate</span>
            </Link>
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-3xl font-bold text-[#264653] mb-2">
            Iniciar sesión
          </h1>
          <p className="text-[#495057] mb-8">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#2A9D8F] font-medium hover:underline">
              Regístrate
            </Link>
          </p>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-[#264653]">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
                className={`px-4 py-3 rounded-lg border bg-white text-[#495057] outline-none transition-all
                  ${errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#E9ECEF] focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20'}`}
              />
              {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-[#264653]">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className={`px-4 py-3 rounded-lg border bg-white text-[#495057] outline-none transition-all
                  ${errors.password ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-[#E9ECEF] focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20'}`}
              />
              {errors.password && <span className="text-sm text-red-500">{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-6 py-3.5 bg-[#264653] text-white rounded-lg font-semibold hover:bg-[#2A9D8F] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}