/**
 * Hook para obtener todas las especialidades con React Query
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';
import { getSpecializationsRequest } from '@/api/specializations/specializationApi';

export const useSpecializations = () => {

    return useQuery({
        queryKey: queryKeys.specializations.all,
        queryFn: async () => {
            logger.debug('Cargando especializaciones')
            const specializations = await getSpecializationsRequest();
            // Asegurar que siempre retornemos un array
            return specializations || [];
        },
    });
};
