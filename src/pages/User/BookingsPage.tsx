import { useEffect } from 'react'
import FavoriteSkeleton from '@/components/user/favorites/FavoriteSkeleton'
import { ArrowLeft, BookIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useBookingsPagination } from '@/hooks/useBookingsPagination'
import { useUserBookings } from '@/hooks'
import BookingsOrderButton from '@/components/bookings/BookingsOrderButton'
import { Button } from '@/components/ui/button'
import BookingsList from '@/components/bookings/BookingsList'
import SectionErrorBoundary from '@/components/Error/SectionErrorBoundary'
import EmptyBookings from '@/components/user/bookings/EmptyBookings'
import RateLimitWarning from '@/components/ui/RateLimitWarning'

const BookingsPage = () => {
    const onBack = () => {
        window.history.back();
    }
    const { data: userBookings = [], isLoading, refetch: refetchBookings } = useUserBookings();
    const { activeTab, bookingCounts, bookingsOrder, currentPage, handleTabChange, paginatedBookings, setBookingsOrder, setCurrentPage, totalPages } = useBookingsPagination({ bookings: userBookings, itemsPerPage: 10 });

    console.log('User Bookings:', userBookings);
    // Restablece la página actual a 1 cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, setCurrentPage]);
    return (
        <div className="min-h-screen bg-black">
            {/* Header Section */}
            <div className="bg-linear-to-b from-zinc-900 to-black border-b border-zinc-800 pt-24 pb-8">
                <div className="container mx-auto px-4">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={onBack}
                        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
                    >
                        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Volver</span>
                    </motion.button>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto text-center mb-6"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="bg-linear-to-br from-blue-600 to-violet-600 p-4 rounded-2xl">
                                <BookIcon className="h-8 w-8 text-white fill-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl text-white mb-4">
                            Mis Reservas
                        </h1>
                        <p className="text-xl text-zinc-400">
                            Accede rápidamente a las reservas que has realizado y gestionalas rápidamente.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-6 text-sm"
                    >
                        <div className="flex items-center gap-2 text-zinc-400">
                            <BookIcon className="h-4 w-4 text-blue-400 fill-blue-400" />
                            <span>{userBookings?.length} reservas guardadas</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Mostrar skeleton */}
                {isLoading && (
                    <FavoriteSkeleton />
                )}
                {!isLoading && userBookings.length === 0 && (
                    <EmptyBookings
                        onBack={onBack}
                    />
                )}

                {userBookings.length > 0 && (
                    <>
                        <div className="flex flex-col gap-3 mt-4 sm:mt-0 items-center">
                            {/* Rate Limit Warning para bookings */}
                            <RateLimitWarning endpoint="/bookings" />
                            <BookingsOrderButton
                                bookingsOrder={bookingsOrder}
                                setBookingsOrder={setBookingsOrder}
                            />
                            <Button
                                onClick={() => refetchBookings()}
                                variant="outline"
                                className="flex items-center gap-2 w-full"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Actualizar
                            </Button>
                        </div>
                        <SectionErrorBoundary
                            sectionName="Historial de Reservas"
                            fallbackMessage="No pudimos cargar tus reservas. Por favor, recarga la página."
                        >
                            <BookingsList
                                activeTab={activeTab}
                                handleTabChange={handleTabChange}
                                bookingCounts={bookingCounts}
                                paginatedBookings={paginatedBookings}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalPages={totalPages}
                            />
                        </SectionErrorBoundary>
                    </>
                )}
            </div>
        </div>
    )
}

export default BookingsPage