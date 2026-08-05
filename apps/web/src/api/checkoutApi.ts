import api from "./axios";
import { handleApiError } from "@/utils";

export interface CreatePreferenceRequest {
    technicianId: number;
    planType: 'monthly' | 'yearly';
    successUrl: string;
    failureUrl: string;
    pendingUrl: string;
}

export interface CreatePreferenceResponse {
    preferenceId: string;
    init_point: string; // URL de redirección a Mercado Pago
}

/**
 * Crea una preferencia de pago en Mercado Pago a través del backend
 * @param data Datos necesarios para crear la preferencia
 * @returns URL de redirección y preferenceId
 */
export const createCheckoutPreference = async (data: CreatePreferenceRequest): Promise<CreatePreferenceResponse> => {
    try {
        console.log('Creando preferencia de checkout', { technicianId: data.technicianId, planType: data.planType });
        const response = await api.post<CreatePreferenceResponse>('/checkouts/create-preference', data);

        if (!response.data) {
            throw new Error('No se recibió respuesta del servidor');
        }

        console.log('Preferencia de checkout creada exitosamente', { preferenceId: response.data.preferenceId });
        return response.data;

    } catch (error) {
        const apiError = handleApiError(error, '/checkouts/create-preference');
        throw new Error(apiError.message);
    }
};
