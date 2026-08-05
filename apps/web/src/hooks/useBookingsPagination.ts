// hooks/useBookingsPagination.ts
import { Booking, BookingStatus } from "@/types";
import { useMemo, useState } from "react";

interface UseBookingsPaginationProps {
    bookings: Booking[];
    itemsPerPage?: number;
}

export function useBookingsPagination({ bookings, itemsPerPage = 5 }: UseBookingsPaginationProps) {

    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<BookingStatus>("Pendiente");
    const [bookingsOrder, setBookingsOrder] = useState<"asc" | "desc">("asc");

    const filteredBookings = useMemo(() => {
        // Filtrar las reservas según el estado activo del tab
        if (!Array.isArray(bookings)) {
            return [];
        }
        return bookings.filter(b => b.status === activeTab);
    }, [bookings, activeTab]);

    const paginatedBookings = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;

        const sorted = [...filteredBookings].sort((a, b) =>
            bookingsOrder === "asc"
                ? new Date(a.id).getTime() - new Date(b.id).getTime()
                : new Date(b.id).getTime() - new Date(a.id).getTime()
        );

        return sorted.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredBookings, currentPage, bookingsOrder, itemsPerPage]);

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    const bookingCounts = useMemo(() => {
        return {
            Pendiente: bookings.filter(b => b.status === "Pendiente").length,
            Aceptado: bookings.filter(b => b.status === "Aceptado").length,
            Completado: bookings.filter(b => b.status === "Completado").length,
            Rechazado: bookings.filter(b => b.status === "Rechazado").length,
        };
    }, [bookings]);

    const handleTabChange = (value: string) => {
        if (["Pendiente", "Aceptado", "Completado", "Rechazado"].includes(value)) {
            setActiveTab(value as BookingStatus);
            setCurrentPage(1); // Reiniciar a la primera página cuando cambias de tab
        }
    };

    return {
        currentPage,
        setCurrentPage,
        activeTab,
        handleTabChange,
        bookingsOrder,
        setBookingsOrder,
        paginatedBookings,
        totalPages,
        bookingCounts
    };
}
