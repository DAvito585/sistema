"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, FileText, Search, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function FacturacionSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Inicio Facturación",
      href: "/facturacion",
      icon: Home,
    },
    {
      name: "Generar Comprobante",
      href: "/facturacion?view=generar",
      icon: CreditCard,
    },
    {
      name: "Verificar Pago",
      href: "/facturacion?view=verificar",
      icon: Search,
    },
    {
      name: "Reporte de Pagos",
      href: "/facturacion?view=reporte",
      icon: FileText,
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/facturacion" className="flex items-center gap-2 font-semibold">
            <CreditCard className="h-6 w-6" />
            <span className="">Facturación EMI</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href || (item.href === "/facturacion" && pathname === "/facturacion")
                    ? "bg-muted text-primary"
                    : "",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
