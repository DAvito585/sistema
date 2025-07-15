"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, Info, QrCode, Printer, FileText, CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import QRCode from "qrcode.react"

// Definición de tipos para la inscripción
interface Inscription {
  id: string
  studentName: string
  ci: string
  program: string
  modules: { name: string; price: number }[]
  totalAmount: number
  status: "Pendiente" | "Pagado" | "Rechazado" | "Inscrito"
  paymentMethod: string
  paymentDate: string
  paymentStartDate: string
  paymentEndDate: string
  voucherNumber?: string
  qrCodeData?: string
}

export default function InscripcionesPage() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("Todos")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [newInscription, setNewInscription] = useState<
    Omit<Inscription, "id" | "status" | "paymentDate" | "totalAmount">
  >({
    studentName: "",
    ci: "",
    program: "",
    modules: [],
    paymentMethod: "",
    paymentStartDate: "",
    paymentEndDate: "",
  })
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false)
  const [currentQrData, setCurrentQrData] = useState<string>("")
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<boolean>(false)
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null)
  const [confirmationAction, setConfirmationAction] = useState<"pagar" | "rechazar" | "inscribir" | null>(null)

  // Datos de ejemplo para programas y módulos
  const programs = [
    {
      name: "Diplomado en Desarrollo Web",
      modules: [
        { name: "Módulo 1: HTML/CSS", price: 300 },
        { name: "Módulo 2: JavaScript", price: 400 },
        { name: "Módulo 3: React", price: 500 },
      ],
    },
    {
      name: "Maestría en IA",
      modules: [
        { name: "Módulo A: Fundamentos de ML", price: 1000 },
        { name: "Módulo B: Redes Neuronales", price: 1200 },
        { name: "Módulo C: Procesamiento de Lenguaje Natural", price: 1500 },
      ],
    },
  ]

  useEffect(() => {
    // Cargar inscripciones desde localStorage al inicio
    const storedInscriptions = localStorage.getItem("inscriptions")
    if (storedInscriptions) {
      setInscriptions(JSON.parse(storedInscriptions))
    }
  }, [])

  useEffect(() => {
    // Guardar inscripciones en localStorage cada vez que cambian
    localStorage.setItem("inscriptions", JSON.stringify(inscriptions))
  }, [inscriptions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewInscription((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewInscription((prev) => ({ ...prev, [name]: value }))
    if (name === "program") {
      setSelectedModules([]) // Reset selected modules when program changes
    }
  }

  const handleModuleToggle = (moduleName: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleName) ? prev.filter((name) => name !== moduleName) : [...prev, moduleName],
    )
  }

  const handleDateChange = (date: Date | undefined, field: "paymentStartDate" | "paymentEndDate") => {
    if (date) {
      setNewInscription((prev) => ({ ...prev, [field]: format(date, "yyyy-MM-dd") }))
    } else {
      setNewInscription((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddInscription = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedProgram = programs.find((p) => p.name === newInscription.program)
    const modulesToSave = selectedProgram
      ? selectedProgram.modules.filter((mod) => selectedModules.includes(mod.name))
      : []
    const totalAmount = modulesToSave.reduce((sum, mod) => sum + mod.price, 0)

    const newId = `INC-${Date.now()}`
    const qrData = `ID:${newId}|CI:${newInscription.ci}|Monto:${totalAmount}|Fecha:${format(new Date(), "yyyy-MM-dd")}`

    const inscriptionToAdd: Inscription = {
      ...newInscription,
      id: newId,
      modules: modulesToSave,
      totalAmount: totalAmount,
      status: "Pendiente",
      paymentDate: "", // Se llenará al marcar como pagado
      qrCodeData: qrData,
    }

    setInscriptions((prev) => [...prev, inscriptionToAdd])
    setIsFormOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setNewInscription({
      studentName: "",
      ci: "",
      program: "",
      modules: [],
      paymentMethod: "",
      paymentStartDate: "",
      paymentEndDate: "",
    })
    setSelectedModules([])
  }

  const filteredInscriptions = inscriptions.filter((inscription) => {
    const matchesStatus = filterStatus === "Todos" || inscription.status === filterStatus
    const matchesSearch =
      inscription.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.ci.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.program.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const openConfirmationModal = (inscription: Inscription, action: "pagar" | "rechazar" | "inscribir") => {
    setSelectedInscription(inscription)
    setConfirmationAction(action)
    setIsConfirmationModalOpen(true)
  }

  const handleConfirmAction = () => {
    if (!selectedInscription || !confirmationAction) return

    const updatedInscriptions = inscriptions.map((inc) => {
      if (inc.id === selectedInscription.id) {
        if (confirmationAction === "pagar") {
          return { ...inc, status: "Pagado", paymentDate: format(new Date(), "yyyy-MM-dd") }
        } else if (confirmationAction === "rechazar") {
          return { ...inc, status: "Rechazado" }
        } else if (confirmationAction === "inscribir") {
          return { ...inc, status: "Inscrito" }
        }
      }
      return inc
    })
    setInscriptions(updatedInscriptions)
    setIsConfirmationModalOpen(false)
    setSelectedInscription(null)
    setConfirmationAction(null)
  }

  const handleViewQr = (qrData: string) => {
    setCurrentQrData(qrData)
    setIsQrModalOpen(true)
  }

  const handlePrint = (inscription: Inscription) => {
    const printContent = `
      <h1>Comprobante de Pre-Inscripción</h1>
      <p><strong>ID de Inscripción:</strong> ${inscription.id}</p>
      <p><strong>Nombre del Estudiante:</strong> ${inscription.studentName}</p>
      <p><strong>CI:</strong> ${inscription.ci}</p>
      <p><strong>Programa:</strong> ${inscription.program}</p>
      <p><strong>Módulos:</strong></p>
      <ul>
        ${inscription.modules.map((mod) => `<li>${mod.name} - ${mod.price} Bs</li>`).join("")}
      </ul>
      <p><strong>Monto Total:</strong> ${inscription.totalAmount} Bs</p>
      <p><strong>Método de Pago:</strong> ${inscription.paymentMethod}</p>
      <p><strong>Estado:</strong> ${inscription.status}</p>
      ${inscription.paymentDate ? `<p><strong>Fecha de Pago:</strong> ${inscription.paymentDate}</p>` : ""}
      ${inscription.voucherNumber ? `<p><strong>Número de Comprobante:</strong> ${inscription.voucherNumber}</p>` : ""}
      <p><strong>Periodo de Pago:</strong> ${inscription.paymentStartDate} al ${inscription.paymentEndDate}</p>
      ${inscription.qrCodeData ? `<div id="qrcode-print"></div>` : ""}
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Comprobante de Pre-Inscripción</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #2c3e50; }
              p { margin-bottom: 5px; }
              ul { list-style: none; padding: 0; }
              li { margin-bottom: 3px; }
              #qrcode-print { margin-top: 20px; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `)
      printWindow.document.close()

      if (inscription.qrCodeData) {
        const qrCanvas = document.createElement("canvas")
        QRCode.toCanvas(qrCanvas, inscription.qrCodeData, { width: 128 }, (error) => {
          if (error) console.error(error)
          const qrContainer = printWindow.document.getElementById("qrcode-print")
          if (qrContainer) {
            qrContainer.appendChild(qrCanvas)
          }
          printWindow.print()
        })
      } else {
        printWindow.print()
      }
    }
  }

  const getProgramModules = (programName: string) => {
    const program = programs.find((p) => p.name === programName)
    return program ? program.modules : []
  }

  return (
    <div className="flex flex-col w-full max-w-full mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Pre-Inscripciones y Pagos</h1>

      {/* Sección de Notificaciones/Alertas */}
      <Card className="mb-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <Info className="h-5 w-5" /> Notificaciones y Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Aquí se mostrarán alertas importantes sobre inscripciones pendientes, pagos próximos o confirmaciones.
          </p>
          {/* Ejemplo de alerta */}
          {inscriptions.filter((inc) => inc.status === "Pendiente").length > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md flex items-center gap-2">
              <Info className="h-4 w-4" />
              Tienes {inscriptions.filter((inc) => inc.status === "Pendiente").length} pre-inscripciones pendientes de
              pago.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulario de Pre-Inscripción */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nueva Pre-Inscripción</CardTitle>
          <CardDescription>Complete los datos para registrar una nueva pre-inscripción.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsFormOpen(!isFormOpen)} className="mb-4">
            {isFormOpen ? "Ocultar Formulario" : "Abrir Formulario de Pre-Inscripción"}
          </Button>

          {isFormOpen && (
            <form onSubmit={handleAddInscription} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentName">Nombre Completo</Label>
                <Input
                  id="studentName"
                  name="studentName"
                  value={newInscription.studentName}
                  onChange={handleInputChange}
                  placeholder="Nombre del estudiante"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ci">CI</Label>
                <Input
                  id="ci"
                  name="ci"
                  value={newInscription.ci}
                  onChange={handleInputChange}
                  placeholder="Cédula de identidad"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="program">Programa/Diplomado/Maestría</Label>
                <Select
                  name="program"
                  value={newInscription.program}
                  onValueChange={(value) => handleSelectChange("program", value)}
                  required
                >
                  <SelectTrigger id="program">
                    <SelectValue placeholder="Seleccione un programa" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Módulos a Inscribir</Label>
                <div className="flex flex-wrap gap-2">
                  {getProgramModules(newInscription.program).map((mod) => (
                    <Button
                      key={mod.name}
                      type="button"
                      variant={selectedModules.includes(mod.name) ? "default" : "outline"}
                      onClick={() => handleModuleToggle(mod.name)}
                    >
                      {mod.name} ({mod.price} Bs)
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  name="paymentMethod"
                  value={newInscription.paymentMethod}
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                  required
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Seleccione método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="QR">Pago QR</SelectItem>
                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentStartDate">Fecha Inicio Pago</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newInscription.paymentStartDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newInscription.paymentStartDate
                        ? format(new Date(newInscription.paymentStartDate), "PPP")
                        : "Seleccione fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newInscription.paymentStartDate ? new Date(newInscription.paymentStartDate) : undefined}
                      onSelect={(date) => handleDateChange(date, "paymentStartDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentEndDate">Fecha Fin Pago</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newInscription.paymentEndDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newInscription.paymentEndDate
                        ? format(new Date(newInscription.paymentEndDate), "PPP")
                        : "Seleccione fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newInscription.paymentEndDate ? new Date(newInscription.paymentEndDate) : undefined}
                      onSelect={(date) => handleDateChange(date, "paymentEndDate")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Limpiar
                </Button>
                <Button type="submit">Registrar Pre-Inscripción</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Lista de Pre-Inscripciones */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Inscripciones Registradas</CardTitle>
          <CardDescription>Gestione las pre-inscripciones y sus estados de pago.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Buscar por nombre, CI o programa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Pagado">Pagado</SelectItem>
                <SelectItem value="Rechazado">Rechazado</SelectItem>
                <SelectItem value="Inscrito">Inscrito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-[1200px] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[180px]">ESTUDIANTE</TableHead>
                  <TableHead className="w-[100px]">CI</TableHead>
                  <TableHead className="w-[200px]">PROGRAMA</TableHead>
                  <TableHead className="w-[300px]">MÓDULOS (Precio)</TableHead>
                  <TableHead className="w-[100px]">TOTAL</TableHead>
                  <TableHead className="w-[120px]">ESTADO</TableHead>
                  <TableHead className="w-[120px]">MÉTODO PAGO</TableHead>
                  <TableHead className="w-[120px]">FECHA PAGO</TableHead>
                  <TableHead className="w-[180px]">PERIODO PAGO</TableHead>
                  <TableHead className="w-[250px] text-right">ACCIONES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No hay pre-inscripciones que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInscriptions.map((inscription) => (
                    <TableRow key={inscription.id}>
                      <TableCell className="font-medium">{inscription.id}</TableCell>
                      <TableCell>{inscription.studentName}</TableCell>
                      <TableCell>{inscription.ci}</TableCell>
                      <TableCell>{inscription.program}</TableCell>
                      <TableCell>
                        {inscription.modules.map((mod, idx) => (
                          <div key={idx}>
                            {mod.name} ({mod.price} Bs)
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{inscription.totalAmount} Bs</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold",
                            inscription.status === "Pendiente" &&
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                            inscription.status === "Pagado" &&
                              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                            inscription.status === "Rechazado" &&
                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                            inscription.status === "Inscrito" &&
                              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                          )}
                        >
                          {inscription.status}
                        </span>
                      </TableCell>
                      <TableCell>{inscription.paymentMethod}</TableCell>
                      <TableCell>{inscription.paymentDate || "N/A"}</TableCell>
                      <TableCell>
                        {inscription.paymentStartDate} al {inscription.paymentEndDate}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {inscription.status === "Pendiente" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmationModal(inscription, "pagar")}
                              title="Marcar como Pagado"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openConfirmationModal(inscription, "rechazar")}
                              title="Rechazar Pre-Inscripción"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {inscription.status === "Pagado" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmationModal(inscription, "inscribir")}
                            title="Inscribir Estudiante"
                          >
                            Inscribir
                          </Button>
                        )}
                        {inscription.paymentMethod === "QR" && inscription.qrCodeData && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQr(inscription.qrCodeData!)}
                            title="Ver Código QR"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrint(inscription)}
                          title="Imprimir Comprobante"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => alert("Ver detalles de la inscripción")}
                          title="Ver Detalles"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Confirmación */}
      <Dialog open={isConfirmationModalOpen} onOpenChange={setIsConfirmationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Acción</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea{" "}
              {confirmationAction === "pagar"
                ? "marcar como pagado"
                : confirmationAction === "rechazar"
                  ? "rechazar"
                  : "inscribir"}{" "}
              la pre-inscripción de {selectedInscription?.studentName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmationModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmAction}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de QR */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-[425px] text-center">
          <DialogHeader>
            <DialogTitle>Código QR de Pago</DialogTitle>
            <DialogDescription>Escanee este código para realizar el pago.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {currentQrData && <QRCode value={currentQrData} size={256} level="H" />}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsQrModalOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
