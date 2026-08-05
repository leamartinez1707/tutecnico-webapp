import { useState } from 'react';
import { Booking } from '@/types';
import { Star } from 'lucide-react';
import { createReviewRequest } from '@/api/reviewsApi';
import { enqueueSnackbar } from 'notistack';
import { logger } from '@/utils/logger';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type ReviewModalProps = {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewCreated?: () => void;
}

const ReviewModal = ({ booking, isOpen, onClose, onReviewCreated }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      enqueueSnackbar('Por favor selecciona una calificación', { variant: "warning" });
      return;
    }

    if (!booking) return;

    setIsSubmitting(true);
    try {
      await createReviewRequest(
        booking.technician.id,
        booking.user.id,
        rating,
        comment
      );

      enqueueSnackbar('¡Reseña enviada con éxito!', { variant: "success" });

      if (onReviewCreated) {
        onReviewCreated();
      }

      onClose();
      setRating(0);
      setComment('');
      logger.info('Reseña creada exitosamente', { technicianId: booking.technician.id, rating });
    } catch (error) {
      logger.error('Error al enviar reseña', error);
      enqueueSnackbar('Error al enviar la reseña. Inténtalo de nuevo.', { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setRating(0);
    setComment('');
    setHoverRating(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Escribir Reseña</DialogTitle>
          {booking && (
            <DialogDescription>
              Técnico: {booking.technician.user.firstName} {booking.technician.user.lastName}
              {' · '}
              Servicio del {new Date(booking.date).toLocaleDateString()}
            </DialogDescription>
          )}
        </DialogHeader>

        {booking && (
          <div className="space-y-4">
            {/* Rating con estrellas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {rating > 0 && (
                  <>
                    {rating === 1 && 'Muy malo'}
                    {rating === 2 && 'Malo'}
                    {rating === 3 && 'Regular'}
                    {rating === 4 && 'Bueno'}
                    {rating === 5 && 'Excelente'}
                  </>
                )}
              </p>
            </div>

            {/* Comentario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comentario (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos sobre tu experiencia con este técnico..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/500 caracteres
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <DialogClose asChild>
            <button
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </DialogClose>
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || rating === 0}
            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
