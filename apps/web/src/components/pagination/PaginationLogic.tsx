import { useEffect } from "react";
import PaginationButton from "./PaginationButton";
import { PaginationProps } from "./PaginationUi";

const PaginationLogic = ({ currentPage, setCurrentPage, totalPages }: PaginationProps) => {
    const pageNeighbours = 2; // Número de páginas a mostrar a cada lado de la página actual

    useEffect(() => {
        window.scrollTo({ behavior: 'smooth', top: 0 });
        // Efecto para desplazar la vista al inicio de la página cuando se cambia de página
    }, [currentPage]);

    const getPageNumbers = () => {
        const totalNumbers = pageNeighbours * 2 + 3; // Páginas vecinas + página actual + 2 extremos
        const totalBlocks = totalNumbers + 2; // Incluye botones de navegación

        if (totalPages > totalBlocks) {
            const startPage = Math.max(2, currentPage - pageNeighbours);
            const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

            const pages = [];

            // Mostrar el primer número de página
            pages.push(1);

            // Agregar "..." si el rango de páginas no incluye todas las páginas intermedias
            if (startPage > 2) {
                pages.push('...');
            }

            // Agregar las páginas intermedias
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Agregar "..." si el rango de páginas no incluye todas las páginas intermedias
            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            // Mostrar el último número de página
            pages.push(totalPages);

            return pages;
        }

        // Si el número total de páginas es menor que el número de bloques a mostrar
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    };

    const pages = getPageNumbers();

    return (
        <div className='flex justify-center my-4'>
            <PaginationButton
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            >
                Anterior
            </PaginationButton>
            {pages.map((page, index) =>
                page === '...' ? (
                    <span key={index} className='px-4 py-2 mx-1'>
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(+page)}
                        disabled={currentPage === page}
                        className={`px-4 py-2 mx-1 rounded ${currentPage === page
                            ? 'bg-gray-500 text-black'
                            : 'bg-gray-300 hover:bg-gray-500 duration-150'
                            }`}
                    >
                        {page}
                    </button>
                )
            )}
            <PaginationButton
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            >
                Siguiente
            </PaginationButton>
        </div>
    );
};

export default PaginationLogic;