/**
 * Hook para obtener técnicos con React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getTechniciansRequest } from '@/api/techApi';
import { queryKeys } from '@/lib/queryClient';
import { logger } from '@/utils/logger';

export const useTechnicians = () => {
    return useQuery({
        queryKey: queryKeys.technicians.lists(),
        queryFn: async () => {
            logger.debug('Cargando técnicos desde API');
            return await getTechniciansRequest();
        },
        placeholderData: [],
    });
};
