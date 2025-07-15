"use client"
import { useState, useEffect, useCallback } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import EstudianteSidebar from "@/components/EstudianteSidebar"
import EstudianteHeader from "@/components/EstudianteHeader"
import EstudianteInicioView from "@/components/EstudianteInicioView"
import EstudianteCalificacionesView from "@/components/EstudianteCalificacionesView"
import EstudiantePagosView from "@/components/EstudiantePagosView" // Import the new payments view
import { Bell, Book, Mail, User, FileText } from "lucide-react" // Import necessary icons

// Define programData and enrollmentFee for consistent pricing
const programData: {
  [key: string]: {
    nombre: string
    basePricePerModule: number
    numberOfModules: number
  }
} = {
  "automatizacion-procesos": { nombre: "Automatización de Procesos", basePricePerModule: 1500, numberOfModules: 6 },
  "gestion-educativa": { nombre: "Gestión Educativa", basePricePerModule: 1200, numberOfModules: 5 },
  "administracion-publica": { nombre: "Administración Pública", basePricePerModule: 1800, numberOfModules: 7 },
  "desarrollo-sostenible": { nombre: "Desarrollo Sostenible", basePricePerModule: 1600, numberOfModules: 6 },
}
const enrollmentFee = 750 // Fixed enrollment fee for all programs

