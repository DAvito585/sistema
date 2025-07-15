"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleNavigation = (route: string) => {
    switch (route) {
      case "login":
        router.push("/login")
        break
      case "postgraduante":
        router.push("/postgraduante")
        break
      case "postulacion-docente":
        router.push("/postulacion-docente")
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-300">
      {/* Theme Toggle - Fixed Position */}

      <div className="w-full max-w-5xl p-12 text-center rounded-3xl shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700 transition-colors duration-300">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-8">
            <Image
              src="/images/logo-emi-posgrado.png"
              alt="EMI Posgrado Logo"
              width={300}
              height={120}
              className="mx-auto object-contain"
            />
          </div>
          <h1
            className="text-6xl font-bold mb-4 uppercase tracking-wider"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(to right, #1E3A8A, #1E40AF, #2563EB)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            EMI - POSTGRADO
          </h1>
          <div className="w-32 h-1 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-yellow-500"></div>
          <p className="text-xl font-medium italic text-gray-700 dark:text-gray-300">
            Escuela Militar de Ingeniería - Sistema Integral de Gestión Académica
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Inicio de Sesión */}
          <div
            className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => handleNavigation("login")}
            onMouseEnter={() => setHoveredCard("login")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`p-8 rounded-2xl border-4 shadow-xl transition-all duration-300 ${
                hoveredCard === "login"
                  ? "bg-blue-50 dark:bg-blue-950 border-blue-700 dark:border-blue-400 shadow-2xl"
                  : "bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-600"
              }`}
            >
              <div className="mb-6">
                <Image
                  src="/images/castillo-azul.png"
                  alt="Inicio de Sesión"
                  width={120}
                  height={120}
                  className="mx-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  hoveredCard === "login" ? "text-blue-800 dark:text-blue-300" : "text-gray-900 dark:text-white"
                }`}
              >
                Iniciar Sesión
              </h3>
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Acceso para personal administrativo y docente
              </p>
              <div className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                Roles: Coordinador, Facilitador, Docente, Director, Rector, Ing. Facturación, Superadmin
              </div>
            </div>
          </div>

          {/* Post-Graduante */}
          <div
            className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => handleNavigation("postgraduante")}
            onMouseEnter={() => setHoveredCard("postgraduante")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`p-8 rounded-2xl border-4 shadow-xl transition-all duration-300 ${
                hoveredCard === "postgraduante"
                  ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-600 dark:border-yellow-400 shadow-2xl"
                  : "bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-600"
              }`}
            >
              <div className="mb-6">
                <Image
                  src="/images/castillo-amarillo.png"
                  alt="Post-Graduante"
                  width={120}
                  height={120}
                  className="mx-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  hoveredCard === "postgraduante"
                    ? "text-yellow-700 dark:text-yellow-300"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Post-Graduante
              </h3>
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Postulación a programas de postgrado
              </p>
              <div className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                Maestrías, Doctorados, Especializaciones
              </div>
            </div>
          </div>

          {/* Postulación Docente */}
          <div
            className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => handleNavigation("postulacion-docente")}
            onMouseEnter={() => setHoveredCard("postulacion-docente")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className={`p-8 rounded-2xl border-4 shadow-xl transition-all duration-300 ${
                hoveredCard === "postulacion-docente"
                  ? "bg-blue-50 dark:bg-blue-950 border-blue-700 dark:border-blue-400 shadow-2xl"
                  : "bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-600"
              }`}
            >
              <div className="mb-6">
                <Image
                  src="/images/castillo-azul.png"
                  alt="Postulación Docente"
                  width={120}
                  height={120}
                  className="mx-auto object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  hoveredCard === "postulacion-docente"
                    ? "text-blue-800 dark:text-blue-300"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Postulación Docente
              </h3>
              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Registro para docentes especialistas
              </p>
              <div className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                Profesionales especializados en áreas técnicas
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 pt-8 border-blue-200 dark:border-blue-700">
          <p className="text-sm font-medium italic text-gray-600 dark:text-gray-400">
            © 2025 Escuela Militar de Ingeniería - Departamento de Postgrado
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-500">
            Sistema desarrollado para la gestión integral académica
          </p>
        </div>
      </div>
    </div>
  )
}
