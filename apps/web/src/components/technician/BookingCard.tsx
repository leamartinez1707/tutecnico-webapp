import { formatDate } from "@/lib/utils"
import { Calendar, Clock, Phone, Mail, MapPin, Check, X } from "lucide-react"
import { CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Booking, BookingStatus } from "@/types"
import { useAuth } from "@/context/AuthContext"
import { useMemo } from "react"
import { useBookingStatusHandler } from "@/hooks/bookings/useBookingStatusHandler"

interface BookingCardProps {
    booking: Booking
}

const BookingCard = ({ booking }: BookingCardProps) => {

    const { user } = useAuth()

    const isTechnician = useMemo(() => {
        return user?.technician
    }, [user])

    // Determinar qué datos mostrar según el tipo de usuario
    const displayData = useMemo(() => {
        if (isTechnician) {

            return {
                name: `${booking.user.firstName} ${booking.user.lastName}`,
                phone: booking.user.phone || "Teléfono del cliente no disponible",
                email: booking.user.email || "Email del cliente no disponible",
                address: booking.user.address || "Dirección del cliente no disponible"
            }
        } else {

            return {
                name: `${booking.technician.user.firstName} ${booking.technician.user.lastName}`,
                phone: booking.technician.user.phone || "Teléfono del técnico no disponible",
                email: booking.technician.user.email || "Email del técnico no disponible",
                address: booking.technician.user.address || "Dirección del técnico no disponible"
            }
        }
    }, [isTechnician, booking])


    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case "Pendiente":
                return <Badge variant="outline" > Pendiente </Badge>
            case "Aceptado":
                return <Badge className="bg-blue-100 text-blue-800" > Aceptada </Badge>
            case "Completado":
                return <Badge className="bg-green-100 text-green-800" > Completada </Badge>
            case "Rechazado":
                return <Badge className="bg-red-100 text-red-800" > Rechazada </Badge>
        }
    }

    const { handleAcceptBooking, handleRejectBooking, handleCompleteBooking } = useBookingStatusHandler(booking, booking.id)
    return (
        <Card className="mt-5" key={booking.id}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div>
                            <CardTitle className="text-2xl">{displayData.name}</CardTitle>
                            <p className="text-lg text-muted-foreground">{booking.id}</p>
                        </div>
                    </div>
                    {getStatusBadge(booking.status as BookingStatus)}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-xl mb-8">{booking.comment}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Hora de la reserva</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {displayData.phone}
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {displayData.email}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {displayData.address}
                    </div>
                </div>

                {/* Acciones según el estado */}
                {booking.status === "Pendiente" && isTechnician && (
                    <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={handleAcceptBooking}>
                            <Check className="h-4 w-4 mr-2" />
                            Aceptar
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleRejectBooking}>
                            <X className="h-4 w-4 mr-2" />
                            Rechazar
                        </Button>
                    </div>
                )}

                {booking.status === "Aceptado" && isTechnician && (
                    <div className="flex gap-2 pt-2">
                        <Button size="sm" onClick={handleCompleteBooking}>
                            <Check className="h-4 w-4 mr-2" />
                            Marcar como completado
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default BookingCard