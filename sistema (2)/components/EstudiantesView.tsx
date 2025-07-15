"use client"

import type React from "react"
import { useState } from "react"
import { Users, XCircle } from "lucide-react" // Added icons for stats cards

interface Estudiante {
  id: number
  codigo: string
  nombre: string
  apellidos: string
  ci: string
  numero: string
  correo: string
  gradoMilitar: string
  rangoProfesional: string
  estado: "ACTIVO" | "RETIRADO"
}

interface EstudiantesViewProps {
  estudiantes: Estudiante[]
  setEstudiantes: React.Dispatch<React.SetStateAction<Estudiante[]>>
  setActiveView: React.Dispatch<React.SetStateAction<string>>
}

const EstudiantesView: React.FC<EstudiantesViewProps> = ({ estudiantes, setEstudiantes, setActiveView }) => {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  const gradosMilitares = ["", "Tte.", "Cap.", "May.", "Tcnl.", "Cnl."] // Simplified to match image
  const rangosProfesionales = ["Lic.", "Ing.", "Mgr.", "Dr.", "Arq.", "Abg.", "Med."] // Expanded to match image

  const mostrarGuardado = () => {
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 2000)
  }

  const cambiarEstado = (id: number) => {
    setEstudiantes(
      estudiantes.map((estudiante) =>
        estudiante.id === id
          ? { ...estudiante, estado: estudiante.estado === "ACTIVO" ? "RETIRADO" : "ACTIVO" }
          : estudiante,
      ),
    )
    mostrarGuardado()
  }

  const actualizarGrado = (id: number, nuevoGrado: string) => {
    setEstudiantes(
      estudiantes.map((estudiante) =>
        estudiante.id === id ? { ...estudiante, gradoMilitar: nuevoGrado } : estudiante,
      ),
    )
    setEditingField(null)
    mostrarGuardado()
  }

  const actualizarRango = (id: number, nuevoRango: string) => {
    setEstudiantes(
      estudiantes.map((estudiante) =>
        estudiante.id === id ? { ...estudiante, rangoProfesional: nuevoRango } : estudiante,
      ),
    )
    setEditingField(null)
    mostrarGuardado()
  }

  const contarEstudiantes = () => {
    const activos = estudiantes.filter((e) => e.estado === "ACTIVO").length
    const retirados = estudiantes.filter((e) => e.estado === "RETIRADO").length
    return { activos, retirados, total: estudiantes.length }
  }

  const { activos, retirados, total } = contarEstudiantes()

  return (
    <>
      {showNotification && (
        <div className="fixed top-24 right-8 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse bg-blue-700 dark:bg-blue-600 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
          </svg>
          Datos guardados exitosamente!
        </div>
      )}

      <div className="rounded-2xl shadow-xl p-8 border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300">
          Gestión de Estudiantes
          <div className="w-20 h-1 rounded-full mt-2 bg-gradient-to-r from-blue-600 to-yellow-500"></div>
        </h1>
        <p className="text-lg leading-relaxed font-medium mb-6 text-gray-700 dark:text-gray-300">
          Registro completo de estudiantes matriculados en el programa de postgrado EMI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 rounded-xl border-2 text-center bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-6 h-6 text-blue-700 dark:text-blue-400" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{activos}</div>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Estudiantes Activos</div>
          </div>
          <div className="p-4 rounded-xl border-2 text-center bg-yellow-50 dark:bg-yellow-950 border-yellow-400 dark:border-yellow-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{retirados}</div>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Estudiantes Retirados</div>
          </div>
          <div className="p-4 rounded-xl border-2 text-center bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-6 h-6 text-blue-700 dark:text-blue-400" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{total}</div>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Total Estudiantes</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-xl overflow-hidden border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-700 dark:bg-blue-800">
                <th className="px-4 py-2 text-white">N°</th>
                <th className="px-4 py-2 text-white">CÓDIGO</th>
                <th className="px-4 py-2 text-white">GRADO</th>
                <th className="px-4 py-2 text-white">RANGO</th>
                <th className="px-4 py-2 text-white">NOMBRE</th>
                <th className="px-4 py-2 text-white">APELLIDOS</th>
                <th className="px-4 py-2 text-white">CI</th>
                <th className="px-4 py-2 text-white">NÚMERO</th>
                <th className="px-4 py-2 text-white">CORREO</th>
                <th className="px-4 py-2 text-white">ESTADO</th>
                <th className="px-4 py-2 text-white">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((estudiante, index) => (
                <tr
                  key={estudiante.id}
                  className="border-b-2 hover:shadow-md transition-all duration-200 border-blue-200 dark:border-blue-700"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#EBF8FF" : "#FFFFFF",
                  }}
                >
                  <td className="px-4 py-4 text-center font-bold text-gray-800 dark:text-gray-200">{index + 1}</td>
                  <td className="px-4 py-4 text-center font-bold text-blue-700 dark:text-blue-400">
                    {estudiante.codigo}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {editingField === `grado-${estudiante.id}` ? (
                      <select
                        value={estudiante.gradoMilitar}
                        onChange={(e) => actualizarGrado(estudiante.id, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="w-full p-2 border-2 rounded-lg font-bold text-center bg-blue-100 dark:bg-blue-900 border-blue-600 dark:border-blue-400 text-blue-800 dark:text-blue-300"
                      >
                        <option value="">Civil</option>
                        {gradosMilitares.slice(1).map((grado) => (
                          <option key={grado} value={grado}>
                            {grado}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField(`grado-${estudiante.id}`)}
                        className="font-bold hover:bg-blue-100 dark:hover:bg-blue-900 px-2 py-1 rounded-lg transition-colors text-blue-700 dark:text-blue-400"
                        title="Click para cambiar grado"
                      >
                        {estudiante.gradoMilitar || "Civil"} ✏️
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {editingField === `rango-${estudiante.id}` ? (
                      <select
                        value={estudiante.rangoProfesional}
                        onChange={(e) => actualizarRango(estudiante.id, e.target.value)}
                        onBlur={() => setEditingField(null)}
                        autoFocus
                        className="w-full p-2 border-2 rounded-lg font-bold text-center bg-yellow-100 dark:bg-yellow-900 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-300"
                      >
                        {rangosProfesionales.map((rango) => (
                          <option key={rango} value={rango}>
                            {rango}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingField(`rango-${estudiante.id}`)}
                        className="font-bold hover:bg-yellow-100 dark:hover:bg-yellow-900 px-2 py-1 rounded-lg transition-colors text-yellow-600 dark:text-yellow-400"
                        title="Click para cambiar rango"
                      >
                        {estudiante.rangoProfesional} ✏️
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100">{estudiante.nombre}</td>
                  <td className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100">{estudiante.apellidos}</td>
                  <td className="px-4 py-4 font-medium text-gray-700 dark:text-gray-300">{estudiante.ci}</td>
                  <td className="px-4 py-4 font-medium text-gray-700 dark:text-gray-300">{estudiante.numero}</td>
                  <td className="px-4 py-4 font-bold hover:underline text-blue-700 dark:text-blue-400">
                    {estudiante.correo}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border-2"
                      style={{
                        backgroundColor: estudiante.estado === "ACTIVO" ? "#DBEAFE" : "#FEF3C7",
                        color: estudiante.estado === "ACTIVO" ? "#3B82F6" : "#F59E0B",
                        borderColor: estudiante.estado === "ACTIVO" ? "#3B82F6" : "#F59E0B",
                      }}
                    >
                      {estudiante.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => cambiarEstado(estudiante.id)}
                      className="px-3 py-1 rounded-lg font-bold transition-all duration-200 hover:scale-105 text-xs text-white"
                      style={{
                        backgroundColor: estudiante.estado === "ACTIVO" ? "#F59E0B" : "#1E3A8A",
                      }}
                    >
                      {estudiante.estado === "ACTIVO" ? "Retirar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-blue-50 dark:bg-blue-950">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveView("inicio")}
              className="px-6 py-3 border-2 rounded-xl transition-colors font-bold border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              ← Atrás
            </button>
            <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
              💡 Tip: Los cambios se sincronizan automáticamente en todo el sistema
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EstudiantesView
