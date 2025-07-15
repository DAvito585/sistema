"use client"
import { FacturacionSidebar } from "@/components/FacturacionSidebar"
import { GenerarComprobanteForm } from "@/components/GenerarComprobanteForm"
import { VerificacionPagoForm } from "@/components/VerificacionPagoForm"
import { ReportePagosTable } from "@/components/ReportePagosTable"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

export default function FacturacionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentView = searchParams.get("view") || "inicio" // Default view

  const handleBack = () => {
    router.push("/facturacion") // Navigate back to the main facturacion page
  }

  const renderView = () => {
    switch (currentView) {
      case "generar":
        return <GenerarComprobanteForm onBack={handleBack} />
      case "verificar":
        return <VerificacionPagoForm onBack={handleBack} />
      case "reporte":
        return <ReportePagosTable onBack={handleBack} />
      case "inicio":
      default:
        return (
          <Card className="w-full max-w-2xl mx-auto text-center py-12">
            <CardHeader>
              <Home className="mx-auto h-12 w-12 text-primary mb-4" />
              <CardTitle className="text-3xl">Bienvenido al Sistema de Facturación</CardTitle>
              <CardDescription className="text-lg">
                Seleccione una opción del menú lateral para comenzar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Aquí podrá generar comprobantes, verificar pagos y acceder a reportes detallados.
              </p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      <FacturacionSidebar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">{renderView()}</main>
    </div>
  )
}
