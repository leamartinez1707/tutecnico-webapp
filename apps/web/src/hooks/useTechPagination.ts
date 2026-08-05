import { Technicians } from "@/types";
import { useMemo, useState } from "react";

export interface useTechPaginationProps {
    filteredTechnicians: (Technicians & { distance?: number })[]
    itemsPerPage?: number;
    currentPage?: number; // Página actual desde URL
}
const useTechPagination = ({ filteredTechnicians: technicians, itemsPerPage = 10, currentPage = 1 }: useTechPaginationProps) => {
    const [techniciansOrder, setTechniciansOrder] = useState<"asc" | "desc">("asc");

    // const filteredBookings = useMemo(() => {
    //     // Filtrar las reservas según el estado activo del tab
    //     return technicians.filter(b => b.id === activeTab);
    // }, [technicians]);

    const paginatedTechnicians = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const sorted = [...technicians].sort((a, b) =>
            techniciansOrder === "asc"
                ? new Date(a.id).getTime() - new Date(b.id).getTime()
                : new Date(b.id).getTime() - new Date(a.id).getTime()
        );

        return sorted.slice(indexOfFirstItem, indexOfLastItem);
    }, [currentPage, itemsPerPage, technicians, techniciansOrder]);

    const totalPages = Math.ceil(technicians.length / itemsPerPage);
    return {
        totalPages, setTechniciansOrder, techniciansOrder, paginatedTechnicians
    }
}

export default useTechPagination