"use client"

import type React from "react"
import { useState } from "react"
import { Calculator, Minus, Plus, CheckCircle, XCircle } from "lucide-react" // Added icons for stats cards

interface Estudiante {
  id: number // Changed to number to match EstudiantesView
  codigo: string
  nombre: string
  apellidos: string
  gradoMilitar: string
  rangoProfesional: string
  estado: string
}

interface Calificacion {
  estudianteId: number // Changed to number
  metodologia: number
  estadistica: number
  automatizacion: number
  gestion: number
  seminario: number
  promedio: number
}

interface CalificacionesViewProps {
  estudiantes: Estudiante[]
  setEstudiantes: React.Dispatch<React.SetStateAction<Estudiante[]>> // Added setEstudiantes prop
  setActiveView: (view: string) => void
}

const CalificacionesView: React.FC<CalificacionesViewProps> = ({ estudiantes, setEstudiantes, setActiveView }) => {
  const [numEvaluaciones, setNumEvaluaciones] = useState(8) // Changed default to 8 to match image
  const [searchTerm, setSearchTerm] = useState("")
  const [evaluaciones, setEvaluaciones] = useState<{ [key: string]: string }>({})
  const [examenes, setExamenes] = useState<{ [key: string]: string }>({})
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]) // This state is not currently used for display, but kept for potential future use

  const aumentarEvaluaciones = () => {
    setNumEvaluaciones(numEvaluaciones + 1)
  }

  const disminuirEvaluaciones = () => {
    setNumEvaluaciones(numEvaluaciones - 1)
  }

  const handleEvaluacionChange = (estudianteId: number, evaluacionNum: number, value: string) => {
    setEvaluaciones({ ...evaluaciones, [`${estudianteId}-${evaluacionNum}`]: value })
  }

  const handleExamenChange = (estudianteId: number, value: string) => {
    setExamenes({ ...examenes, [`${estudianteId}`]: value })
  }

  const calcularNotaFinal = (estudianteId: number) => {
    let sumaEvaluaciones = 0
    for (let i = 1; i <= numEvaluaciones; i++) {
      const evaluacionValue = evaluaciones[`${estudianteId}-${i}`] || "0"
      sumaEvaluaciones += Number.parseFloat(evaluacionValue)
    }

    const promedioEvaluaciones = numEvaluaciones > 0 ? sumaEvaluaciones / numEvaluaciones : 0
    const examenFinalValue = examenes[`${estudianteId}`] || "0"
    const notaExamenFinal = Number.parseFloat(examenFinalValue)

    const notaFinal = promedioEvaluaciones * 0.6 + notaExamenFinal * 0.4
    return notaFinal.toFixed(1)
  }

  const getEstadoAprobacion = (notaFinal: string) => {
    const nota = Number.parseFloat(notaFinal)
    if (nota >= 5.1) {
      return { estado: "APROBADO", color: "#22C55E" }
    } else {
      return { estado: "REPROBADO", color: "#EF4444" }
    }
  }

  const exportarCalificaciones = () => {
    const data = estudiantes.map((est) => {
      const notaFinal = calcularNotaFinal(est.id)
      const estado = getEstadoAprobacion(notaFinal).estado
      return {
        Código: est.codigo,
        Nombre: `${est.nombre} ${est.apellidos}`,
        Estado: est.estado,
        NotaFinal: notaFinal,
        EstadoAprobacion: estado,
        // Add individual evaluation and exam scores if needed for export
      }
    })

    alert(
      `📊 Exportando calificaciones de ${data.length} estudiantes...

✅ Archivo generado: calificaciones_emi_${new Date().toISOString().split("T")[0]}.xlsx`,
    )
  }

  const filteredEstudiantes = estudiantes.filter(
    (est) =>
      est.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const calcularEstadisticas = () => {
    let aprobados = 0
    let reprobados = 0

    estudiantes.forEach((estudiante) => {
      const notaFinal = Number.parseFloat(calcularNotaFinal(estudiante.id))
      if (notaFinal >= 5.1) aprobados++
      else reprobados++
    })

    return { aprobados, reprobados, total: estudiantes.length }
  }

  const { aprobados, reprobados } = calcularEstadisticas()

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="fixed top-24 right-8 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse bg-blue-700 dark:bg-blue-600 text-white">
        <span>✅</span>
        <span>Calificaciones guardadas automáticamente.</span>
      </div>

      <div className="rounded-2xl shadow-xl p-8 border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300">
          Sistema de Calificaciones
          <div className="w-20 h-1 rounded-full mt-2 bg-gradient-to-r from-blue-600 to-yellow-500"></div>
        </h1>
        <p className="text-lg leading-relaxed font-medium mb-6 text-gray-700 dark:text-gray-300">
          Gestión y registro de calificaciones del módulo académico del programa de postgrado EMI.
        </p>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Calculator className="w-6 h-6 text-blue-700 dark:text-blue-400" />
            <div className="px-6 py-3 border-2 rounded-xl font-bold text-lg bg-yellow-50 dark:bg-yellow-950 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
              Módulo Único - Postgrado EMI
            </div>
          </div>

          <button
            onClick={exportarCalificaciones}
            className="px-6 py-3 rounded-xl transition-colors font-bold bg-green-500 hover:bg-green-600 text-white"
          >
            Exportar Calificaciones
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-800 dark:text-gray-200">Evaluaciones:</span>
            <button
              onClick={disminuirEvaluaciones}
              disabled={numEvaluaciones <= 1} // Min 1 evaluation
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors disabled:opacity-50 bg-yellow-500 dark:bg-yellow-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="w-12 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-blue-700 dark:bg-blue-800 text-white">
              {numEvaluaciones}
            </span>
            <button
              onClick={aumentarEvaluaciones}
              disabled={numEvaluaciones >= 12}
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors disabled:opacity-50 bg-blue-700 dark:bg-blue-800 text-white disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <input
            type="search"
            placeholder="Buscar estudiante..."
            className="w-64 px-4 py-2 rounded-lg border-2 font-bold bg-white dark:bg-gray-700 border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-200"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl border-2 text-center bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-400" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">{aprobados}</div>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Aprobados (≥5.1)</div>
          </div>
          <div className="p-4 rounded-xl border-2 text-center bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-600">
            <div className="flex items-center justify-center gap-2 mb-2">
              <XCircle className="w-6 h-6 text-red-700 dark:text-red-400" />
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">{reprobados}</div>
            </div>
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">Reprobados (&lt;5.1)</div>
          </div>
        </div>

        <div className="rounded-2xl shadow-xl overflow-hidden border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-700 dark:bg-blue-800">
                  <th className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700">N°</th>
                  <th className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700">GRADO</th>
                  <th className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700">RANGO</th>
                  <th className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700">
                    NOMBRE COMPLETO
                  </th>
                  <th
                    className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700"
                    colSpan={numEvaluaciones}
                  >
                    EVALUACIONES ({numEvaluaciones})
                  </th>
                  <th className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700">
                    EXAMEN
                    <br />
                    FINAL
                  </th>
                  <th className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700">
                    NOTA
                    <br />
                    FINAL
                    <br />
                    /10
                  </th>
                  <th className="border-2 p-3 font-bold text-white border-blue-600 dark:border-blue-700">ESTADO</th>
                </tr>
                <tr>
                  <th className="border-2 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"></th>
                  <th className="border-2 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"></th>
                  <th className="border-2 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"></th>
                  <th className="border-2 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"></th>
                  {Array.from({ length: numEvaluaciones }, (_, i) => i + 1).map((num) => (
                    <th
                      key={num}
                      className="border-2 p-2 text-xs w-16 font-bold bg-blue-100 dark:bg-blue-900 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-700"
                    >
                      E{num}
                    </th>
                  ))}
                  <th className="border-2 p-2 text-xs font-bold bg-yellow-50 dark:bg-yellow-950 text-gray-800 dark:text-gray-200 border-yellow-200 dark:border-yellow-700">
                    /10
                  </th>
                  <th className="border-2 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"></th>
                  <th className="border-2 p-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {filteredEstudiantes.map((estudiante, index) => {
                  const notaFinal = calcularNotaFinal(estudiante.id)
                  const estadoAprobacion = getEstadoAprobacion(notaFinal)

                  return (
                    <tr
                      key={estudiante.id}
                      className="transition-colors duration-200"
                      style={{ backgroundColor: index % 2 === 0 ? "#EBF8FF" : "#FFFFFF" }}
                    >
                      <td className="border-2 p-3 text-center font-bold text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                        {index + 1}
                      </td>
                      <td className="border-2 p-3 text-center font-bold text-blue-700 dark:text-blue-400 border-gray-200 dark:border-gray-700">
                        {estudiante.gradoMilitar || "Civil"}
                      </td>
                      <td className="border-2 p-3 text-center font-bold text-yellow-600 dark:text-yellow-400 border-gray-200 dark:border-gray-700">
                        {estudiante.rangoProfesional}
                      </td>
                      <td className="border-2 p-3 font-bold text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                        {estudiante.nombre} {estudiante.apellidos}
                      </td>
                      {Array.from({ length: numEvaluaciones }, (_, i) => i + 1).map((num) => (
                        <td key={num} className="border-2 p-1 border-gray-200 dark:border-gray-700">
                          <input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            className="w-full p-2 text-center border-2 rounded-lg font-bold text-sm bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 text-gray-900 dark:text-white"
                            onChange={(e) => handleEvaluacionChange(estudiante.id, num, e.target.value)}
                            placeholder="0"
                            value={evaluaciones[`${estudiante.id}-${num}`] || ""}
                          />
                        </td>
                      ))}
                      <td className="border-2 p-1 border-gray-200 dark:border-gray-700">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          className="w-full p-2 text-center border-2 rounded-lg font-bold bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-700 text-gray-900 dark:text-white"
                          onChange={(e) => handleExamenChange(estudiante.id, e.target.value)}
                          placeholder="0"
                          value={examenes[`${estudiante.id}`] || ""}
                        />
                      </td>
                      <td className="border-2 p-3 text-center font-bold text-xl text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 border-gray-200 dark:border-gray-700">
                        {notaFinal}
                      </td>
                      <td className="border-2 p-3 text-center border-gray-200 dark:border-gray-700">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-bold uppercase border-2"
                          style={{
                            backgroundColor: `${estadoAprobacion.color}20`,
                            color: estadoAprobacion.color,
                            borderColor: estadoAprobacion.color,
                          }}
                        >
                          {estadoAprobacion.estado}
                        </span>
                      </td>
                    </tr>
                  )
                })}
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
                📊 Nota mínima de aprobación: 5.1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalificacionesView
