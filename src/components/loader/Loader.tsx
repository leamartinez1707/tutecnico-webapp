import { useEffect, useState } from 'react'

const Loader = () => {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Iniciando...')

  useEffect(() => {
    const texts = [
      'Iniciando...',
      'Conectando con técnicos...',
      'Cargando servicios...',
      'Preparando todo para ti...'
    ]

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + Math.random() * 15
      })
    }, 200)

    const textInterval = setInterval(() => {
      setLoadingText(texts[Math.floor(Math.random() * texts.length)])
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(textInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center">
        {/* Logo animado */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            {/* Círculo exterior rotativo */}
            <div className="absolute inset-0 rounded-full border-4 border-blue-300 border-t-white animate-spin"></div>

            {/* Círculo interior pulsante */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Servi<span className="text-blue-300">Fix</span>
            <span className="text-2xl text-blue-200 font-normal">UY</span>
          </h1>

          <p className="text-blue-200 text-lg font-light">
            Conectando con los mejores técnicos
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-80 max-w-sm mx-auto mb-6">
          <div className="bg-blue-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-blue-400/30">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Efecto de brillo en la barra de progreso */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shimmer"></div>
            </div>
          </div>

          {/* Porcentaje */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-blue-300 text-sm font-medium">
              {Math.round(Math.min(progress, 100))}%
            </span>
            <span className="text-blue-200 text-sm">
              Cargando...
            </span>
          </div>
        </div>

        {/* Texto de carga animado */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-white/90 text-lg font-medium animate-fade-in-out">
            {loadingText}
          </p>
        </div>

        {/* Puntos animados */}
        <div className="flex space-x-1 justify-center mt-6">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white/20 rounded-full animate-float-${i + 1}`}
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Loader