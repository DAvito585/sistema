"use client"

import type React from "react"
import Image from "next/image"
import { SearchIcon, BellIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface EstudianteHeaderProps {
  userName: string
}

const EstudianteHeader: React.FC<EstudianteHeaderProps> = ({ userName }) => {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 shadow-lg flex items-center justify-between px-8 z-50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <Image
          src="/images/logo-emi-posgrado.png"
          alt="EMI Posgrado Logo"
          width={120}
          height={50}
          className="object-contain"
        />
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-300 hidden md:block">ESTUDIANTE INGRESA</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300 w-48 md:w-64"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
        </div>

        <button className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors">
          <BellIcon className="text-blue-700 dark:text-blue-400" size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-600 flex items-center justify-center text-blue-800 dark:text-blue-100 font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-800 dark:text-gray-200 hidden md:block">{userName}</span>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

export default EstudianteHeader
