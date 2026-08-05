import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useBookingStatusHandler } from '@/hooks/bookings/useBookingStatusHandler'
import { Booking, BookingStatus, Review } from '@/types'
import { TableCell, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { formatDate } from '@/lib/utils'
import { isTechnician } from '@/utils'
import { Phone, Calendar, MapPin, Eye, Star, Check, X, Trash } from 'lucide-react'
import { useDeleteBooking } from '@/hooks'
import { enqueueSnackbar } from 'notistack'
import { logger } from '@/utils/logger'
import WhatsAppButton from '../ui/WhatsAppButton'


interface Props {
    booking: Booking
    handleViewDetails: (booking: Booking) => void
    handleWriteReview: (booking: Booking) => void
    getStatusBadge: (status: BookingStatus) => React.JSX.Element
    alreadyReviewed: Review[]
}
const BookingRow = ({ booking, handleViewDetails, handleWriteReview, getStatusBadge, alreadyReviewed }: Props) => {
    const { user } = useAuth();

    const userIsTechnician = isTechnician(user!);

    const { handleAcceptBooking, handleRejectBooking, handleCompleteBooking } = useBookingStatusHandler(booking, booking.id);
    const deleteBookingMutation = useDeleteBooking();

    const handleDeleteBooking = async (id: number) => {
        try {
            await deleteBookingMutation.mutateAsync(id);
            enqueueSnackbar("Reserva cancelada con éxito", { variant: "success" });
        } catch (error) {
            logger.error('Error al eliminar reserva', error);
            enqueueSnackbar("Error al cancelar la reserva", { variant: "error" });
        }
    }

    const displayData = userIsTechnician
        ? {
            name: booking.user?.firstName && booking.user?.lastName
                ? `${booking.user.firstName} ${booking.user.lastName}`
                : booking.user?.username || 'Cliente sin nombre',
            phone: booking.user?.phone || "N/A",
            address: booking.user?.address || "N/A"
        }
        : {
            name: booking.technician?.user?.firstName && booking.technician?.user?.lastName
                ? `${booking.technician.user.firstName} ${booking.technician.user.lastName}`
                : booking.technician?.user?.username || 'Técnico sin nombre',
            address: booking.technician?.user?.address || "N/A"
        }

    const showActions = userIsTechnician && (booking.status === "Pendiente" || booking.status === "Aceptado")

    const technicianIsReviewed = alreadyReviewed.some(review =>
        review.technician.id === booking.technician.id);
    return (
        <TableRow className="hover:bg-gray-50 transition-colors">
            <TableCell className="font-medium text-gray-900">#{booking.id}</TableCell>
            <TableCell>
                <div className="space-y-1">
                    <div className="font-medium text-gray-900">{displayData.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                        {displayData.phone && (
                            <>
                                <Phone className="h-3 w-3" />
                                {displayData.phone}
                            </>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    {formatDate(booking.date)}
                </div>
            </TableCell>
            <TableCell>
                <div className="max-w-xs">
                    <p className="text-sm text-gray-700 truncate" title={booking.comment}>
                        {booking.comment}
                    </p>
                </div>
            </TableCell>
            <TableCell>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="truncate max-w-[120px]" title={displayData.address}>
                        {displayData.address}
                    </span>
                </div>
            </TableCell>
            <TableCell>{getStatusBadge(booking.status as BookingStatus)}</TableCell>
            <TableCell>
                <div className="flex gap-1">
                    {/* Botón Ver Detalles */}
                    <button
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            handleViewDetails(booking);
                        }}
                        className="h-8 px-2 text-blue-600 border border-blue-200 hover:bg-blue-50 rounded text-sm flex items-center justify-center"
                        title="Ver detalles"
                    >
                        <Eye className="h-3 w-3" />
                    </button>

                    {booking.status === "Pendiente" && (
                        <button
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                handleDeleteBooking(booking.id);
                            }}
                            className="h-8 px-2 text-red-600 border border-red-200 hover:bg-red-50 rounded text-sm flex items-center justify-center"
                            title="Borrar reserva"
                        >
                            <Trash className="h-3 w-3" />
                        </button>
                    )}

                    {/* Botón de WhatsApp - Solo visible cuando está Aceptado o Completado */}
                    {(booking.status === "Aceptado" || booking.status === "Completado") && displayData.phone && (
                        <WhatsAppButton
                            phoneNumber={displayData.phone}
                            userName={displayData.name}
                            message={userIsTechnician
                                ? `Hola ${displayData.name}, soy ${user?.firstName}. Te contacto por la reserva #${booking.id} del ${formatDate(booking.date)}.`
                                : `Hola ${displayData.name}, soy ${user?.firstName}. Te contacto por la reserva #${booking.id} del ${formatDate(booking.date)}.`
                            }
                        />
                    )}

                    {/* Botón Escribir Reseña o indicador de reseña existente */}
                    {!userIsTechnician && booking.status === "Completado" && (
                        <>
                            {technicianIsReviewed ? (
                                <button
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleViewDetails(booking);
                                    }}
                                    className="h-8 px-2 text-green-600 border border-green-200 bg-green-50 rounded text-sm flex items-center justify-center gap-1"
                                    title="Ver tu reseña"
                                >
                                    <Star className="h-3 w-3 fill-green-600" />
                                </button>
                            ) : (
                                <button
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        handleWriteReview(booking);
                                    }}
                                    className="h-8 px-2 text-yellow-600 border border-yellow-200 hover:bg-yellow-50 rounded text-sm flex items-center justify-center"
                                    title="Escribir reseña"
                                >
                                    <Star className="h-3 w-3" />
                                </button>
                            )}
                        </>
                    )}

                    {/* Acciones de técnico */}
                    {showActions && (
                        <>
                            {booking.status === "Pendiente" && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleAcceptBooking}
                                        className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                        title="Aceptar"
                                    >
                                        <Check className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleRejectBooking}
                                        className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                        title="Rechazar"
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </>
                            )}
                            {booking.status === "Aceptado" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCompleteBooking}
                                    className="h-8 px-2 text-green-600 border-green-200 hover:bg-green-50"
                                    title="Completar"
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}

export default BookingRow