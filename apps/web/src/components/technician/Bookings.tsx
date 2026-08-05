import BookingsList from "@/components/bookings/BookingsList"
import BookingsOrderButton from "../bookings/BookingsOrderButton"
import { useBookingsPagination } from "@/hooks/useBookingsPagination"
import { Button } from "../ui/button"
import { useTechnicianBookings } from "@/hooks"
import { useEffect } from "react"

const TechnicianBookings = () => {
    const { data: bookings = [], isLoading, refetch } = useTechnicianBookings();

    const { activeTab, bookingCounts, bookingsOrder, currentPage, handleTabChange, paginatedBookings, setBookingsOrder, setCurrentPage, totalPages } = useBookingsPagination({ bookings });

    // Restablece la página actual a 1 cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-3 text-gray-900">Mis Reservas</h1>
                <p className="text-gray-600 text-base leading-relaxed">
                    Desde aquí podrás administrar todas tus reservas. Cambia entre las pestañas para ver las reservas según su estado.
                </p>
            </div>

            {/* Guía de funcionamiento */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    <span className="text-xl">ℹ️</span>
                    ¿Cómo funciona?
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                    Guía rápida para gestionar tus reservas de manera eficiente
                </p>

                <div className="space-y-3">
                    {/* Pendiente */}
                    <div className="flex items-start gap-3">
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full shrink-0">
                            Pendiente
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Puedes aceptar o cancelar una reserva.
                        </p>
                    </div>

                    {/* Aceptada */}
                    <div className="flex items-start gap-3">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full shrink-0">
                            Aceptada
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Puedes marcar como completada una reserva. Solo hazlo cuando finalices el servicio.
                        </p>
                    </div>

                    {/* Completada */}
                    <div className="flex items-start gap-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full shrink-0">
                            Completada
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Puedes aceptar o cancelar una reserva.
                        </p>
                    </div>

                    {/* Rechazada */}
                    <div className="flex items-start gap-3">
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full shrink-0">
                            Rechazada
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Puedes ver las reservas que has rechazado.
                        </p>
                    </div>
                </div>

                {/* Importante */}
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-amber-600 font-semibold text-sm shrink-0">⚠️ Importante:</span>
                        <p className="text-sm text-amber-900">
                            Asegúrate de que tu cliente acepte el servicio como completado para que tu pago sea realizado.
                        </p>
                    </div>
                </div>

                {/* Ordenamiento y recarga */}
                <div className="mt-5 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                        Puedes cambiar el orden de las reservas por fecha de creación, haciendo click en el botón de orden.
                    </p>
                </div>
            </div>

            {/* Controles de acción */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
                <BookingsOrderButton
                    bookingsOrder={bookingsOrder}
                    setBookingsOrder={setBookingsOrder}
                />
                <Button
                    onClick={() => refetch()}
                    variant="outline"
                    disabled={isLoading}
                    className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {isLoading ? 'Cargando...' : 'Recargar reservas'}
                </Button>
            </div>

            {/* Lista de reservas */}
            <BookingsList
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                bookingCounts={bookingCounts}
                paginatedBookings={paginatedBookings}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    )
}
export default TechnicianBookings
