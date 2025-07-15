"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, CalendarDays } from "lucide-react"

const EstudianteInicioView: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Resumen del Estudiante</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Cursos Inscritos</CardTitle>
            <BookOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Posgrado en Automatización</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Próxima Cuota</CardTitle>
            <CalendarDays className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">Bs. 155.00</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fecha límite: 15/08/2025</p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Calificación Promedio
            </CardTitle>
            <Users className="h-5 w-5 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">85%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Basado en módulos completados</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-video rounded-xl bg-muted/50 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Gráfico de Progreso (Placeholder)
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Noticias y Anuncios (Placeholder)
        </div>
      </div>
    </div>
  )
}

export default EstudianteInicioView
