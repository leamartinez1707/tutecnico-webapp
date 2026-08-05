import { useState, useMemo } from "react"
import { useAuth } from "@/context/AuthContext"
import { useUserReviews } from "@/hooks"
import { Badge } from "@/components/ui/badge"
import { Booking, BookingStatus, Review } from "@/types"
import ReviewModal from "./ReviewModal"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import BookingRow from "./BookingRow"
import BookingSelected from "./BookingSelected"
import { enqueueSnackbar } from "notistack"

interface BookingsTableProps {
    bookings: Booking[]
}

const BookingsTable = ({ bookings }: BookingsTableProps) => {
    const { user } = useAuth()
    const { data: userReviews = [], refetch: refetchReviews } = useUserReviews(user?.username || '');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [reviewBooking, setReviewBooking] = useState<Booking | null>(null)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

    // Memorizar las reseñas del usuario - userReviews ya contiene solo las reseñas que escribió este usuario
    const alreadyReviewed = useMemo(() => {
        return userReviews;
    }, [userReviews]);

    const isTechnician = user?.technician

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking)
    }

    const closeModal = () => {
        setSelectedBooking(null)
    }

    const handleWriteReview = (booking: Booking) => {
        // Verificar si ya existe una reseña para este técnico específico
        const existingReview = alreadyReviewed.find(
            (review: Review) => review.technician.id === booking.technician.id
        );
        
        if (existingReview) {
            return enqueueSnackbar("Ya has escrito una reseña para este técnico.", { variant: 'info' });
        }
        
        setReviewBooking(booking)
        setIsReviewModalOpen(true)
    }

    const closeReviewModal = () => {
        setIsReviewModalOpen(false)
        setReviewBooking(null)
    }

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case "Pendiente":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pendiente</Badge>
            case "Aceptado":
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Aceptada</Badge>
            case "Completado":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completada</Badge>
            case "Rechazado":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rechazada</Badge>
        }
    }



    return (
        <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <TableHead className="font-semibold text-gray-700 py-4 w-[5%]">ID</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 w-[18%]">
                                {isTechnician ? "Cliente" : "Técnico"}
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 w-[14%]">Fecha</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 w-[22%]">Comentario</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 w-[16%]">Dirección</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 w-[10%]">Estado</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-4 text-center w-[15%]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <BookingRow
                                key={booking.id}
                                booking={booking}
                                handleViewDetails={handleViewDetails}
                                handleWriteReview={handleWriteReview}
                                getStatusBadge={getStatusBadge}
                                alreadyReviewed={alreadyReviewed}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal de detalle — Radix Dialog, always rendered */}
            <BookingSelected
                selectedBooking={selectedBooking}
                isOpen={!!selectedBooking}
                closeModal={closeModal}
                handleWriteReview={handleWriteReview}
                getStatusBadge={getStatusBadge}
                alreadyReviewed={alreadyReviewed}
                isTechnician={isTechnician}
            />

            {/* Modal de reseña — Radix Dialog, always rendered */}
            <ReviewModal
                booking={reviewBooking}
                isOpen={isReviewModalOpen}
                onClose={closeReviewModal}
                onReviewCreated={refetchReviews}
            />
        </div>
    )
}

export default BookingsTable