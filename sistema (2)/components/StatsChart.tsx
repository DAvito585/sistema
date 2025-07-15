"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Users, Award } from "lucide-react"

export default function StatsChart() {
  const [animatedValues, setAnimatedValues] = useState({ aprobados: 0, reprobados: 0, total: 0 })

  const finalValues = { aprobados: 85, reprobados: 15, total: 120 }

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        aprobados: Math.floor(finalValues.aprobados * progress),
        reprobados: Math.floor(finalValues.reprobados * progress),
        total: Math.floor(finalValues.total * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setAnimatedValues(finalValues)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  const approvalRate = finalValues.total > 0 ? (animatedValues.aprobados / finalValues.total) * 100 : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Aprobados */}
      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Award className="w-8 h-8" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{animatedValues.aprobados}</div>
            <div className="text-green-100">APROBADOS</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-1000"
            style={{ width: `${approvalRate}%` }}
          ></div>
        </div>
        <div className="text-sm text-green-100 mt-2">{approvalRate.toFixed(1)}% de aprobación</div>
      </div>

      {/* Reprobados */}
      <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <TrendingUp className="w-8 h-8 transform rotate-180" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{animatedValues.reprobados}</div>
            <div className="text-red-100">REPROBADOS</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-1000"
            style={{ width: `${(animatedValues.reprobados / finalValues.total) * 100}%` }}
          ></div>
        </div>
        <div className="text-sm text-red-100 mt-2">
          {((animatedValues.reprobados / finalValues.total) * 100).toFixed(1)}% reprobación
        </div>
      </div>

      {/* Total Estudiantes */}
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{animatedValues.total}</div>
            <div className="text-blue-100">ESTUDIANTES</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-white rounded-full h-2 w-full"></div>
        </div>
        <div className="text-sm text-blue-100 mt-2">Total matriculados</div>
      </div>
    </div>
  )
}
