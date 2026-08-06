/**
 * Configuración de contacto para TuTecnico *
 */

import { appInfo } from "@/const/appInfo";

export const CONTACT_CONFIG = {
    // WhatsApp
    whatsapp: {
        number: appInfo.phoneNumber,
        displayNumber: appInfo.phoneNumber,
    },

    // Email
    email: {
        support: appInfo.email,
        sales: appInfo.email,
    },

    // Redes sociales
    social: {
        facebook: "https://facebook.com/servyfix",
        instagram: "https://instagram.com/servyfix",
        twitter: "https://twitter.com/servyfix",
    },

    // Horarios de atención
    businessHours: {
        weekdays: "Lunes a Viernes: 9:00 - 18:00",
        saturday: "Sábado: 9:00 - 13:00",
        sunday: "Cerrado",
    },
};

/**
 * Helper para crear URL de WhatsApp
 */
export const createWhatsAppUrl = (message: string): string => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${encodedMessage}`;
};

/**
 * Helper para abrir WhatsApp en nueva ventana
 */
export const openWhatsApp = (message: string): void => {
    const url = createWhatsAppUrl(message);
    window.open(url, '_blank');
};