export default function EstudiantePage() {
  const router = useRouter()
  const [activeView, setActiveView] = useState("inicio")
  const [userName, setUserName] = useState("Estudiante")
  const [notifications, setNotifications] = useState<string[]>([])

  // States for enrollment flow (used when activeView is "inscripcion")
  const [enrollmentStep, setEnrollmentStep] = useState("form") // "form", "payment"
  const [fileUploaded, setFileUploaded] = useState(false)

  const [formData, setFormData] = useState({
    carnet: "",
    fechaNacimiento: "",
    nombreCompleto: "",
    carnetIdentidad: "",
    nacionalidad: "",
    correoElectronico: "",
    posgrado: "",
    descuento: "ninguno",
    documento: "",
  })

  const [paymentTotals, setPaymentTotals] = useState({
    totalSinDescuento: 0,
    descuentoAplicado: 0,
    totalAPagar: 0,
  })

  const addNotification = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setNotifications((prev) => [...prev, message])
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1))
    }, 5000)
  }, [])

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const calcularDescuento = useCallback((total: number, tipoDescuento: string) => {
    switch (tipoDescuento) {
      case "militar":
        return total * 0.15 // 15% descuento militar
      case "beca":
        return total * 0.2 // 20% descuento beca
      default:
        return 0
    }
  }, [])

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(formData.correoElectronico)) {
      addNotification("❌ Ingrese un email válido", "error")
      return
    }
    if (!formData.posgrado || !programData[formData.posgrado]) {
      addNotification("❌ Por favor, seleccione un programa de posgrado válido.", "error")
      return
    }

    localStorage.setItem("formularioData", JSON.stringify(formData))

    const selectedProgram = programData[formData.posgrado]
    const totalModulesCost = selectedProgram.basePricePerModule * selectedProgram.numberOfModules
    const totalSinDescuento = totalModulesCost + enrollmentFee
    const descuentoAplicado = calcularDescuento(totalSinDescuento, formData.descuento)
    const totalAPagar = totalSinDescuento - descuentoAplicado

    setPaymentTotals({ totalSinDescuento, descuentoAplicado, totalAPagar })
    localStorage.setItem("totalesPago", JSON.stringify({ totalSinDescuento, descuentoAplicado, totalAPagar }))

    addNotification("📋 Formulario completado. Revise su plan de pagos.", "success")
    setEnrollmentStep("payment")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, documento: e.target.files![0].name }))
      setFileUploaded(true)
      addNotification(`Archivo seleccionado: ${e.target.files[0].name}`, "info")
    } else {
      setFormData((prev) => ({ ...prev, documento: "" }))
      setFileUploaded(false)
      addNotification("Sin archivos seleccionados", "info")
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("postgraduanteUser") || "{}")
    if (!user || !user.nombre) {
      router.push("/postgraduante")
    } else {
      setUserName(user.nombre)
    }

    // Pre-fill form data when entering enrollment flow
    if (activeView === "inscripcion" && enrollmentStep === "form") {
      if (user.nombre && user.email && user.carnet) {
        setFormData((prev) => ({
          ...prev,
          nombreCompleto: user.nombre,
          correoElectronico: user.email,
          carnetIdentidad: user.carnet, // Assuming carnet from login is CI
        }))
      }
      addNotification("📝 Complete el formulario de pre-inscripción para el nuevo programa", "info")
    }
  }, [router, activeView, enrollmentStep, addNotification])

  const renderForm = () => (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300">Formulario Pre-Inscripción</h1>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Nombre Completo</label>
            <input
              type="text"
              value={formData.nombreCompleto}
              onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
              className="w-full p-3 border-2 rounded-lg border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white pr-10"
              required
            />
            <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Carnet de Identidad</label>
            <input
              type="text"
              value={formData.carnetIdentidad}
              onChange={(e) => setFormData({ ...formData, carnetIdentidad: e.target.value })}
              className="w-full p-3 border-2 rounded-lg border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white pr-10"
              required
            />
            <Book className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Nacionalidad</label>
            <input
              type="text"
              value={formData.nacionalidad}
              onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
              className="w-full p-3 border-2 rounded-lg border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white pr-10"
              required
            />
            <FileText
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              size={20}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Correo Electrónico</label>
            <input
              type="email"
              value={formData.correoElectronico}
              onChange={(e) => setFormData({ ...formData, correoElectronico: e.target.value })}
              className="w-full p-3 border-2 rounded-lg border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white pr-10"
              required
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">
              Seleccionar Posgrado
            </label>
            <select
              value={formData.posgrado}
              onChange={(e) => setFormData({ ...formData, posgrado: e.target.value })}
              className="w-full p-3 border-2 rounded-lg border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white pr-10"
              required
            >
              <option value="">-- Seleccionar --</option>
              {Object.keys(programData).map((key) => (
                <option key={key} value={key}>
                  {programData[key].nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Descuento</label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="militar"
                  name="descuento"
                  value="militar"
                  checked={formData.descuento === "militar"}
                  onChange={(e) => setFormData({ ...formData, descuento: e.target.checked ? "militar" : "ninguno" })}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="militar" className="text-gray-700 dark:text-gray-300">
                  Militar
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="beca"
                  name="descuento"
                  value="beca"
                  checked={formData.descuento === "beca"}
                  onChange={(e) => setFormData({ ...formData, descuento: e.target.checked ? "beca" : "ninguno" })}
                  className="w-4 h-4 accent-blue-600"
                />
                <label htmlFor="beca" className="text-gray-700 dark:text-gray-300">
                  Beca
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Subir Documento</label>
          <div className="file-upload border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
            <input
              type="file"
              id="documento"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="documento"
              className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2"
            >
              <FileText size={20} />
              {formData.documento ? formData.documento : "Seleccionar archivo | Sin archivos seleccionados"}
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveView("inicio")} // Go back to student home
            className="px-6 py-3 border-2 rounded-lg font-bold border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            Atrás
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-lg font-bold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700"
          >
            Siguiente
          </button>
        </div>
      </form>
    </div>
  )

  const renderPayment = () => {
    const selectedProgram = programData[formData.posgrado]
    if (!selectedProgram) return null // Should not happen if form validation works

    const modules = Array.from({ length: selectedProgram.numberOfModules }, (_, i) => ({
      name: `Módulo ${i + 1} - ${selectedProgram.nombre}`,
      price: selectedProgram.basePricePerModule,
    }))

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300">Plan de Pagos</h1>
        </div>

        <div className="p-6 rounded-xl border-2 mb-8 bg-blue-50 dark:bg-blue-950 border-blue-400 dark:border-blue-600">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Información del Postgraduante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-bold">Nombre:</span> {formData.nombreCompleto}
            </div>
            <div>
              <span className="font-bold">Carnet:</span> {formData.carnetIdentidad}
            </div>
            <div>
              <span className="font-bold">Nacionalidad:</span> {formData.nacionalidad}
            </div>
            <div>
              <span className="font-bold">Programa:</span> {selectedProgram.nombre}
            </div>
            <div>
              <span className="font-bold">Descuento:</span>{" "}
              {formData.descuento === "ninguno" ? "Sin descuento" : formData.descuento}
            </div>
          </div>
        </div>

        <div className="materias-section mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Detalle de Costos</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-gray-700 dark:border-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-700 dark:border-gray-300 p-3 text-left text-gray-800 dark:text-gray-200">
                    Concepto
                  </th>
                  <th className="border border-gray-700 dark:border-gray-300 p-3 text-left text-gray-800 dark:text-gray-200">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module, index) => (
                  <tr key={index}>
                    <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                      {module.name}
                    </td>
                    <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                      Bs. {module.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    Costo de Matrícula/Inscripción
                  </td>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    Bs. {enrollmentFee.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 rounded-xl border-2 mb-8 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Resumen de Pago</h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Total sin descuento:</span>
              <span className="font-bold">Bs. {paymentTotals.totalSinDescuento.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuento aplicado:</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                Bs. {paymentTotals.descuentoAplicado.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 border-gray-300 dark:border-gray-600">
              <span>Total a pagar:</span>
              <span className="text-blue-600 dark:text-blue-400">Bs. {paymentTotals.totalAPagar.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="cuotas-section mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Cuotas</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-2 border-gray-700 dark:border-gray-300">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border border-gray-700 dark:border-gray-300 p-3 text-center text-gray-800 dark:text-gray-200">
                    Cuotas
                  </th>
                  <th className="border border-gray-700 dark:border-gray-300 p-3 text-center text-gray-800 dark:text-gray-200">
                    Costo
                  </th>
                  <th className="border border-gray-700 dark:border-gray-300 p-3 text-center text-gray-800 dark:text-gray-200">
                    Fecha Límite
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    1ra Cuota
                  </td>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    Bs. {(paymentTotals.totalAPagar / 2).toFixed(2)}
                  </td>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    15/08/2025
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    2da Cuota
                  </td>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    Bs. {(paymentTotals.totalAPagar / 2).toFixed(2)}
                  </td>
                  <td className="border border-gray-700 dark:border-gray-300 p-3 text-gray-900 dark:text-white">
                    15/09/2025
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="atencion-box border-2 border-dashed border-gray-700 dark:border-gray-300 rounded-xl p-6 mb-8 bg-yellow-50 dark:bg-yellow-950">
          <div className="font-bold text-gray-800 dark:text-gray-200 mb-4">ATENCIÓN:</div>
          <ol className="list-decimal ml-5 text-gray-700 dark:text-gray-300">
            <li>Los pagos deben realizarse en las fechas indicadas.</li>
            <li>El incumplimiento genera recargos.</li>
            <li>No se aceptan pagos fuera de plazo sin autorización.</li>
            <li>Guarde sus comprobantes.</li>
            <li>Revise regularmente su estado de cuenta.</li>
          </ol>
        </div>

        <div className="button-group flex justify-between gap-4 mt-8">
          <button
            type="button"
            onClick={() => setEnrollmentStep("form")}
            className="px-6 py-3 border-2 rounded-lg font-bold border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            Atrás
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("¿Está seguro que desea cancelar el proceso? Se perderán todos los datos.")) {
                localStorage.clear()
                router.push("/")
              }
            }}
            className="px-6 py-3 border-2 rounded-lg font-bold border-red-600 dark:border-red-400 text-red-600 dark:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-950"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              // This button now just confirms the pre-inscription and redirects to student dashboard
              // The actual payment process is handled in EstudiantePagosView
              addNotification("Pre-inscripción confirmada. Diríjase a 'Mis Pagos' para proceder con el pago.", "info")
              router.push("/estudiante")
            }}
            className="flex-1 py-3 rounded-lg font-bold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700"
          >
            Confirmar Pre-inscripción
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900 dark:via-blue-800 dark:to-gray-900 transition-colors duration-300">
      <EstudianteHeader userName={userName} />
      <EstudianteSidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 ml-80 pt-20 p-4 transition-all duration-300">
        {/* Notifications */}
        <div className="fixed top-20 right-6 z-40 space-y-2">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              <span className="text-sm font-bold">{notification}</span>
            </div>
          ))}
        </div>
        {activeView === "inicio" && <EstudianteInicioView />}
        {activeView === "calificaciones" && <EstudianteCalificacionesView />}
        {activeView === "pagos" && <EstudiantePagosView />} {/* Render new payments view */}
        {activeView === "inscripcion" && (
          <div className="p-8 rounded-3xl shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700 transition-colors duration-300">
            {enrollmentStep === "form" && renderForm()}
            {enrollmentStep === "payment" && renderPayment()}
          </div>
        )}
      </main>
    </div>
  )
}
