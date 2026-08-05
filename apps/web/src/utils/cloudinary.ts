import { logger } from './logger';
import { deleteCloudinaryImageRequest } from '@/api/cloudinaryApi';

/**
 * Extrae el public_id de una URL de Cloudinary
 * Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234/folder/image.jpg
 * Retorna: folder/image
 */
export const getCloudinaryPublicId = (url: string): string | null => {
  try {
    // Verificar si es una URL de Cloudinary
    if (!url.includes('cloudinary.com')) {
      return null;
    }

    // Extraer el public_id de la URL
    // Formato: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{folder}/{filename}.{extension}
    const urlParts = url.split('/upload/');
    if (urlParts.length < 2) {
      return null;
    }

    // Obtener la parte después de /upload/
    let publicIdPart = urlParts[1];
    
    // Remover versión si existe (v1234567890/)
    publicIdPart = publicIdPart.replace(/^v\d+\//, '');
    
    // Remover extensión del archivo
    const lastDotIndex = publicIdPart.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      publicIdPart = publicIdPart.substring(0, lastDotIndex);
    }

    return publicIdPart;
  } catch (error) {
    logger.error('Error al extraer public_id de Cloudinary', { url, error });
    return null;
  }
};

/**
 * Elimina una imagen de Cloudinary
 * Llama al endpoint del backend que tiene las credenciales necesarias
 */
export const deleteCloudinaryImage = async (publicId: string): Promise<boolean> => {
  try {
    logger.info('Solicitud de eliminación de imagen en Cloudinary', { publicId });
    
    // Llamar al backend para eliminar la imagen
    await deleteCloudinaryImageRequest(publicId);
    
    logger.info('Imagen eliminada exitosamente de Cloudinary', { publicId });
    return true;
  } catch (error) {
    logger.error('Error al eliminar imagen de Cloudinary', { publicId, error });
    // No lanzar error para no interrumpir el flujo de actualización de foto
    return false;
  }
};

/**
 * Elimina la imagen anterior de Cloudinary cuando se sube una nueva
 */
export const deleteOldCloudinaryImage = async (oldPhotoUrl?: string): Promise<void> => {
  if (!oldPhotoUrl) {
    return;
  }

  const publicId = getCloudinaryPublicId(oldPhotoUrl);
  if (!publicId) {
    logger.warn('No se pudo extraer public_id de la URL', { oldPhotoUrl });
    return;
  }

  // Intentar eliminar la imagen anterior
  await deleteCloudinaryImage(publicId);
};
