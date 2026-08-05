import { Button } from '@/components/ui/button'
import { Dispatch } from 'react';

interface BookingsOrderButtonProps {
    setBookingsOrder: Dispatch<React.SetStateAction<"asc" | "desc">>
    bookingsOrder: string;
}

const BookingsOrderButton = ({ setBookingsOrder, bookingsOrder }: BookingsOrderButtonProps) => {
    return (
        <Button
            onClick={() => setBookingsOrder(bookingsOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 my-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors w-full">
            Ordenar por antiguedad ({bookingsOrder === "asc" ? "Ascendente" : "Descendente"})
        </Button>
    )
}

export default BookingsOrderButton