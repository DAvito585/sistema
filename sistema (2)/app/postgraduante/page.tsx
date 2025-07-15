"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Book, Mail, User, CalendarDays, FileText } from "lucide-react"

// Define programData and enrollmentFee outside the component or memoize them
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

export default function PostgraduantePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("login") // "login", "register", "form", "payment"
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([])
  const [fileUploaded, setFileUploaded] = useState(false) // Still needed for form, but not for payment process here

  // Usuarios predefinidos - ahora se pueden agregar nuevos
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([
    {
      carnet: "20241001",
      fechaNacimiento: "1995-03-15",
      email: "alejandro.martinez.lopez@gmail.com",
      nombre: "Alejandro Martinez Lopez",
    },
    {
      carnet: "20241002",
      fechaNacimiento: "1993-07-22",
      email: "maria.gonzalez.rodriguez@hotmail.com",
      nombre: "Maria Gonzalez Rodriguez",
    },
    {
      carnet: "20241003",
      fechaNacimiento: "1994-11-08",
      email: "carlos.rodriguez.sanchez@yahoo.com",
      nombre: "Carlos Rodriguez Sanchez",
    },
    {
      carnet: "20241004",
      fechaNacimiento: "1996-01-30",
      email: "ana.patricia.flores@outlook.com",
      nombre: "Ana Patricia Flores",
    },
    {
      carnet: "20241005",
      fechaNacimiento: "1992-09-14",
      email: "luis.fernando.castro@gmail.com",
      nombre: "Luis Fernando Castro",
    },
    {
      carnet: "20241006",
      fechaNacimiento: "1997-05-20",
      email: "estudiante.prueba@example.com",
      nombre: "Estudiante Prueba",
    },
  ])

  const [formData, setFormData] = useState({
    carnet: "",
    fechaNacimiento: "",
    nombreCompleto: "",
    carnetIdentidad: "",
    nacionalidad: "",
    correoElectronico: "",
    posgrado: "", // This will be the key for programData
    descuento: "ninguno",
    documento: "",
  })

  const [paymentTotals, setPaymentTotals] = useState({
    totalSinDescuento: 0,
    descuentoAplicado: 0,
    totalAPagar: 0,
  })

  // Load usuarios from localStorage on component mount
  useEffect(() => {
    const storedUsuarios = localStorage.getItem("usuariosRegistrados")
    if (storedUsuarios) {
      setUsuariosRegistrados(JSON.parse(storedUsuarios))
    }
  }, [])

  // Save usuarios to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem("usuariosRegistrados", JSON.stringify(usuariosRegistrados))
  }, [usuariosRegistrados])

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

  const validateCarnet = (carnet: string) => {
    return /^\d{6,8}$/.test(carnet)
  }

  const buscarUsuario = useCallback(
    (carnet: string, fechaNacimiento: string) => {
      return usuariosRegistrados.find((user) => user.carnet === carnet && user.fechaNacimiento === fechaNacimiento)
    },
    [usuariosRegistrados],
  )

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCarnet(formData.carnet)) {
      addNotification("❌ El carnet debe tener entre 6 y 8 dígitos", "error")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const usuario = buscarUsuario(formData.carnet, formData.fechaNacimiento)

      if (usuario) {
        localStorage.setItem("postgraduanteUser", JSON.stringify(usuario))
        addNotification("✅ Usuario encontrado. Complete el formulario de pre-inscripción.", "success")
        setFormData((prev) => ({
          ...prev,
          nombreCompleto: usuario.nombre,
          correoElectronico: usuario.email,
          carnetIdentidad: usuario.carnet, // Assuming carnet from login is CI
        }))
        setCurrentStep("form") // Go directly to form
      } else {
        addNotification(
          "❌ No se encontró un usuario con estos datos. Verifique su carnet y fecha de nacimiento o regístrese.",
          "error",
        )
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCarnet(formData.carnet)) {
      addNotification("❌ El carnet debe tener entre 6 y 8 dígitos", "error")
      return
    }
    if (!validateEmail(formData.correoElectronico)) {
      addNotification("❌ Ingrese un email válido", "error")
      return
    }

    // Check if user already exists
    const existingUser = usuariosRegistrados.find((user) => user.carnet === formData.carnet)
    if (existingUser) {
      addNotification("❌ Ya existe un usuario con este carnet", "error")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const newUser = {
        carnet: formData.carnet,
        fechaNacimiento: formData.fechaNacimiento,
        email: formData.correoElectronico,
        nombre: formData.nombreCompleto,
      }

      // Add new user to the list
      setUsuariosRegistrados((prev) => [...prev, newUser])

      localStorage.setItem("postgraduanteUser", JSON.stringify(newUser))
      addNotification("✅ Registro exitoso! Complete el formulario de pre-inscripción.", "success")
      addNotification("✅ Nuevo postgraduante guardado en el sistema.", "success")
      setFormData((prev) => ({
        ...prev,
        nombreCompleto: newUser.nombre,
        correoElectronico: newUser.email,
        carnetIdentidad: newUser.carnet, // Assuming carnet from login is CI
      }))
      setCurrentStep("form") // Go directly to form
      setIsLoading(false)
    }, 2000)
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
    const totalSinDescuento = totalModulesCost + enrollmentFee // Modules cost + fixed enrollment fee
    const descuentoAplicado = calcularDescuento(totalSinDescuento, formData.descuento)
    const totalAPagar = totalSinDescuento - descuentoAplicado

    setPaymentTotals({ totalSinDescuento, descuentoAplicado, totalAPagar })
    localStorage.setItem("totalesPago", JSON.stringify({ totalSinDescuento, descuentoAplicado, totalAPagar }))

    addNotification("📋 Formulario completado. Revise su plan de pagos.", "success")
    setCurrentStep("payment")
  }

  const confirmPreInscription = () => {
    addNotification("🎉 ¡Pre-inscripción completada exitosamente!", "success")
    addNotification("✅ Su pre-inscripción ha sido registrada", "success")
    addNotification("📧 Recibirá un correo de confirmación", "success")
    addNotification("Diríjase a 'Mis Pagos' en el panel de estudiante para proceder con el pago.", "info")

    setTimeout(() => {
      router.push("/estudiante") // Redirect to student dashboard
    }, 3000)
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

  // Initial load effect to determine the starting step
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("postgraduanteUser") || "{}")
    const storedFormData = JSON.parse(localStorage.getItem("formularioData") || "{}")
    const storedPaymentTotals = JSON.parse(localStorage.getItem("totalesPago") || "{}")

    if (user.nombre && user.email && user.carnet) {
      setFormData((prev) => ({
        ...prev,
        nombreCompleto: user.nombre,
        correoElectronico: user.email,
        carnetIdentidad: user.carnet,
      }))
      if (Object.keys(storedFormData).length > 0 && storedFormData.posgrado) {
        setFormData((prev) => ({ ...prev, ...storedFormData }))
        if (Object.keys(storedPaymentTotals).length > 0 && storedPaymentTotals.totalAPagar) {
          setPaymentTotals(storedPaymentTotals)
          setCurrentStep("payment")
        } else {
          setCurrentStep("form")
        }
      } else {
        setCurrentStep("form")
      }
    } else {
      setCurrentStep("login")
    }
  }, []) // Run only once on mount

  // Effect to update form data or payment totals when currentStep changes
  useEffect(() => {
    if (currentStep === "form") {
      const user = JSON.parse(localStorage.getItem("postgraduanteUser") || "{}")
      if (user.nombre && user.email && user.carnet) {
        setFormData((prev) => ({
          ...prev,
          nombreCompleto: user.nombre,
          correoElectronico: user.email,
          carnetIdentidad: user.carnet,
        }))
      }
      addNotification("📝 Complete el formulario de pre-inscripción", "info")
    } else if (currentStep === "payment") {
      const storedFormData = JSON.parse(localStorage.getItem("formularioData") || "{}")
      if (storedFormData && storedFormData.posgrado && programData[storedFormData.posgrado]) {
        setFormData((prev) => ({ ...prev, ...storedFormData }))
        const selectedProgram = programData[storedFormData.posgrado]
        const totalModulesCost = selectedProgram.basePricePerModule * selectedProgram.numberOfModules
        const totalSinDescuento = totalModulesCost + enrollmentFee
        const descuentoAplicado = calcularDescuento(totalSinDescuento, storedFormData.descuento)
        const totalAPagar = totalSinDescuento - descuentoAplicado
        setPaymentTotals({ totalSinDescuento, descuentoAplicado, totalAPagar })
      } else {
        addNotification("❌ Datos de formulario incompletos o inválidos. Vuelva a completar el formulario.", "error")
        setCurrentStep("form")
      }
    }
  }, [currentStep, addNotification, calcularDescuento]) // Dependencies for this effect

  const renderLogin = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <Image
          src="/images/logo-emi-posgrado.png"
          alt="EMI Logo"
          width={180}
          height={120}
          className="mx-auto object-contain mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-blue-800 dark:text-blue-300">EMI POST-GRADO</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Iniciar Sesión</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Carnet Universitario</label>
          <input
            type="text"
            value={formData.carnet}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 8)
              setFormData({ ...formData, carnet: value })
            }}
            className="w-full p-3 border-2 rounded-xl font-medium border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white pr-10"
            placeholder="Ingrese su carnet"
            required
          />
          <Book className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Fecha de Nacimiento</label>
          <input
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
            className="w-full p-3 border-2 rounded-xl font-medium border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 text-gray-900 dark:text-white pr-10"
            required
          />
          <CalendarDays
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            size={20}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold text-white transition-all bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Verificando..." : "Iniciar Sesión"}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => setCurrentStep("register")}
          className="text-sm font-medium hover:underline text-blue-600 dark:text-blue-400"
        >
          ¿No tienes cuenta? Registrarme
        </button>
      </div>
    </div>
  )

  const renderRegister = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <Image
          src="/images/logo-emi-posgrado.png"
          alt="EMI Logo"
          width={160}
          height={100}
          className="mx-auto object-contain mb-6"
        />
        <h1 className="text-4xl font-bold mb-4 text-blue-800 dark:text-blue-300">EMI POST-GRADO</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Registro</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Carnet Universitario</label>
          <input
            type="text"
            value={formData.carnet}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 8)
              setFormData({ ...formData, carnet: value })
            }}
            className="w-full p-3 border-2 rounded-xl font-medium border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white pr-10"
            placeholder="Ingrese su carnet"
            required
          />
          <Book className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Nombre Completo</label>
          <input
            type="text"
            value={formData.nombreCompleto}
            onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
            className="w-full p-3 border-2 rounded-xl font-medium border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white pr-10"
            placeholder="Juan Perez Castillo"
            required
          />
          <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
        </div>

        <div className="relative">
          <label className="block text-sm font-bold mb-2 text-gray-800 dark:text-gray-200">Fecha de Nacimiento</label>
          <input
            type="date"
            value={formData.fechaNacimiento}
            onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
            className="w-full p-3 border-2 rounded-xl font-medium border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white pr-10"
            required
          />
          <CalendarDays
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
            className="w-full p-3 border-2 rounded-xl font-medium border-blue-300 dark:border-blue-600 bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white pr-10"
            placeholder="ejemplo@gmail.com"
            required
          />
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-bold text-white transition-all bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Registrando..." : "Finalizar Registro"}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          onClick={() => setCurrentStep("login")}
          className="text-sm font-medium hover:underline text-blue-600 dark:text-blue-400"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </button>
      </div>
    </div>
  )

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
            onClick={() => setCurrentStep("login")} // Go back to login/register
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
            onClick={() => setCurrentStep("form")}
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
            onClick={confirmPreInscription} // Changed to confirm pre-inscription
            className="flex-1 py-3 rounded-lg font-bold text-white bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700"
          >
            Confirmar Pre-inscripción
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900 dark:via-blue-800 dark:to-gray-900 transition-colors duration-300">
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

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:underline transition-colors text-blue-800 dark:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>

        <div className="p-8 rounded-3xl shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-700 transition-colors duration-300">
          {currentStep === "login" && renderLogin()}
          {currentStep === "register" && renderRegister()}
          {currentStep === "form" && renderForm()}
          {currentStep === "payment" && renderPayment()}
        </div>
      </div>
    </div>
  )
}
