import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E9ECEF]">
      <h1 className="font-heading text-8xl font-bold text-[#264653] mb-4">404</h1>
      <p className="text-xl text-[#495057] mb-8">Página no encontrada</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#2A9D8F] text-white rounded-lg font-medium hover:bg-[#264653] transition-all"
      >
        Volver al inicio
      </Link>
    </div>
  )
}