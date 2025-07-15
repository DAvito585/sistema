"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ReportePagosTableProps {
  onBack: () => void
}

export function ReportePagosTable({ onBack }: ReportePagosTableProps) {
  const [fechaDesde, setFechaDesde] = useState<Date | undefined>(undefined)
  const [fechaHasta, setFechaHasta] = useState<Date | undefined>(undefined)
  const [selectedPrograma, setSelectedPrograma] = useState<string | undefined>(undefined)
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("verificado")

  const handleExportPdf = () => {
    console.log("Exportando PDF")
    alert("Exportando reporte a PDF...")
  }

  const payments = [
    {
      estudiante: "Janice Monahan",
      ci: "00000",
      programa: "Automatización de Procesos - Módulo 1",
      fechaPago: "10/05/2023",
      monto: "1500.00 Bs",
      comprobante: "[VER]",
    },
    {
      estudiante: "Rollin Fadel",
      ci: "001010",
      programa: "Ciencia de Datos Avanzada - Módulo 2",
      fechaPago: "20/06/2023",
      monto: "2000.00 Bs",
      comprobante: "[VER]",
    },
    {
      estudiante: "Lera Stroman",
      ci: "011102",
      programa: "Ciberseguridad Empresarial - Módulo 1",
      fechaPago: "01/07/2023",
      monto: "1800.00 Bs",
      comprobante: "[VER]",
    },
  ]

  const uniqueProgramas = Array.from(new Set(payments.map((p) => p.programa)))

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">REPORTE DE PAGOS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="grid gap-2">
            <Label htmlFor="fechaDesde">FECHA DESDE:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !fechaDesde && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaDesde ? format(fechaDesde, "PPP") : "Seleccione fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fechaDesde} onSelect={setFechaDesde} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaHasta">FECHA HASTA:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !fechaHasta && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaHasta ? format(fechaHasta, "PPP") : "Seleccione fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fechaHasta} onSelect={setFechaHasta} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="programa">PROGRAMA:</Label>
            <Select value={selectedPrograma} onValueChange={setSelectedPrograma}>
              <SelectTrigger id="programa">
                <SelectValue placeholder="Seleccione programa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los Programas</SelectItem>
                {uniqueProgramas.map((prog) => (
                  <SelectItem key={prog} value={prog}>
                    {prog}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 mb-6">
          <Label>ESTADO DE PAGO:</Label>
          <RadioGroup defaultValue="verificado" className="flex gap-4" onValueChange={setPaymentStatusFilter}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="verificado" id="verificado" />
              <Label htmlFor="verificado">VERIFICADO</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pendiente" id="pendiente" />
              <Label htmlFor="pendiente">PENDIENTE</Label>
            </div>
          </RadioGroup>
        </div>

        <Button className="mb-6 w-full md:w-auto">SIGUIENTE</Button>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ESTUDIANTE</TableHead>
                <TableHead>CI/NIT</TableHead>
                <TableHead>PROGRAMA</TableHead>
                <TableHead>FECHA PAGO</TableHead>
                <TableHead>MONTO</TableHead>
                <TableHead>COMPROBANTE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.estudiante}</TableCell>
                  <TableCell>{payment.ci}</TableCell>
                  <TableCell>{payment.programa}</TableCell>
                  <TableCell>{payment.fechaPago}</TableCell>
                  <TableCell>{payment.monto}</TableCell>
                  <TableCell>
                    <Button variant="link" className="p-0 h-auto">
                      {payment.comprobante}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            ATRAS
          </Button>
          <Button type="button" onClick={handleExportPdf}>
            EXPORTAR PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
