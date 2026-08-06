import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary para capturar errores de React y mostrar UI de fallback
 * Previene que la aplicación quede en pantalla blanca
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error
    logger.error('Error capturado por Error Boundary', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de error por defecto
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Icono de error */}
              <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>

              {/* Título y mensaje */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">
                  Algo salió mal
                </h1>
                <p className="text-zinc-400">
                  Ocurrió un error inesperado al cargar esta página.
                </p>
              </div>

              {/* Detalles del error (solo en desarrollo) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="w-full">
                    <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-300 mb-2">
                      Ver detalles técnicos
                    </summary>
                    <div className="bg-zinc-800 rounded-lg p-4 text-left">
                      <p className="text-xs text-red-400 font-mono break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                        <pre className="text-xs text-zinc-400 mt-2 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex-1 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button
                  onClick={this.handleReload}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Recargar página
                </Button>
              </div>

              <Button
                onClick={this.handleGoHome}
                  variant="ghost"
                  className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>

              {/* Información adicional */}
              <p className="text-xs text-zinc-500 mt-4">
                Si el problema persiste, por favor contacta a soporte.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
