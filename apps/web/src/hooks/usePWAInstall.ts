import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent;
  }
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

interface WindowStandalone extends Window {
  MSStream?: unknown;
}

const isIos = () => /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as WindowStandalone).MSStream;
const isAndroid = () => /android/i.test(navigator.userAgent);
const isMobile = () => isIos() || isAndroid();
const isDesktop = () => !isMobile();
const isStandalone = () => 
  window.matchMedia('(display-mode: standalone)').matches || 
  (window.navigator as NavigatorStandalone).standalone ||
  document.referrer.includes('android-app://');

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Verificar si la PWA ya está instalada
  const checkIfInstalled = useCallback(() => {
    return isStandalone() || localStorage.getItem('pwa-installed') === 'true';
  }, []);

  // Verificar si se debe mostrar el prompt
  const shouldShowPrompt = useCallback(() => {
    const installed = checkIfInstalled();
    if (installed) {
      return false;
    }

    // Verificar si fue descartado y cuándo
    const dismissedData = localStorage.getItem('pwa-dismissed');
    if (!dismissedData) {
      return true; // Primera vez, mostrar
    }

    try {
      const { timestamp, permanent } = JSON.parse(dismissedData);
      
      // Si fue descartado permanentemente (después de varias veces), no mostrar
      if (permanent) {
        return false;
      }

      // Verificar si ya pasaron 7 días (604800000 ms)
      const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const timePassed = now - timestamp;

      return timePassed >= SEVEN_DAYS;
    } catch {
      // Si hay error parseando, mostrar el prompt
      return true;
    }
  }, [checkIfInstalled]);

  useEffect(() => {
    // Verificar estado inicial
    setIsInstalled(checkIfInstalled());
    setIsInstallable(shouldShowPrompt());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    if (isAndroid()) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    }

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (isAndroid()) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      }
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [checkIfInstalled, shouldShowPrompt]);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        localStorage.setItem('pwa-installed', 'true');
        // Limpiar el contador de descartes
        localStorage.removeItem('pwa-dismissed');
        return true;
      } else {
        // Usuario rechazó la instalación, contar como descarte
        dismiss();
        return false;
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
      return false;
    } finally {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const dismiss = () => {
    setIsInstallable(false);
    
    // Verificar cuántas veces ha sido descartado
    const dismissedData = localStorage.getItem('pwa-dismissed');
    let dismissCount = 0;

    if (dismissedData) {
      try {
        const parsed = JSON.parse(dismissedData);
        dismissCount = parsed.count || 0;
      } catch {
        dismissCount = 0;
      }
    }

    dismissCount++;

    // Después de 3 descartes, hacer permanente
    const permanent = dismissCount >= 3;

    localStorage.setItem('pwa-dismissed', JSON.stringify({
      timestamp: Date.now(),
      count: dismissCount,
      permanent
    }));
  };

  // Función para resetear el estado (útil para testing o si el usuario cambia de opinión)
  const reset = () => {
    localStorage.removeItem('pwa-dismissed');
    localStorage.removeItem('pwa-installed');
    setIsInstallable(shouldShowPrompt());
  };

  return {
    isInstallable: isInstallable && shouldShowPrompt() && !isInstalled,
    isInstalled,
    canInstall: !!deferredPrompt,
    isIos: isIos(),
    isAndroid: isAndroid(),
    isDesktop: isDesktop(),
    install,
    dismiss,
    reset
  };
};