import { capitalizeFirstLetter } from '@/utils'
import PaginationUi from '@/components/pagination/PaginationUi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from 'lucide-react'
import { Booking } from '@/types'
import BookingsTable from './BookingsTable'
import RateLimitWarning from '@/components/ui/RateLimitWarning'

interface BookingsListProps {
    activeTab: string;
    handleTabChange: (value: string) => void;
    bookingCounts: {
        Pendiente: number;
        Aceptado: number;
        Completado: number;
        Rechazado: number;
    };
    paginatedBookings: Booking[]
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const BookingsList = ({ activeTab, handleTabChange, bookingCounts, paginatedBookings, currentPage, totalPages, setCurrentPage }: BookingsListProps) => {
    return (
        <section className="space-y-6">
            {/* Rate Limit Warning para bookings */}
            <RateLimitWarning endpoint="/bookings" />
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 md:gap-0 h-auto md:h-10 p-1 bg-gray-100 rounded-md">
                    <TabsTrigger
                        value="Pendiente"
                        className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
                    >
                        <span className="hidden sm:inline">Pendientes</span>
                        <span className="sm:hidden">Pend.</span>
                        <span className="ml-1 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                            {bookingCounts.Pendiente}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="Aceptado"
                        className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
                    >
                        <span className="hidden sm:inline">Aceptadas</span>
                        <span className="sm:hidden">Acep.</span>
                        <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                            {bookingCounts.Aceptado}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="Completado"
                        className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
                    >
                        <span className="hidden sm:inline">Completadas</span>
                        <span className="sm:hidden">Comp.</span>
                        <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                            {bookingCounts.Completado}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="Rechazado"
                        className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2"
                    >
                        <span className="hidden sm:inline">Rechazadas</span>
                        <span className="sm:hidden">Rech.</span>
                        <span className="ml-1 text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                            {bookingCounts.Rechazado}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-8">
                    {paginatedBookings.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No tienes reservas {activeTab.toLowerCase()}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Las nuevas solicitudes con estado <span className="font-medium">{capitalizeFirstLetter(activeTab.toLowerCase())}</span> aparecerán aquí.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <BookingsTable bookings={paginatedBookings} />
                            {totalPages > 1 && (
                                <PaginationUi
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    setCurrentPage={setCurrentPage}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </section>
    )
}

export default BookingsList