"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Lock } from "lucide-react"

interface Module {
  id: string
  name: string
  status: "available" | "locked" | "completed"
  grade?: number
}

interface Course {
  id: string
  name: string
  modules: Module[]
}

const courses: Course[] = [
  {
    id: "automatizacion-procesos",
    name: "Posgrado en Automatización de Procesos",
    modules: [
      { id: "mod1", name: "Introducción a la Automatización", status: "completed", grade: 92 },
      { id: "mod2", name: "Programación de PLCs", status: "available" },
      { id: "mod3", name: "Sistemas SCADA y HMI", status: "locked" },
      { id: "mod4", name: "Robótica Industrial", status: "locked" },
      { id: "mod5", name: "Integración de Sistemas", status: "locked" },
    ],
  },
  {
    id: "gestion-educativa",
    name: "Posgrado en Gestión Educativa",
    modules: [
      { id: "mod1", name: "Fundamentos de la Gestión Educativa", status: "locked" },
      { id: "mod2", name: "Diseño Curricular", status: "locked" },
    ],
  },
]

const EstudianteCalificacionesView: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Mis Calificaciones y Módulos</h2>

      {courses.map((course) => (
        <Card key={course.id} className="mb-8 bg-white dark:bg-gray-800 shadow-lg border-blue-200 dark:border-blue-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">{course.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className={`p-4 rounded-lg border-2 flex items-center justify-between transition-all duration-200
                    ${
                      module.status === "available"
                        ? "bg-green-50 dark:bg-green-950 border-green-400 dark:border-green-600 text-green-800 dark:text-green-200 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900"
                        : module.status === "completed"
                          ? "bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-200"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-70"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    {module.status === "available" && <CheckCircle className="text-green-600" size={20} />}
                    {module.status === "completed" && <CheckCircle className="text-blue-600" size={20} />}
                    {module.status === "locked" && <Lock className="text-gray-500" size={20} />}
                    <span className="font-medium">{module.name}</span>
                  </div>
                  {module.status === "completed" && module.grade && (
                    <span className="font-bold text-lg">{module.grade}%</span>
                  )}
                  {module.status === "available" && (
                    <span className="text-sm text-green-600 dark:text-green-400">Disponible</span>
                  )}
                  {module.status === "locked" && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bloqueado</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default EstudianteCalificacionesView
