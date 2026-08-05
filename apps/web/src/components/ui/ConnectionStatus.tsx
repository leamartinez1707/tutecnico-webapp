import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '../ui/badge';

const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Ocultar el mensaje después de unos segundos cuando esté online
  useEffect(() => {
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  // Solo mostrar cuando está offline o cuando vuelve online temporalmente
  if (!showOfflineMessage && isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className={`flex items-center gap-2 px-3 py-2 rounded-none shadow-lg ${
          isOnline 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}
      >
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span className="text-sm font-medium">Conectado</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Sin conexión - Modo offline</span>
          </>
        )}
      </Badge>
    </div>
  );
};

export default ConnectionStatus;