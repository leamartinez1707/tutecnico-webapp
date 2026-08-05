import { useUpdateBooking } from "@/hooks"
import { Booking } from "@/types"
import { enqueueSnackbar } from "notistack"

export const useBookingStatusHandler = (booking: Booking, bookingId: number) => {

    const updateBookingMutation = useUpdateBooking()

    const handleAcceptBooking = async () => {
        try {
            await updateBookingMutation.mutateAsync({ 
                id: bookingId, 
                booking: { 
                    date: booking.date,
                    comment: booking.comment,
                    status: "Aceptado" as const,
                    user: booking.user.id,
                    technician: booking.technician.id
                }
            })
            enqueueSnackbar("Reserva aceptada", {
                variant: "success",
                autoHideDuration: 3000,
            })
        } catch (error) {
            console.error("Error al aceptar la reserva:", error)
            enqueueSnackbar("Error al aceptar la reserva", {
                variant: "error",
                autoHideDuration: 3000,
            })
        }
    }

    const handleRejectBooking = async () => {
        try {
            await updateBookingMutation.mutateAsync({ 
                id: bookingId, 
                booking: { 
                    date: booking.date,
                    comment: booking.comment,
                    status: "Rechazado" as const,
                    user: booking.user.id,
                    technician: booking.technician.id
                }
            })
            enqueueSnackbar("Reserva rechazada con éxito", {
                variant: "success",
                autoHideDuration: 3000,
            })
        } catch (error) {
            console.error("Error al rechazar la reserva:", error)
            enqueueSnackbar("Error al rechazar la reserva", {
                variant: "error",
                autoHideDuration: 3000,
            })
        }
    }
    const handleCompleteBooking = async () => {
        try {
            await updateBookingMutation.mutateAsync({ 
                id: bookingId, 
                booking: { 
                    date: booking.date,
                    comment: booking.comment,
                    status: "Completado" as const,
                    user: booking.user.id,
                    technician: booking.technician.id
                }
            })
            enqueueSnackbar("Reserva completada", {
                variant: "success",
                autoHideDuration: 3000,
            })

        } catch (error) {
            console.error("Error al completar la reserva:", error)
            enqueueSnackbar("Error al completar la reserva", {
                variant: "error",
                autoHideDuration: 3000,
            })
        }
    }

    return {
        handleAcceptBooking,
        handleRejectBooking,
        handleCompleteBooking,
    }
}