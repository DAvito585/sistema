"use client"

/**
 * TechBackground
 *
 * Un fondo decorativo con gradientes y figuras animadas
 * que se sitúa detrás de toda la aplicación (‐z-10).
 */
export default function TechBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradiente principal */}
      <div className="absolute inset-x-0 top-1/3 h-[60vh] bg-gradient-to-br from-blue-500/40 via-blue-300/30 to-yellow-400/20 blur-3xl" />

      {/* Círculo flotando */}
      <div className="absolute -left-32 top-1/2 w-96 h-96 rounded-full bg-blue-600/40 blur-2xl animate-[float_10s_ease-in-out_infinite]" />

      {/* Panel angular */}
      <div className="absolute right-0 -bottom-24 w-[110vw] h-80 -rotate-3 bg-gradient-to-r from-blue-700/70 to-blue-500/40 blur-2xl" />
    </div>
  )
}
