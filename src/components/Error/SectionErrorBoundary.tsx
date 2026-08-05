import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { logger } from '@/utils/logger';

interface Props {
  children: ReactNode;
  sectionName: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Error Boundary para secciones específicas de la app
 * Muestra un mensaje de error inline sin romper toda la página
 */
class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(`Error en sección: ${this.props.sectionName}`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="font-semibold text-gray-900">
              Error en {this.props.sectionName}
            </h3>
            <p className="text-sm text-gray-600">
              {this.props.fallbackMessage || 
                'No pudimos cargar esta sección. Por favor, recarga la página.'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SectionErrorBoundary;
