import { useEffect, useState } from 'react';
import { rateLimiter } from '@/utils/rateLimiter';
import { AlertTriangle } from 'lucide-react';

interface RateLimitWarningProps {
  endpoint: string;
  onBlocked?: () => void;
}

/**
 * Componente que muestra advertencia cuando se está cerca del límite de peticiones
 * Útil para formularios o acciones que pueden ser repetitivas
 */
const RateLimitWarning = ({ endpoint, onBlocked }: RateLimitWarningProps) => {
  const [stats, setStats] = useState({ current: 0, max: 10, blocked: false });
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      const newStats = rateLimiter.getStats(endpoint);
      
      // Solo actualizar si hay cambios significativos
      if (
        newStats.current !== stats.current || 
        newStats.blocked !== stats.blocked
      ) {
        setStats(newStats);
      }

      if (newStats.blocked) {
        const remaining = rateLimiter.getRemainingBlockTime(endpoint);
        if (remaining !== remainingTime) {
          setRemainingTime(remaining);
        }
        onBlocked?.();
      }
    };

    // Actualizar inmediatamente
    updateStats();
    
    // Solo actualizar cada segundo si está bloqueado o cerca del límite
    const percentageUsed = (stats.current / stats.max) * 100;
    if (stats.blocked || percentageUsed >= 70) {
      const interval = setInterval(updateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [endpoint, onBlocked, stats.current, stats.blocked, stats.max, remainingTime]);

  // No mostrar nada si está lejos del límite
  const percentageUsed = (stats.current / stats.max) * 100;
  if (percentageUsed < 70 && !stats.blocked) {
    return null;
  }

  // Bloqueado
  if (stats.blocked && remainingTime > 0) {
    return (
      <div className="flex items-start gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-md">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            Demasiadas peticiones
          </p>
          <p className="text-xs text-red-700 mt-1">
            Por favor espera {remainingTime} segundos antes de intentar nuevamente.
          </p>
        </div>
      </div>
    );
  }

  // Cerca del límite (advertencia)
  if (percentageUsed >= 70) {
    return (
      <div className="flex items-start gap-2 p-3 mb-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">
            Acercándose al límite de peticiones
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            {stats.current} de {stats.max} peticiones realizadas. Por favor modera tu uso.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default RateLimitWarning;
