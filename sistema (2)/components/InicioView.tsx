"use client"

import type React from "react"
import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, X, Activity, CheckCircle, XCircle, Users } from "lucide-react" // Added icons for stats cards

const InicioView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [activities, setActivities] = useState([
    { title: "Examen Final del Módulo I", date: "2025-01-14", type: "exam" },
    { title: "Entrega de Proyectos de Investigación", date: "2025-01-21", type: "assignment" },
    { title: "Presentaciones de Tesis - Grupo A", date: "2025-02-10", type: "presentation" },
    { title: "Evaluación de Medio Término", date: "2025-02-28", type: "evaluation" },
    { title: "Examen Final de Física", date: "2025-03-15", type: "exam" },
    { title: "Entrega de Informe de Laboratorio", date: "2025-03-22", type: "assignment" },
    { title: "Defensa de Proyecto Final", date: "2025-04-10", type: "presentation" },
    { title: "Evaluación Final del Curso", date: "2025-04-28", type: "evaluation" },
  ])
  const [showAllActivities, setShowAllActivities] = useState(false)

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  const daysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"] // Changed to match image

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    // Adjust getDay() result to start week on Monday (0=Sun, 1=Mon, ..., 6=Sat)
    // So, (getDay() + 6) % 7 will make Monday=0, Tuesday=1, ..., Sunday=6
    return (new Date(year, month, 1).getDay() + 6) % 7
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const days: (number | null)[] = Array(firstDayOfMonth).fill(null)

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days.map((day, index) => {
      if (day === null) {
        return <div key={`empty-${index}`} className="p-3 text-center"></div>
      }

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear()
      const isSelected = selectedDate === day
      const hasActivity = activities.some((activity) => {
        const activityDate = new Date(activity.date)
        return (
          activityDate.getDate() === day &&
          activityDate.getMonth() === currentDate.getMonth() &&
          activityDate.getFullYear() === currentDate.getFullYear()
        )
      })

      return (
        <div
          key={day}
          onClick={() => setSelectedDate(day)}
          className="p-3 text-center text-sm cursor-pointer rounded-xl transition-all duration-200 hover:scale-110 font-bold border-2"
          style={{
            backgroundColor: isToday ? "#FCD34D" : isSelected ? "#1E3A8A" : hasActivity ? "#DBEAFE" : "#EBF8FF",
            color: isToday ? "#1F2937" : isSelected ? "#FFFFFF" : "#1F2937",
            borderColor: isToday ? "#F59E0B" : isSelected ? "#1E3A8A" : "#DBEAFE",
          }}
        >
          {day}
        </div>
      )
    })
  }

  const displayedActivities = activities.slice(0, 3) // Show only first 3 activities

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="rounded-2xl shadow-xl p-8 border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
        <h1 className="text-4xl font-bold mb-4 text-blue-800 dark:text-blue-300">
          Bienvenido al Sistema EMI
          <div className="w-24 h-1 rounded-full mt-3 bg-gradient-to-r from-blue-600 to-yellow-500"></div>
        </h1>
        <p className="text-xl leading-relaxed font-medium text-gray-700 dark:text-gray-300">
          Sistema de Gestión Académica - Escuela Militar de Ingeniería Postgrado - Año 2025
        </p>
      </div>

      {/* Stats Cards - Replicated from image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl shadow-xl border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">ESTUDIANTES APROBADOS</h3>
            <CheckCircle className="w-8 h-8 text-blue-700 dark:text-blue-400" />
          </div>
          <div className="text-5xl font-bold text-blue-800 dark:text-blue-300 mb-2">85</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Del total de estudiantes</p>
        </div>

        <div className="p-6 rounded-2xl shadow-xl border-t-4 bg-white dark:bg-gray-800 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">ESTUDIANTES REPROBADOS</h3>
            <XCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-5xl font-bold text-yellow-700 dark:text-yellow-300 mb-2">15</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Requieren seguimiento</p>
        </div>

        <div className="p-6 rounded-2xl shadow-xl border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">TOTAL ESTUDIANTES</h3>
            <Users className="w-8 h-8 text-blue-700 dark:text-blue-400" />
          </div>
          <div className="text-5xl font-bold text-blue-800 dark:text-blue-300 mb-2">120</div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Estudiantes matriculados</p>
        </div>
      </div>

      <div className="rounded-2xl shadow-xl p-8 border-t-4 bg-white dark:bg-gray-800 border-blue-700 dark:border-blue-500">
        <div className="flex items-center gap-4 mb-8">
          <Calendar className="w-8 h-8 text-blue-700 dark:text-blue-400" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Calendario Académico 2025</h3>
        </div>
        <div className="text-white p-6 rounded-xl mb-8 bg-blue-700 dark:bg-blue-600">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="p-3 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-bold text-xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="p-3 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-4 text-center text-sm font-bold text-blue-700 dark:text-blue-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </div>

      <div className="rounded-2xl shadow-xl p-8 border-t-4 bg-white dark:bg-gray-800 border-yellow-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Activity className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Actividades Próximas</h3>
          </div>
          <button
            onClick={() => setShowAllActivities(true)}
            className="text-sm font-bold px-6 py-3 rounded-xl transition-colors border-2 hover:shadow-md text-blue-700 dark:text-blue-400 border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-blue-950"
          >
            Ver Todas
          </button>
        </div>
        <div className="space-y-6">
          {displayedActivities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-6 p-6 rounded-xl border-2 hover:shadow-md transition-all duration-200 hover:scale-105 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700"
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    activity.type === "exam"
                      ? "#EF4444"
                      : activity.type === "assignment"
                        ? "#F59E0B"
                        : activity.type === "presentation"
                          ? "#10B981"
                          : activity.type === "evaluation"
                            ? "#8B5CF6"
                            : "#1E3A8A",
                }}
              ></div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-800 dark:text-gray-200">{activity.title}</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {new Date(activity.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAllActivities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                Calendario Académico 2025 - Todas las Actividades
              </h2>
              <button
                onClick={() => setShowAllActivities(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl border-2 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700"
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        activity.type === "exam"
                          ? "#EF4444"
                          : activity.type === "assignment"
                            ? "#F59E0B"
                            : activity.type === "presentation"
                              ? "#10B981"
                              : activity.type === "evaluation"
                                ? "#8B5CF6"
                                : "#1E3A8A",
                    }}
                  ></div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 dark:text-gray-200">{activity.title}</div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {new Date(activity.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InicioView
