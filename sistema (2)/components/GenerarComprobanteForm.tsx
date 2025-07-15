"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface GenerarComprobanteFormProps {
  onBack: () => void
}

export function GenerarComprobanteForm({ onBack }: GenerarComprobanteFormProps) {
  const [ci, setCi] = useState("")
  const [nombreCompleto, setNombreCompleto] = useState("")
  const [montoPagado, setMontoPagado] = useState<number | string>("")
  const [fechaPago, setFechaPago] = useState<Date | undefined>(undefined)
  const [isCiLookedUp, setIsCiLookedUp] = useState(false)

  const handleCiLookup = () => {
    // Mock data lookup based on CI
    if (ci === "1234567") {
      setNombreCompleto("Ana García")
      setMontoPagado(1500.0)
      setFechaPago(new Date())
      setIsCiLookedUp(true)
      alert("Datos del estudiante cargados.")
    } else {
      setNombreCompleto("")
      setMontoPagado("")
      setFechaPago(undefined)
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
    console.log("Generando comprobante para:", { ci, nombreCompleto, montoPagado, fechaPago })
    alert("Comprobante generado y enviado!")
    // Reset form
    setCi("")
    setNombreCompleto("")
    setMontoPagado("")
    setFechaPago(undefined)
    setIsCiLookedUp(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">GENERA COMPROBANTE DE PAGO</CardTitle>
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
            <Label htmlFor="nombreCompleto">NOMBRE COMPLETO:</Label>
            <Input
              id="nombreCompleto"
              type="text"
              placeholder="Nombre completo del estudiante"
              value={nombreCompleto}
              readOnly
              disabled={!isCiLookedUp}
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="montoPagado">MONTO PAGADO:</Label>
            <Input
              id="montoPagado"
              type="number"
              step="0.01"
              placeholder="Monto del pago"
              value={montoPagado}
              readOnly
              disabled={!isCiLookedUp}
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaPago">FECHA DE PAGO:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !fechaPago && "text-muted-foreground")}
                  disabled={!isCiLookedUp}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaPago ? format(fechaPago, "PPP") : "Seleccione fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fechaPago} onSelect={setFechaPago} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between mt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              ATRAS
            </Button>
            <Button type="submit" disabled={!isCiLookedUp}>
              ENVIAR
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
