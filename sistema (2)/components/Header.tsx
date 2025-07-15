"use client"

import type React from "react"
import { useState } from "react"
import { User, ChevronDown, UserCircle, X } from "lucide-react"
import { useRouter } from "next/navigation" // Changed from "next/router" to "next/navigation"
// Removed next-auth imports: import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

// Import ThemeToggle
// Eliminar el componente ThemeToggle de este archivo.
// Se moverá a `app/layout.tsx` para que esté en todas las páginas.
// 1.  Eliminar la línea que importa `ThemeToggle`:
//     `- import { ThemeToggle } from "@/components/theme-toggle"`

interface ProfileData {
  nombre: string
  apellidos: string
  email: string
  telefono: string
  direccion: string
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const router = useRouter()
  // Removed useSession: const { data: session } = useSession()

  // Mock session data for demonstration without next-auth
  const session = {
    user: {
      name: "Usuario Demo",
      email: "demo@example.com",
      image: "/placeholder.svg", // Use a placeholder image
    },
  }

  const profileData: ProfileData = {
    nombre: session?.user?.name || "Usuario",
    apellidos: "Apellido",
    email: session?.user?.email || "email@example.com",
    telefono: "123-456-7890",
    direccion: "123 Main St",
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleProfile = () => {
    setShowProfileModal(true)
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    // Simulate logout
    alert("Cerrando sesión...")
    router.push("/") // Redirect to home page after logout
    setIsMenuOpen(false)
  }

  const saveProfile = () => {
    // Save profile logic here
    alert("Perfil guardado!")
    setShowProfileModal(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 shadow-lg z-50 border-b-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500 transition-colors duration-300">
      <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
        <Image
          src="/images/logo-emi-posgrado.png"
          alt="EMI Posgrado Logo"
          width={180}
          height={70}
          className="object-contain"
        />
      </div>

      <div className="relative flex items-center gap-4">
        {/* El ThemeToggle ahora se muestra desde app/layout.tsx */}
        <span className="font-bold text-lg text-blue-900 dark:text-blue-100">
          Prof. {profileData.nombre} {profileData.apellidos}
        </span>
      </div>

      <div className="relative">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg relative bg-yellow-400 dark:bg-yellow-500"
          onClick={toggleMenu}
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image || "/placeholder.svg"}
              alt="Profile"
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <User className="w-6 h-6 text-blue-800 dark:text-blue-900" />
          )}
          <ChevronDown
            className={`w-4 h-4 ml-1 transition-transform text-blue-800 dark:text-blue-900 ${isMenuOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-64 rounded-xl shadow-2xl z-50 border-2 bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-600">
            <div className="py-2">
              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-gray-800 dark:text-gray-200"
              >
                <UserCircle className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                Mi Perfil
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors text-gray-800 dark:text-gray-200"
              >
                <User className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>

      {showProfileModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">Mi Perfil</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Nombre</label>
              <input
                type="text"
                className="w-full p-3 border-2 rounded-lg font-medium bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-600 text-gray-800 dark:text-gray-200"
                defaultValue={profileData.nombre}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Apellidos</label>
              <input
                type="text"
                className="w-full p-3 border-2 rounded-lg font-medium bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-600 text-gray-800 dark:text-gray-200"
                defaultValue={profileData.apellidos}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Email</label>
              <input
                type="email"
                className="w-full p-3 border-2 rounded-lg font-medium bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-600 text-gray-800 dark:text-gray-200"
                defaultValue={profileData.email}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Teléfono</label>
              <input
                type="tel"
                className="w-full p-3 border-2 rounded-lg font-medium bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-600 text-gray-800 dark:text-gray-200"
                defaultValue={profileData.telefono}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Dirección</label>
              <input
                type="text"
                className="w-full p-3 border-2 rounded-lg font-medium bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-600 text-gray-800 dark:text-gray-200"
                defaultValue={profileData.direccion}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveProfile}
                className="flex-1 py-3 px-6 rounded-lg font-bold text-white transition-colors bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-3 px-6 rounded-lg font-bold border-2 transition-colors border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
