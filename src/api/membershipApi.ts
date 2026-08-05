import api from "./axios";
import { logger } from "@/utils/logger";
import { handleApiError } from "@/utils/errorHandler";

export interface PaymentProof {
    membershipType: 'TRIAL' | 'PAID';
    transactionReference: string;
    transactionDate: string;
    amount: number;
    bankAccount: string;
}

/**
 * Envía el comprobante de pago para renovar/activar suscripción
 */
export const submitPaymentProof = async (technicianId: number, proofData: PaymentProof) => {
    try {
        logger.info('Enviando comprobante de pago', { technicianId, membershipType: proofData.membershipType });
        
        const { data } = await api.post(`/technicians/${technicianId}/membership/proof`, proofData);
        
        logger.info('Comprobante enviado exitosamente', { technicianId });
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${technicianId}/membership/proof`);
        throw new Error(apiError.message);
    }
};

/**
 * Obtiene el historial de pagos del técnico
 */
export const getPaymentHistory = async (technicianId: number) => {
    try {
        const { data } = await api.get(`/technicians/${technicianId}/membership/history`);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${technicianId}/membership/history`);
        throw new Error(apiError.message);
    }
};

/**
 * Obtiene el estado actual de la membresía
 */
export const getMembershipStatus = async (technicianId: number) => {
    try {
        const { data } = await api.get(`/technicians/${technicianId}/membership/status`);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${technicianId}/membership/status`);
        throw new Error(apiError.message);
    }
};
