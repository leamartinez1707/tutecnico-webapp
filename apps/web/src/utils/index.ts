import { LoggedUser } from '@/types';

export const countryInfo = [
    { id: 1, name: 'Artigas' },
    { id: 2, name: 'Canelones' },
    { id: 3, name: 'Cerro Largo' },
    { id: 4, name: 'Colonia' },
    { id: 5, name: 'Durazno' },
    { id: 6, name: 'Flores' },
    { id: 7, name: 'Florida' },
    { id: 8, name: 'Lavalleja' },
    { id: 9, name: 'Maldonado' },
    { id: 10, name: 'Montevideo' },
    { id: 11, name: 'Paysandú' },
    { id: 12, name: 'Río Negro' },
    { id: 13, name: 'Rivera' },
    { id: 14, name: 'Rocha' },
    { id: 15, name: 'Salto' },
    { id: 16, name: 'San José' },
    { id: 17, name: 'Soriano' },
    { id: 18, name: 'Tacuarembó' },
    { id: 19, name: 'Treinta Y Tres' }
];

export const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function isTechnician(user: LoggedUser) {
    if (user === null) {
        return false;
    }
    return user.technician !== null && user.technician !== undefined && user.technician.id !== undefined;
}

export const cutAddress = (address: string) => {
    return address ? address.split(",").slice(1, 3).join(", ") : "No disponible";
}

export const itemsPerPageData = [
    { id: 5, name: '5' },
    { id: 10, name: '10' },
    { id: 20, name: '20' },
    { id: 30, name: '30' },
    { id: 50, name: '50' },
    { id: 100, name: '100' }
]

// Exportar utilidades de logging y manejo de errores
export { logger } from './logger';
export { handleApiError, getErrorMessage, type ApiError } from './errorHandler';
