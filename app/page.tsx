import Link from 'next/link'
import { Navbar } from '../src/components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-24" style={{ background: 'linear-gradient(135deg, #264653 0%, #2A9D8F 100%)' }}>
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#E9ECEF]/70 uppercase tracking-widest text-sm mb-4">Salud mental empresarial</p>
            <h1 style={{ fontFamily: 'Georgia, serif' }} className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
              Cuida a tu equipo desde adentro
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-10">
              Liberate conecta empleados con psicólogos para acompañar el bienestar mental en el trabajo.
              Sin barreras, sin juicios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="px-7 py-3.5 bg-white text-[#264653] rounded-lg font-semibold hover:bg-[#E9ECEF] transition-all duration-200 text-center"
              >
                Crear cuenta
              </Link>
              <Link
                href="/login"
                className="px-7 py-3.5 border border-white/40 text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-200 text-center"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <p className="text-white/60 text-sm mb-1">Estado de hoy</p>
              <p className="text-white text-xl font-semibold">Nivel de estrés: moderado</p>
              <div className="mt-3 h-2 bg-white/20 rounded-full">
                <div className="h-2 bg-white rounded-full w-2/3" />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
              <p className="text-white/60 text-sm mb-1">Próxima cita</p>
              <p className="text-white text-xl font-semibold">Martes 3 de junio</p>
              <p className="text-white/60 text-sm mt-1">Con Dra. Ana Martinez — 10:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-8">
          <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-4">Quiénes somos</p>
          <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-4xl font-bold text-[#264653] mb-6 leading-snug">
            No somos una app de meditación. Somos un puente.
          </h2>
          <p className="text-[#495057] text-lg leading-relaxed">
            Liberate nació de una idea simple: que el bienestar mental en el trabajo merece la misma
            atención que los resultados trimestrales. Conectamos a empleados con psicólogos reales,
            facilitamos el seguimiento del bienestar y ayudamos a los equipos a trabajar desde un lugar
            más sano.
          </p>
        </div>
      </section>

      {/* Divisor */}
      <div className="max-w-5xl mx-auto px-8">
        <hr className="border-[#E9ECEF]" />
      </div>

      {/* Qué encontrarás */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-8">
          <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-4">La plataforma</p>
          <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-4xl font-bold text-[#264653] mb-14 leading-snug">
            Todo lo que necesitas en un solo lugar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="w-10 h-1 bg-[#2A9D8F] mb-6 rounded-full" />
              <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-3">
                Citas con psicólogos
              </h3>
              <p className="text-[#495057] leading-relaxed">
                Agenda sesiones con profesionales según tu disponibilidad. Videollamada o presencial.
              </p>
            </div>
            <div>
              <div className="w-10 h-1 bg-[#2A9D8F] mb-6 rounded-full" />
              <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-3">
                Seguimiento de bienestar
              </h3>
              <p className="text-[#495057] leading-relaxed">
                Registros de estado de ánimo, estrés y sueño que ayudan a tu psicólogo a conocerte mejor.
              </p>
            </div>
            <div>
              <div className="w-10 h-1 bg-[#2A9D8F] mb-6 rounded-full" />
              <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-xl font-bold text-[#264653] mb-3">
                Recomendaciones
              </h3>
              <p className="text-[#495057] leading-relaxed">
                Tu psicólogo te envía recursos y consejos personalizados después de cada sesión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="py-24 bg-[#E9ECEF]">
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-2xl">
            <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-4">Empleados</p>
            <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-[#264653] mb-6">
              Tu espacio para estar bien
            </h3>
            <ul className="space-y-3 text-[#495057]">
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] mt-2 shrink-0" />
                Agenda citas con psicólogos disponibles
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] mt-2 shrink-0" />
                Revisa tus checkins y evolución
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] mt-2 shrink-0" />
                Accede a tus recomendaciones personalizadas
              </li>
            </ul>
          </div>
          <div className="bg-[#264653] p-10 rounded-2xl">
            <p className="text-[#2A9D8F] uppercase tracking-widest text-sm mb-4">Psicólogos</p>
            <h3 style={{ fontFamily: 'Georgia, serif' }} className="text-2xl font-bold text-white mb-6">
              Herramientas para acompañar mejor
            </h3>
            <ul className="space-y-3 text-white/75">
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] mt-2 shrink-0" />
                Gestiona tu agenda de citas
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] mt-2 shrink-0" />
                Registra checkins después de cada sesión
              </li>
              <li className="flex gap-3 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] mt-2 shrink-0" />
                Crea y asigna recomendaciones a tus pacientes
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#264653]">
        <div className="max-w-2xl mx-auto px-8 text-center">
          <h2 style={{ fontFamily: 'Georgia, serif' }} className="text-4xl font-bold text-white mb-4">
            El primer paso es el más importante
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Crea tu cuenta hoy y empieza a construir un entorno de trabajo más saludable.
          </p>
          <Link
            href="/register"
            className="px-8 py-4 bg-[#2A9D8F] text-white rounded-lg font-semibold hover:bg-white hover:text-[#264653] transition-all duration-200 text-lg"
          >
            Empezar ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#264653] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span style={{ fontFamily: 'Georgia, serif' }} className="text-white font-bold text-xl">
            Liberate
          </span>
          <p className="text-white/40 text-sm">
            © 2026 Liberate. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}