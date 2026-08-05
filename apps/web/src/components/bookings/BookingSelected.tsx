import { formatDate } from '@/lib/utils'
import { Booking, BookingStatus, Review, Technician } from '@/types'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Calendar, MapPin, Phone, Star } from 'lucide-react'
import WhatsAppButton from '../ui/WhatsAppButton'

interface Props {
    selectedBooking: Booking | null
    isOpen: boolean
    closeModal: () => void
    handleWriteReview: (booking: Booking) => void
    getStatusBadge: (status: BookingStatus) => React.JSX.Element
    alreadyReviewed: Review[]
    isTechnician: Technician | undefined
}
const BookingSelected = ({ selectedBooking, closeModal, handleWriteReview, getStatusBadge, alreadyReviewed, isTechnician }: Props) => {
    if (!selectedBooking) return null;

    // Buscar la reseña existente del usuario para este técnico
    const existingReview = alreadyReviewed.find(review =>
        review.technician.id === selectedBooking.technician.id && review.user.id === selectedBooking.user.id
    );

    const technicianIsReviewed = !!existingReview;
    return (
        <Dialog open={!!selectedBooking} onOpenChange={closeModal}>
            <DialogContent className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700/60 max-w-2xl max-h-[90vh] overflow-y-auto text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Detalles de la Reserva #{selectedBooking.id}</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {isTechnician ? "Cliente" : "Técnico"}:{' '}
                        {isTechnician
                            ? (selectedBooking.user?.firstName && selectedBooking.user?.lastName
                                ? `${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`
                                : selectedBooking.user?.username || 'Cliente sin nombre')
                            : (selectedBooking.technician?.user?.firstName && selectedBooking.technician?.user?.lastName
                                ? `${selectedBooking.technician.user.firstName} ${selectedBooking.technician.user.lastName}`
                                : selectedBooking.technician?.user?.username || 'Técnico sin nombre')
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-zinc-300 mb-2">
                                {isTechnician ? "Cliente" : "Técnico"}
                            </h3>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                                <p className="font-medium text-white">
                                    {isTechnician
                                        ? (selectedBooking.user?.firstName && selectedBooking.user?.lastName
                                            ? `${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`
                                            : selectedBooking.user?.username || 'Cliente sin nombre')
                                        : (selectedBooking.technician?.user?.firstName && selectedBooking.technician?.user?.lastName
                                            ? `${selectedBooking.technician.user.firstName} ${selectedBooking.technician.user.lastName}`
                                            : selectedBooking.technician?.user?.username || 'Técnico sin nombre')
                                    }
                                </p>
                                <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                                    {isTechnician && selectedBooking.user?.phone && (
                                        <>
                                            <Phone className="h-3 w-3" />
                                            {selectedBooking.user.phone}
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-zinc-300 mb-2">Fecha y Estado</h3>
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                                <p className="flex items-center gap-1 mb-2 text-zinc-300">
                                    <Calendar className="h-4 w-4 text-zinc-500" />
                                    {formatDate(selectedBooking.date)}
                                </p>
                                {getStatusBadge(selectedBooking.status as BookingStatus)}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Dirección</h3>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="flex items-center gap-1 text-zinc-300">
                                <MapPin className="h-4 w-4 text-zinc-500" />
                                {isTechnician
                                    ? selectedBooking.user?.address || 'Sin dirección'
                                    : selectedBooking.technician?.user?.address || 'Sin dirección'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Comentario</h3>
                        <div className="bg-gray-50 p-3 rounded">
                            <p className="text-zinc-300">{selectedBooking.comment}</p>
                        </div>
                    </div>

                    {/* Sección de reseña para usuarios con servicios completados */}
                    {!isTechnician && selectedBooking.status === "Completado" && (
                        <div className="border-t pt-4">
                            {technicianIsReviewed && existingReview ? (
                                // Mostrar la reseña existente
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-zinc-300 flex items-center gap-2">
                                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                            Tu reseña para este técnico
                                        </h3>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-900/20 to-amber-900/20 border border-yellow-800/50 p-4 rounded-lg">
                                        {/* Calificación con estrellas */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-sm font-medium text-zinc-400">Calificación:</span>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-5 w-5 ${
                                                            star <= existingReview.rating
                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                : 'text-zinc-600'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm font-bold text-white">
                                                    {existingReview.rating}/5
                                                </span>
                                            </div>
                                        </div>

                                        {/* Comentario de la reseña */}
                                        {existingReview.comment && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-zinc-400 mb-1">Tu comentario:</p>
                                                <p className="text-zinc-300 bg-zinc-800 p-3 rounded-lg border border-yellow-800/50 italic">
                                                    "{existingReview.comment}"
                                                </p>
                                            </div>
                                        )}

                                        {/* Fecha de la reseña */}
                                        {existingReview.date && (
                                            <div className="mt-3 text-xs text-zinc-500">
                                                Reseña escrita el {formatDate(existingReview.date)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-2 bg-blue-900/30 border border-blue-800/50 p-3 rounded-lg">
                                        <span className="text-blue-400 mt-0.5">ℹ️</span>
                                        <p className="text-sm text-blue-300">
                                            Ya has escrito una reseña para este técnico. Las reseñas ayudan a otros usuarios a tomar mejores decisiones.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                // Botón para escribir reseña
                                <button
                                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
                                    onClick={() => handleWriteReview(selectedBooking)}
                                >
                                    <Star className="h-4 w-4" />
                                    Escribir Reseña
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    {/* Botón de WhatsApp prominente para reservas Aceptadas o Completadas */}
                    {(selectedBooking.status === "Aceptado" || selectedBooking.status === "Completado") && (
                        <WhatsAppButton
                            phoneNumber={isTechnician
                                ? selectedBooking.user?.phone || ''
                                : selectedBooking.technician?.user?.phone || ''
                            }
                            userName={isTechnician
                                ? (selectedBooking.user?.firstName && selectedBooking.user?.lastName
                                    ? `${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`
                                    : selectedBooking.user?.username || 'Cliente')
                                : (selectedBooking.technician?.user?.firstName && selectedBooking.technician?.user?.lastName
                                    ? `${selectedBooking.technician.user.firstName} ${selectedBooking.technician.user.lastName}`
                                    : selectedBooking.technician?.user?.username || 'Técnico')
                            }
                            message={isTechnician
                                ? `Hola, soy ${selectedBooking.technician?.user?.firstName}. Te contacto por la reserva #${selectedBooking.id} del ${formatDate(selectedBooking.date)}.`
                                : `Hola, soy ${selectedBooking.user?.firstName}. Te contacto por la reserva #${selectedBooking.id} del ${formatDate(selectedBooking.date)}.`
                            }
                            size="default"
                            showText={true}
                        />
                    )}
                    <DialogClose asChild>
                        <Button variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white">
                            Cerrar
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BookingSelected
