import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enqueueSnackbar } from 'notistack';
import UserAvatar from '@/components/ui/UserAvatar';
import { logger } from '@/utils/logger';
import { deleteOldCloudinaryImage } from '@/utils/cloudinary';

interface ProfilePhotoUploadProps {
  currentPhotoUrl?: string;
  firstName?: string;
  lastName?: string;
  onUpload: (photoUrl: string) => Promise<void>;
  onRemove?: () => Promise<void>;
}

/**
 * Componente para subir/actualizar foto de perfil con Cloudinary
 */
const ProfilePhotoUpload = ({
  currentPhotoUrl,
  onUpload,
  onRemove
}: ProfilePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Por favor selecciona una imagen válida', { variant: 'error' });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('La imagen no debe superar los 5MB', { variant: 'error' });
      return;
    }

    setUploading(true);

    try {
      // Eliminar la foto anterior de Cloudinary antes de subir la nueva
      if (currentPhotoUrl) {
        await deleteOldCloudinaryImage(currentPhotoUrl);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'techfinder/profiles');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      const photoUrl = data.secure_url;

      logger.info('Foto de perfil subida a Cloudinary', { photoUrl });

      await onUpload(photoUrl);
      enqueueSnackbar('Foto de perfil actualizada correctamente', { variant: 'success' });
    } catch (error) {
      logger.error('Error al subir foto de perfil', error);
      enqueueSnackbar('Error al subir la foto. Intenta nuevamente', { variant: 'error' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!onRemove) return;

    setRemoving(true);
    try {
      // Eliminar la foto de Cloudinary antes de removerla de la base de datos
      if (currentPhotoUrl) {
        await deleteOldCloudinaryImage(currentPhotoUrl);
      }

      await onRemove();
      enqueueSnackbar('Foto de perfil eliminada', { variant: 'success' });
    } catch (error) {
      logger.error('Error al eliminar foto de perfil', error);
      enqueueSnackbar('Error al eliminar la foto', { variant: 'error' });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">

        <UserAvatar
          photoUrl={currentPhotoUrl}
          size="xl"
        />
        {/* Overlay con botón de cámara al hacer hover */}
        <button
          onClick={handleFileSelect}
          disabled={uploading}
          className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          onClick={handleFileSelect}
          disabled={uploading}
          variant="outline"
          size="sm"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {currentPhotoUrl ? 'Cambiar foto' : 'Subir foto'}
            </>
          )}
        </Button>

        {currentPhotoUrl && onRemove && (
          <Button
            onClick={handleRemovePhoto}
            disabled={removing || uploading}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {removing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center max-w-xs">
        JPG, PNG o GIF. Máximo 5MB. Recomendado: 400x400px
      </p>

    </div>
  );
};

export default ProfilePhotoUpload;
