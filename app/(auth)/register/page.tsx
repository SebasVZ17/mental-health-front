'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../src/hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'empleado',
    empresa: '',
    cargo: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await register(form)
      router.push('/dashboard')
    } catch (error: unknown) {
      const err = error as { message?: string }
      setErrors({ general: err.message || 'Error al registrarse' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E9ECEF] flex">
      {/* Panel izquierdo */}
      <div className="hidden md:flex w-1/2 bg-[#2A9D8F] flex-col justify-between p-12">
        <Link href="/" style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white">
          Liber<span className="text-white/60">ate</span>
        </Link>
        <div>
          <p className="text-white/60 uppercase tracking-widest text-sm mb-4">Empieza hoy</p>
          <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-4xl font-bold text-white leading-snug mb-6">
            Un lugar donde el bienestar importa
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Crea tu cuenta y conecta con psicólogos especializados en bienestar laboral.
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
            Crear cuenta
          </h1>
          <p className="text-[#495057] mb-8">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#2A9D8F] font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="nombre" className="text-sm font-medium text-[#264653]">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Juan Pérez"
                required
                className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-[#264653]">
                Correo electrónico <span className="text-red-500">*</span>
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
                  ${errors.general ? 'border-red-400' : 'border-[#E9ECEF] focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20'}`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-[#264653]">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="rol" className="text-sm font-medium text-[#264653]">
                Rol
              </label>
              <select
                id="rol"
                name="rol"
                value={form.rol}
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
              >
                <option value="empleado">Empleado</option>
                <option value="psicologo">Psicólogo</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="empresa" className="text-sm font-medium text-[#264653]">
                  Empresa
                </label>
                <input
                  id="empresa"
                  name="empresa"
                  type="text"
                  value={form.empresa}
                  onChange={handleChange}
                  placeholder="Opcional"
                  className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="cargo" className="text-sm font-medium text-[#264653]">
                  Cargo
                </label>
                <input
                  id="cargo"
                  name="cargo"
                  type="text"
                  value={form.cargo}
                  onChange={handleChange}
                  placeholder="Opcional"
                  className="px-4 py-3 rounded-lg border border-[#E9ECEF] bg-white text-[#495057] outline-none focus:border-[#2A9D8F] focus:ring-2 focus:ring-[#2A9D8F]/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-6 py-3.5 bg-[#2A9D8F] text-white rounded-lg font-semibold hover:bg-[#264653] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}