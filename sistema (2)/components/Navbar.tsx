import { Home, User, X } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-blue-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <button className="p-3 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110">
              <Home className="w-7 h-7 text-blue-600" /> {/* Icono azul */}
            </button>
            <div className="h-12 w-auto">
              <Image
                src="/images/logo-emi-posgrado.png"
                alt="EMI Posgrado Logo"
                width={200}
                height={48}
                className="h-full w-auto object-contain"
              />
              {/* Logo EMI Posgrado */}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 hover:bg-blue-50 rounded-xl transition-all duration-300 transform hover:scale-110">
              <User className="w-7 h-7 text-blue-600" /> {/* Icono azul */}
            </button>
            <button className="p-3 hover:bg-red-50 rounded-xl transition-all duration-300 transform hover:scale-110">
              <X className="w-7 h-7 text-red-500" /> {/* Icono rojo */}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
