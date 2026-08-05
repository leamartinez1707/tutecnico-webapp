/**
 * Google Analytics Integration
 * Inicializa y trackea eventos de Google Analytics
 */

// Declarar tipos para gtag
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Inicializar Google Analytics
 * Debe llamarse en main.tsx al inicio de la app
 */
export const initAnalytics = () => {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!GA_MEASUREMENT_ID) {
    console.warn('⚠️ Google Analytics no configurado');
    return;
  }

  // Crear y agregar el script de Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Inicializar dataLayer y gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args as unknown as Record<string, unknown>);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    send_page_view: true,
  });
};

/**
 * Trackear evento personalizado
 * @param eventName - Nombre del evento
 * @param eventParams - Parámetros adicionales del evento
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, eventParams);
};

/**
 * Trackear vista de página (para SPA routing)
 * @param path - Ruta de la página
 */
export const trackPageView = (path: string) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
    page_path: path,
  });
};

// Eventos predefinidos para facilitar tracking

export const AnalyticsEvents = {
  // Búsqueda
  search: (searchTerm: string, filters?: Record<string, string>) => {
    trackEvent('search', {
      search_term: searchTerm,
      ...filters,
    });
  },

  // Registro de usuario
  signUp: (userType: 'user' | 'technician') => {
    trackEvent('sign_up', {
      method: 'email',
      user_type: userType,
    });
  },

  // Login
  login: (userType: 'user' | 'technician') => {
    trackEvent('login', {
      method: 'email',
      user_type: userType,
    });
  },

  // Crear reserva
  bookingCreated: (technicianId: number, service?: string) => {
    trackEvent('booking_created', {
      technician_id: technicianId,
      service,
    });
  },

  // Contactar técnico
  contactTechnician: (technicianId: number) => {
    trackEvent('contact_technician', {
      technician_id: technicianId,
    });
  },

  // Ver perfil de técnico
  viewTechnicianProfile: (technicianId: number, username: string) => {
    trackEvent('view_technician_profile', {
      technician_id: technicianId,
      username,
    });
  },

  // Agregar a favoritos
  addFavorite: (technicianId: number) => {
    trackEvent('add_favorite', {
      technician_id: technicianId,
    });
  },

  // Crear review
  createReview: (technicianId: number, rating: number) => {
    trackEvent('create_review', {
      technician_id: technicianId,
      rating,
    });
  },

  // Filtrar técnicos
  filterTechnicians: (filters: {
    specialization?: string;
    department?: string;
    search?: string;
  }) => {
    trackEvent('filter_technicians', filters);
  },

  // Cambiar ubicación
  changeLocation: (method: 'geolocation' | 'manual') => {
    trackEvent('change_location', {
      method,
    });
  },
};
