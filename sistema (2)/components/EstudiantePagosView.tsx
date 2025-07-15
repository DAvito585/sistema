"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Bell, CheckCircle, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface PaymentTotals {
  totalSinDescuento: number
  descuentoAplicado: number
  totalAPagar: number
}

interface FormData {
  nombreCompleto: string
  carnetIdentidad: string
  nacionalidad: string
  posgrado: string
  descuento: string
  documento: string // This is for the pre-inscription form document
}

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

const EstudiantePagosView: React.FC = () => {
  const router = useRouter()
  const [paymentProcessStep, setPaymentProcessStep] = useState("view-plan") // "view-plan", "upload-proof"
  const [paymentTotals, setPaymentTotals] = useState<PaymentTotals>({
    totalSinDescuento: 0,
    descuentoAplicado: 0,
    totalAPagar: 0,
  })
  const [formData, setFormData] = useState<FormData>({
    nombreCompleto: "",
    carnetIdentidad: "",
    nacionalidad: "",
    posgrado: "",
    descuento: "ninguno",
    documento: "",
  })
  const [qrGenerated, setQrGenerated] = useState(false)
  const [paymentProofFile, setPaymentProofFile] = useState<string>("") // For payment proof upload
  const [notifications, setNotifications] = useState<string[]>([])

  const addNotification = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setNotifications((prev) => [...prev, message])
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1))
    }, 5000)
  }, [])

  useEffect(() => {
    const storedFormData = JSON.parse(localStorage.getItem("formularioData") || "{}")
    const storedPaymentTotals = JSON.parse(localStorage.getItem("totalesPago") || "{}")

    if (storedFormData && storedFormData.posgrado && programData[storedFormData.posgrado]) {
      setFormData(storedFormData)
      if (storedPaymentTotals && storedPaymentTotals.totalAPagar) {
        setPaymentTotals(storedPaymentTotals)
      } else {
        // Recalculate if totals are missing (should not happen if pre-inscription flow is followed)
        const selectedProgram = programData[storedFormData.posgrado]
        const totalModulesCost = selectedProgram.basePricePerModule * selectedProgram.numberOfModules
        const totalSinDescuento = totalModulesCost + enrollmentFee
        const descuentoAplicado = calcularDescuento(totalSinDescuento, storedFormData.descuento)
        const totalAPagar = totalSinDescuento - descuentoAplicado
        setPaymentTotals({ totalSinDescuento, descuentoAplicado, totalAPagar })
      }
    } else {
      addNotification(
        "❌ No hay datos de pre-inscripción para mostrar el plan de pagos. Por favor, complete la pre-inscripción primero.",
        "error",
      )
      // Optionally redirect to the pre-inscription form or home
      // router.push("/estudiante");
    }
  }, [addNotification])

  const calcularDescuento = useCallback((total: number, tipoDescuento: string) => {
    switch (tipoDescuento) {
      case "militar":
        return total * 0.15
      case "beca":
        return total * 0.2
      default:
        return 0
    }
  }, [])

  const handlePaymentProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProofFile(e.target.files![0].name)
      addNotification(`Comprobante seleccionado: ${e.target.files[0].name}`, "info")
    } else {
      setPaymentProofFile("")
      addNotification("Sin comprobante seleccionado", "info")
    }
  }

  const finalizePaymentProcess = () => {
    if (!paymentProofFile) {
      addNotification("❌ Por favor, suba un comprobante de pago.", "error")
      return
    }
    addNotification("🎉 ¡Pago registrado exitosamente!", "success")
    addNotification("✅ Su comprobante ha sido enviado para verificación", "success")
    addNotification("📧 Recibirá un correo de confirmación de pago", "success")

    setTimeout(() => {
      localStorage.clear() // Clear all local storage after full process completion
      router.push("/")
    }, 3000)
  }

  const selectedProgram = programData[formData.posgrado]
  const modules = selectedProgram
    ? Array.from({ length: selectedProgram.numberOfModules }, (_, i) => ({
        name: `Módulo ${i + 1} - ${selectedProgram.nombre}`,
        price: selectedProgram.basePricePerModule,
      }))
    : []

  const renderPaymentPlan = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300">Mi Plan de Pagos</h1>
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
            <span className="font-bold">Programa:</span> {selectedProgram?.nombre || "N/A"}
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
          onClick={() => router.push("/estudiante")} // Go back to student home
          className="px-6 py-3 border-2 rounded-lg font-bold border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          ← Volver al Panel
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
          Cancelar Pre-inscripción
        </button>
        <button
          type="button"
          onClick={() => setPaymentProcessStep("upload-proof")}
          className="flex-1 py-3 rounded-lg font-bold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700"
        >
          Proceder al Pago
        </button>
      </div>
    </>
  )

  const renderPaymentProcess = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-800 dark:text-blue-300">Proceso de Pago</h1>
      </div>

      <div className="opcion-pago border-2 border-dashed border-gray-700 dark:border-gray-300 rounded-xl p-6 mb-8 bg-gray-50 dark:bg-gray-800">
        <div className="opcion-title text-gray-800 dark:text-gray-200 mb-4">Opción 1: Pago por QR</div>
        <button
          onClick={() => setQrGenerated(true)}
          className="btn-generar bg-blue-700 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-800 transition-colors mb-4"
        >
          Generar QR
        </button>
        <div className="total-pagar text-gray-800 dark:text-gray-200 mb-4">
          Total a Pagar: Bs. {paymentTotals.totalAPagar.toFixed(2)}
        </div>

        <div className="qr-container border-2 border-dashed border-gray-700 dark:border-gray-300 rounded-xl p-10 text-center bg-white dark:bg-gray-900 flex items-center justify-center min-h-[200px] mb-4">
          {qrGenerated ? (
            <div className="w-[150px] h-[150px] bg-gradient-to-br from-blue-700 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-center">
              QR CODE
              <br />
              GENERADO
            </div>
          ) : (
            <div className="qr-placeholder text-gray-600 dark:text-gray-400 font-bold">IMAGEN [X]</div>
          )}
        </div>

        <div className="file-upload border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
          <input
            type="file"
            id="comprobanteQR"
            accept=".pdf,.jpg,.png"
            onChange={handlePaymentProofUpload}
            className="hidden"
          />
          <label
            htmlFor="comprobanteQR"
            className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2"
          >
            <FileText size={20} />
            {paymentProofFile ? paymentProofFile : "Seleccionar archivo | Sin archivos seleccionados"}
          </label>
        </div>
      </div>

      <div className="opcion-pago border-2 border-dashed border-gray-700 dark:border-gray-300 rounded-xl p-6 mb-8 bg-gray-50 dark:bg-gray-800">
        <div className="opcion-title text-gray-800 dark:text-gray-200 mb-4">Opción 2: Pago por Banco</div>
        <div className="file-upload border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
          <input
            type="file"
            id="comprobanteBanco"
            accept=".pdf,.jpg,.png"
            onChange={handlePaymentProofUpload}
            className="hidden"
          />
          <label
            htmlFor="comprobanteBanco"
            className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2"
          >
            <FileText size={20} />
            {paymentProofFile ? paymentProofFile : "Seleccionar archivo | Sin archivos seleccionados"}
          </label>
        </div>
      </div>

      {paymentProofFile && (
        <div className="datos-enviados bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-700 rounded-xl p-6 mb-8 text-center animate-slideUp">
          <div className="datos-enviados-text text-blue-700 font-bold flex items-center justify-center gap-2">
            <CheckCircle size={24} />
            DATOS ENVIADOS !!!
          </div>
        </div>
      )}

      <div className="button-group flex justify-between gap-4 mt-8">
        <button
          type="button"
          onClick={() => setPaymentProcessStep("view-plan")}
          className="px-6 py-3 border-2 rounded-lg font-bold border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={finalizePaymentProcess}
          disabled={!paymentProofFile}
          className="flex-1 py-3 rounded-lg font-bold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          Finalizar Pago
        </button>
      </div>
    </>
  )

  return (
    <div className="p-6">
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

      <div className="w-full max-w-4xl mx-auto">
        {paymentProcessStep === "view-plan" && renderPaymentPlan()}
        {paymentProcessStep === "upload-proof" && renderPaymentProcess()}
      </div>
    </div>
  )
}

export default EstudiantePagosView
