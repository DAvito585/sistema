"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, CheckCircle, Users, XCircle } from "lucide-react"

interface Estudiante {
  id: number // Changed to number to match EstudiantesView
  nombre: string
  apellidos: string
  gradoMilitar: string | null
  rangoProfesional: string
  estado: string
}

interface AsistenciaViewProps {
  estudiantes: Estudiante[]
  setEstudiantes: React.Dispatch<React.SetStateAction<Estudiante[]>> // Added setEstudiantes prop
  setActiveView: (view: string) => void
}

const AsistenciaView: React.FC<AsistenciaViewProps> = ({ estudiantes, setEstudiantes, setActiveView }) => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [asistencia, setAsistencia] = useState<{ [key: string]: string }>({})
  const [observaciones, setObservaciones] = useState<{ [key: string]: string }>({})

  const formatearFechaCorta = (fecha: string): string => {
    const date = new Date(fecha)
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const contarAsistencia = () => {
    const asistieron = Object.values(asistencia).filter((val) => val === "asistio").length
    const ausentes = Object.values(asistencia).filter((val) => val === "ausente").length
    const total = estudiantes.filter((est) => est.estado === "ACTIVO").length // Use `estudiantes` prop here
    return { asistieron, ausentes, total }
  }

  const { asistieron, ausentes, total } = contarAsistencia()

  const handleAsistenciaChange = (estudianteId: number, value: string) => {
    setAsistencia({ ...asistencia, [estudianteId]: value })
  }

  const handleObservacionChange = (estudianteId: number, value: string) => {
    setObservaciones({ ...observaciones, [estudianteId]: value })
  }

  return (
    <>
      <div className="fixed top-24 right-8 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse bg-blue-700 dark:bg-blue-600 text-white">
        <CheckCircle className="w-6 h-6" />
        Asistencia guardada!
      </div>

      <div className="rounded-2xl shadow-xl p-8 border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300">
          Control de Asistencia
          <div className="w-20 h-1 rounded-full mt-2 bg-gradient-to-r from-blue-600 to-yellow-500"></div>
        </h1>
        <p className="text-lg leading-relaxed font-medium text-gray-700 dark:text-gray-300">
          Sistema de registro y control de asistencia para clases del programa de postgrado EMI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-span-2 rounded-2xl shadow-xl p-6 border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-700 dark:text-blue-400" />
            <label className="text-lg font-bold text-gray-800 dark:text-gray-200">Fecha de Clase</label>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-4 border-2 rounded-xl font-bold text-lg bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-700 text-gray-900 dark:text-white"
          />
        </div>

        <div className="text-white rounded-2xl shadow-xl p-6 bg-blue-600 dark:bg-blue-700">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">{asistieron}</div>
              <div className="text-sm font-bold">Presentes</div>
            </div>
          </div>
        </div>

        <div className="text-white rounded-2xl shadow-xl p-6 bg-yellow-600 dark:bg-yellow-700">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">{ausentes}</div>
              <div className="text-sm font-bold">Ausentes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-xl overflow-hidden border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500 mt-8">
        <div className="text-white p-6 bg-blue-700 dark:bg-blue-800">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7" />
            <h3 className="text-xl font-bold">Control de Asistencia - {formatearFechaCorta(selectedDate)}</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700">
                <th className="px-4 py-4 text-left font-bold border-r-2 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
                  N°
                </th>
                <th className="px-4 py-4 text-left font-bold border-r-2 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
                  GRADO
                </th>
                <th className="px-4 py-4 text-left font-bold border-r-2 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
                  RANGO
                </th>
                <th className="px-4 py-4 text-left font-bold border-r-2 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
                  NOMBRE COMPLETO
                </th>
                <th className="px-4 py-4 text-center font-bold border-r-2 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
                  ASISTENCIA
                </th>
                <th className="px-4 py-4 text-left font-bold text-gray-800 dark:text-gray-200">OBSERVACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map(
                (
                  estudiante,
                  index, // Use `estudiantes` prop here
                ) => (
                  <tr
                    key={estudiante.id}
                    className="border-b-2 transition-colors duration-200 border-blue-200 dark:border-blue-700"
                    style={{ backgroundColor: index % 2 === 0 ? "#EBF8FF" : "#FFFFFF" }}
                  >
                    <td className="px-4 py-4 border-r-2 text-center font-bold text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 border-r-2 text-center font-bold text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700">
                      {estudiante.gradoMilitar || "Civil"}
                    </td>
                    <td className="px-4 py-4 border-r-2 text-center font-bold text-yellow-600 dark:text-yellow-400 border-blue-200 dark:border-blue-700">
                      {estudiante.rangoProfesional}
                    </td>
                    <td className="px-4 py-4 border-r-2 font-bold text-gray-900 dark:text-gray-100 border-blue-200 dark:border-blue-700">
                      {estudiante.nombre} {estudiante.apellidos}
                    </td>
                    <td className="px-4 py-4 border-r-2 border-blue-200 dark:border-blue-700">
                      <div className="flex justify-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={asistencia[`${estudiante.id}`] === "asistio"}
                            onChange={() => handleAsistenciaChange(estudiante.id, "asistio")}
                            className="w-5 h-5 rounded-lg border-2 accent-blue-600 dark:accent-blue-500"
                          />
                          <span className="text-xs font-bold group-hover:underline text-blue-600 dark:text-blue-400">
                            ASISTIÓ
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={asistencia[`${estudiante.id}`] === "ausente"}
                            onChange={() => handleAsistenciaChange(estudiante.id, "ausente")}
                            className="w-5 h-5 rounded-lg border-2 accent-yellow-600 dark:accent-yellow-500"
                          />
                          <span className="text-xs font-bold group-hover:underline text-yellow-600 dark:text-yellow-400">
                            AUSENTE
                          </span>
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={observaciones[`${estudiante.id}`] || ""}
                        onChange={(e) => handleObservacionChange(estudiante.id, e.target.value)}
                        className="w-full p-2 border-2 rounded-xl font-bold text-sm bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Seleccionar observación...</option>
                        <option value="Justificado">Justificado</option>
                        <option value="Tardanza">Tardanza</option>
                        <option value="Permiso">Permiso</option>
                        <option value="Enfermedad">Enfermedad</option>
                        <option value="Trabajo">Motivos de trabajo</option>
                      </select>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-blue-50 dark:bg-blue-950">
          <button
            onClick={() => setActiveView("inicio")}
            className="px-6 py-3 border-2 rounded-xl transition-colors font-bold border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            ← Atrás
          </button>
        </div>
      </div>
    </>
  )
}

export default AsistenciaView
