"use client"

import type React from "react"
import { HomeIcon, UsersIcon, BookOpenIcon, CalendarDaysIcon } from "@heroicons/react/24/solid" // Updated icons
import Image from "next/image"

interface SidebarItem {
  id: string
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface SidebarProps {
  activeView: string
  setActiveView: React.Dispatch<React.SetStateAction<string>>
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const sidebarItems: SidebarItem[] = [
    { id: "inicio", name: "Inicio", icon: HomeIcon },
    { id: "estudiantes", name: "Estudiantes", icon: UsersIcon },
    { id: "calificaciones", name: "Calificaciones", icon: BookOpenIcon },
    { id: "asistencia", name: "Asistencia", icon: CalendarDaysIcon },
  ]

  const renderSidebarItem = (item: SidebarItem) => {
    const Icon = item.icon
    const isActive = activeView === item.id

    return (
      <button
        key={item.id}
        onClick={() => setActiveView(item.id)}
        className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:translate-x-2 border-2 ${
          isActive
            ? "bg-blue-700 dark:bg-blue-800 text-white shadow-lg border-blue-700 dark:border-blue-800"
            : "bg-blue-50 dark:bg-blue-950 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-700"
        }`}
      >
        <div
          className={`p-2 rounded-lg ${isActive ? "bg-yellow-400/30 dark:bg-yellow-500/30" : "bg-blue-100 dark:bg-blue-900"}`}
        >
          <Icon
            className={`w-6 h-6 ${isActive ? "text-yellow-400 dark:text-yellow-300" : "text-blue-700 dark:text-blue-400"}`}
          />
        </div>
        <span>{item.name}</span>
      </button>
    )
  }

  return (
    <nav className="fixed left-0 top-20 w-80 h-[calc(100vh-5rem)] shadow-2xl overflow-y-auto z-40 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="bg-blue-700 dark:bg-blue-800 text-white p-6">
        {/* Placeholder for logo */}
        <Image
          src="/images/logo-emi-posgrado.png"
          alt="EMI Posgrado Logo"
          width={180}
          height={70}
          className="mx-auto object-contain"
        />
      </div>

      <div className="p-6">
        <div className="text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
          Gestión Estudiantes
        </div>
        {sidebarItems.map(renderSidebarItem)}
      </div>

      {/* Removed "Playlists" section as it's not in the image */}
      {/* <div className="p-6">
      <div className="text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
        Playlists
      </div>
      {playlistItems.map(renderSidebarItem)}
      <button className="w-full flex items-center gap-4 p-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:translate-x-2 border-2 bg-blue-50 dark:bg-blue-950 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-700">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
          <PlusCircleIcon className="w-6 h-6 text-blue-700 dark:text-blue-400" />
        </div>
        <span>Create Playlist</span>
      </button>
    </div> */}
    </nav>
  )
}

export default Sidebar
