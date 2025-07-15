"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import InicioView from "@/components/InicioView"
import EstudiantesView from "@/components/EstudiantesView"
import CalificacionesView from "@/components/CalificacionesView"
import AsistenciaView from "@/components/AsistenciaView"

export default function GestionEstudiantesPage() {
  const [activeView, setActiveView] = useState("inicio")
  const [estudiantes, setEstudiantes] = useState([
    {
      id: 1,
      codigo: "EST001",
      nombre: "RUBI",
      apellidos: "CASTILLO",
      ci: "10111",
      numero: "00000",
      correo: "Janice_Monahan@yahoo.com",
      gradoMilitar: "Tte.",
      rangoProfesional: "Lic.",
      estado: "ACTIVO",
    },
    {
      id: 2,
      codigo: "EST002",
      nombre: "JHON",
      apellidos: "ESPINOZA",
      ci: "02292",
      numero: "567673",
      correo: "Rollin_Fadel@gmail.com",
      gradoMilitar: "Cap.",
      rangoProfesional: "Ing.",
      estado: "ACTIVO",
    },
    {
      id: 3,
      codigo: "EST003",
      nombre: "JOSEP",
      apellidos: "TORRICO",
      ci: "527575",
      numero: "972222",
      correo: "Lera_Stronman@gmail.com",
      gradoMilitar: "May.",
      rangoProfesional: "Mgr.",
      estado: "ACTIVO",
    },
    {
      id: 4,
      codigo: "EST004",
      nombre: "RICARDO",
      apellidos: "ROJAS",
      ci: "575242",
      numero: "000005",
      correo: "Adan_Schiller3@yahoo.com",
      gradoMilitar: "",
      rangoProfesional: "Dr.",
      estado: "RETIRADO",
    },
  ])

  useEffect(() => {
    localStorage.setItem("estudiantes", JSON.stringify(estudiantes))
  }, [estudiantes])

  const renderView = () => {
    switch (activeView) {
      case "inicio":
        return <InicioView />
      case "estudiantes":
        return (
          <EstudiantesView setActiveView={setActiveView} estudiantes={estudiantes} setEstudiantes={setEstudiantes} />
        )
      case "calificaciones":
        return (
          <CalificacionesView setActiveView={setActiveView} estudiantes={estudiantes} setEstudiantes={setEstudiantes} />
        )
      case "asistencia":
        return (
          <AsistenciaView setActiveView={setActiveView} estudiantes={estudiantes} setEstudiantes={setEstudiantes} />
        )
      default:
        return <InicioView />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
      <Header />
      <div className="flex">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 ml-80 mt-20 p-8">{renderView()}</main>
      </div>
    </div>
  )
}
