import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import './TechnicianModal.css';
import { Technicians } from '@/types';
import { useReviewsByTechnician } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { averageRating } from '@/lib/utils';
import FavoriteIcon from '../user/FavoriteIcon';
import UserAvatar from '../ui/UserAvatar';
import {
  Star,
  MapPin,
  Calendar,
  Clock,
  X,
  BadgeCheck,
  MessageCircle,
  User2Icon
} from 'lucide-react';

type TechnicianModalProps = {
  tech: (Technicians & { distance?: number }) | null;
  isOpen: boolean;
  onClose: () => void;
  setAddBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const TechnicianModal = ({ tech, isOpen, onClose, setAddBookingModal }: TechnicianModalProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const { data: allReviews = [] } = useReviewsByTechnician(tech?.username);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!tech) return null;

  const reviews = allReviews.length > 0 ? allReviews.filter(review => review.technician.id === tech.id) : [];
  const rating = averageRating(reviews);

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    onClose();
    setAddBookingModal(true);
  };

  const handleViewReviews = () => {
    onClose();
    navigate(`/tecnico/detalle/${tech.username}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="tech-modal-content w-full max-w-md mx-auto p-0 gap-0 rounded overflow-hidden bg-white shadow-2xl border-0 max-h-[90vh] sm:max-h-none sm:rounded-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-300 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
        {/* Header with close button */}
        <DialogTitle className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="size-5 text-black" />
          </button>

          {/* Profile Image */}
          <div className="relative h-32 sm:h-38 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <UserAvatar
              photoUrl={tech.profilePhotoUrl}
              size="xl"
              className="ring-4 ring-white shadow-lg"
            />
          </div>
        </DialogTitle>
        <DialogDescription className="sr-only">
          Perfil de {tech.firstName} {tech.lastName} — especialista en {tech.specialization}
        </DialogDescription>

        {/* Content */}
        <div className="modal-content px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)] sm:max-h-none">
          {/* Basic Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mt-4">
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {tech.firstName} {tech.lastName}
              </h2>
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1 text-blue-600 font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="capitalize text-sm">{tech.specialization}</span>
              </div>
              {rating >= 4.5 && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Top Rated
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm">
              {tech.services?.length > 0 ? tech.services.map(service => service.charAt(0).toUpperCase() + service.slice(1)).join(', ') : 'Servicios no disponibles'}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold text-gray-900">
                {rating > 0 ? rating.toFixed(1) : 'No calculado'}
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              ({reviews?.length || 0} reseñas)
            </span>
            <div className="flex items-center gap-1 text-gray-500 text-sm ml-2">
              <MapPin className="w-4 h-4" />
              <span>{tech.distance ? `${tech.distance.toString().substring(0, 4)} km` : 'Distancia no disponible'}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'info'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Información
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'reviews'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Reseñas ({reviews?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'info' ? (
              <div className="space-y-3">
                {/* Experience */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Experiencia</p>
                    <p className="font-medium text-gray-900">Técnico verificado</p>
                  </div>
                </div>

                {/* Distance */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Distancia</p>
                    <p className="font-medium text-gray-900">
                      {tech.distance ? `${tech.distance.toString().substring(0, 4)} km de tu ubicación` : 'Distancia no disponible'}
                    </p>
                    <p className='font-thin'>{tech.address}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="max-h-40 overflow-y-auto space-y-3">
                  {reviews?.length > 0 ? (
                    reviews.slice(0, 3).map((review) => {
                      const reviewDate = new Date(review.date);
                      const isValidDate = !isNaN(reviewDate.getTime());
                      const formattedDate = isValidDate
                        ? reviewDate.toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                        : 'Fecha no disponible';

                      return (
                        <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-medium text-gray-700">
                                {review.user?.firstName} {review.user?.lastName || ''}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formattedDate}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            {review.comment && review.comment.trim() !== ''
                              ? review.comment
                              : <span className="italic text-gray-500">Sin comentario</span>
                            }
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="font-medium">No hay reseñas aún</p>
                      <p className="text-xs mt-1">Sé el primero en dejar una reseña</p>
                    </div>
                  )}
                </div>

                {/* Enlace para ver todas las reseñas si hay más de 3 */}
                {reviews?.length > 3 && (
                  <div className="text-center pt-2 border-t border-gray-100">
                    <button
                      onClick={handleViewReviews}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Ver todas las {reviews.length} reseñas
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 sticky bottom-0 bg-white">
            <Button
              onClick={handleBooking}
              className="modal-button flex-1 bg-black text-white hover:bg-gray-800 rounded h-12 font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Reservar ahora
            </Button>
            <Button
              onClick={handleViewReviews}
              variant="outline"
              className="modal-button flex-1 border-2 border-gray-200 hover:bg-gray-50 rounded h-12 font-medium"
            >
              <User2Icon className="w-4 h-4 mr-2" />
              Ver perfil y reseñas
            </Button>
          </div>

          {/* Favorite */}
          <div className="flex justify-center pt-2">
            <FavoriteIcon technicianId={tech.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianModal;