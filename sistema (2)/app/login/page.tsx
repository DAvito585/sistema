"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock, ArrowLeft, Bell } from "lucide-react" // Import Bell icon
// Eliminar el componente ThemeToggle de este archivo.
// Se moverá a `app/layout.tsx` para que esté en todas las páginas.
// 1.  Eliminar la línea que importa `ThemeToggle`:
//     `- import { ThemeToggle } from "@/components/theme-toggle"`

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([]) // State for notifications

  // Usuarios predefinidos
  const usuarios = {
    docente: {
      password: "docente123",
      redirect: "/gestion-estudiantes",
      nombre: "Sistema de Gestión de Estudiantes",
    },
    "ing-inscripcion": {
      password: "inscripcion123",
      redirect: "/inscripciones",
      nombre: "Sistema de Inscripciones",
    },
    facturacion: {
      // Nuevo usuario para facturación
      password: "facturacion123",
      redirect: "/facturacion",
      nombre: "Sistema de Facturación",
    },
  }

  // Function to add a notification
  const addNotification = (message: string) => {
    setNotifications((prev) => [...prev, message])
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1)) // Remove oldest notification after 5 seconds
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNotifications([]) // Clear previous notifications

    // Simulación de login
    setTimeout(() => {
      const usuario = usuarios[formData.usuario as keyof typeof usuarios]

      if (usuario && usuario.password === formData.password) {
        addNotification(`✅ ¡Bienvenido! Accediendo al ${usuario.nombre}`)
        router.push(usuario.redirect)
      } else {
        addNotification("❌ Usuario o contraseña incorrectos")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setNotifications([]) // Clear notifications on input change
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 transition-colors duration-300">
      {/* Theme Toggle - Fixed Position */}
      {/* 2.  Eliminar el div que contiene `ThemeToggle`:
          `- <div className="fixed top-6 right-6 z-50">`
          `-   <ThemeToggle />`
          `- </div>` */}

      {/* Notifications */}
      <div className="fixed top-20 right-6 z-40 space-y-2">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`px-4 py-2 rounded-lg shadow-lg animate-pulse flex items-center gap-2 ${
              notification.startsWith("✅") ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm font-bold">{notification.substring(2)}</span> {/* Remove emoji */}
          </div>
        ))}
      </div>

      <div className="w-full max-w-md p-10 rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700 transition-colors duration-300">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:underline transition-colors text-blue-600 dark:text-blue-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider text-blue-800 dark:text-blue-300">
            EMI - POSTGRADO
          </h1>
          <div className="my-6">
            <Image
              src="/images/logo-emi-posgrado.png"
              alt="EMI Logo"
              width={200}
              height={80}
              className="mx-auto object-contain"
            />
          </div>
          <div className="mb-4">
            <Image
              src="/images/castillo-azul.png"
              alt="Castillo EMI"
              width={80}
              height={80}
              className="mx-auto object-contain"
            />
          </div>
          <p className="text-sm font-medium italic text-gray-600 dark:text-gray-300">
            Acceso al Sistema de Gestión Académica
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 rounded-lg font-medium transition-colors focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-600 text-gray-900 dark:text-white"
                placeholder="docente, ing-inscripcion o facturacion"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border-2 rounded-lg font-medium transition-colors focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 border-blue-300 dark:border-blue-600 text-gray-900 dark:text-white"
                placeholder="Ingrese su contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700"
          >
            {isLoading ? "Iniciando sesión..." : "Ingresar al Sistema"}
          </button>
        </form>

        {/* Users Info */}
        <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-bold mb-2 text-blue-700 dark:text-blue-300">Usuarios de prueba:</p>
          <div className="text-xs space-y-1 text-gray-600 dark:text-gray-300">
            <div>
              • <strong>docente</strong> / docente123
            </div>
            <div>
              • <strong>ing-inscripcion</strong> / inscripcion123
            </div>
            <div>
              • <strong>facturacion</strong> / facturacion123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
