import api from "./axios";
import { logger } from "@/utils/logger";

/**
 * Elimina una imagen de Cloudinary a través del backend
 * @param publicId - El public_id de la imagen en Cloudinary (ej: "techfinder/profiles/abc123")
 */
export const deleteCloudinaryImageRequest = async (publicId: string): Promise<void> => {
    try {
        await api.delete('/cloudinary/images', {
            data: { publicId }
        });
        logger.info('Imagen eliminada de Cloudinary', { publicId });
    } catch (error) {
        logger.error('Error al eliminar imagen de Cloudinary', { publicId, error });
        throw error;
    }
};
