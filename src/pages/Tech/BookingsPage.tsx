import Bookings from "@/components/technician/Bookings"
import SectionErrorBoundary from "@/components/Error/SectionErrorBoundary"

const BookingsPage = () => {
    return (
        <SectionErrorBoundary 
            sectionName="Reservas"
            fallbackMessage="No pudimos cargar tus reservas. Por favor, recarga la página."
        >
            <Bookings />
        </SectionErrorBoundary>
    )
}

export default BookingsPage