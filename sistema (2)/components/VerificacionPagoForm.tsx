"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VerificacionPagoFormProps {
  onBack: () => void
}

interface ProgramModule {
  id: string
  name: string
}

export function VerificacionPagoForm({ onBack }: VerificacionPagoFormProps) {
  const [ci, setCi] = useState("")
  const [nroComprobante, setNroComprobante] = useState("")
  const [programasDisponibles, setProgramasDisponibles] = useState<ProgramModule[]>([])
  const [selectedPrograma, setSelectedPrograma] = useState<string | undefined>(undefined)
  const [isCiLookedUp, setIsCiLookedUp] = useState(false)

  const handleCiLookup = () => {
    // Mock data lookup based on CI
    if (ci === "1234567") {
      setNroComprobante("COMP-2023-001")
      setProgramasDisponibles([
        { id: "prog1", name: "Automatización de Procesos - Módulo 1" },
        { id: "prog2", name: "Automatización de Procesos - Módulo 2" },
        { id: "prog3", name: "Ciencia de Datos Avanzada - Módulo 1" },
      ])
      setIsCiLookedUp(true)
      alert("Datos del estudiante y programas/módulos cargados.")
    } else {
      setNroComprobante("")
      setProgramasDisponibles([])
      setSelectedPrograma(undefined)
      setIsCiLookedUp(false)
      alert("CI no encontrado. Por favor, ingrese un CI válido.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCiLookedUp) {
      alert("Por favor, busque el CI primero.")
      return
    }
    console.log("Buscando pago para:", { ci, nroComprobante, selectedPrograma })
    alert("Buscando pago...")
  }

  const handleGenerateReport = () => {
    console.log("Generando reporte")
    alert("Generando reporte...")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">VERIFICACION DE PAGO</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="ci">CI:</Label>
            <div className="flex gap-2">
              <Input
                id="ci"
                type="text"
                placeholder="Ingrese CI"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                required
                disabled={isCiLookedUp}
              />
              <Button type="button" onClick={handleCiLookup} disabled={isCiLookedUp || ci.length === 0}>
                Buscar CI
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nroComprobante">NRO DE COMPROBANTE:</Label>
            <Input
              id="nroComprobante"
              type="text"
              placeholder="Número de comprobante"
              value={nroComprobante}
              readOnly
              disabled={!isCiLookedUp}
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="programaInscrito">PROGRAMA / MÓDULO:</Label>
            <Select
              value={selectedPrograma}
              onValueChange={setSelectedPrograma}
              disabled={!isCiLookedUp || programasDisponibles.length === 0}
            >
              <SelectTrigger id="programaInscrito">
                <SelectValue placeholder="Seleccione programa/módulo" />
              </SelectTrigger>
              <SelectContent>
                {programasDisponibles.map((prog) => (
                  <SelectItem key={prog.id} value={prog.id}>
                    {prog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              ATRAS
            </Button>
            <Button type="submit" disabled={!isCiLookedUp}>
              BUSCAR
            </Button>
            <Button type="button" onClick={handleGenerateReport} disabled={!isCiLookedUp}>
              Generar reporte
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
