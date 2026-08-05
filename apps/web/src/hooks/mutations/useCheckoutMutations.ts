/**
 * Hook para manejar el proceso de checkout con Mercado Pago
 */

import { useMutation } from '@tanstack/react-query';
import { createCheckoutPreference, type CreatePreferenceRequest } from '@/api/checkoutApi';
import { logger } from '@/utils/logger';
import { enqueueSnackbar } from 'notistack';

export const useCreateCheckout = () => {
    return useMutation({
        mutationFn: async (data: CreatePreferenceRequest) => {
            logger.debug('Iniciando proceso de checkout', data);
            return await createCheckoutPreference(data);
        },
        onSuccess: (data) => {
            logger.info('Redirigiendo a Mercado Pago', { preferenceId: data.preferenceId });
            // Redireccionar al usuario a Mercado Pago
        },
        onError: (error) => {
            logger.error('Error al crear checkout', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'No se pudo iniciar el proceso de pago. Por favor, intenta nuevamente.';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    });
};
