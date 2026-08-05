// TODO: Desacoplar el estado del formulario para que no dependa del padre y evitar re-render innecesario.
//       Usar estado local o contexto específico para el modal de reserva.
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CreateBooking } from '@/types'
import { Textarea } from '../ui/textarea'
import { DialogFooter } from '../ui/dialog'


type FormBookingProps = {
    handleAddBooking: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
    setBookingData: React.Dispatch<React.SetStateAction<CreateBooking | null>>
    setAddBookingModal: React.Dispatch<React.SetStateAction<boolean>>
}

import React from 'react';

function FormBooking({ handleAddBooking, setBookingData, setAddBookingModal }: FormBookingProps) {
    return (
        <DialogFooter>
            <form
                onSubmit={(e) => handleAddBooking(e)}
                className="space-y-4 max-w-sm w-full mx-auto">
                <Label
                    aria-label="Descripción del problema"
                    htmlFor="problemDescription"
                >
                    Descripción del problema, cuanto más detalles mejor.
                </Label>
                <Textarea
                    className='min-h-30'
                    placeholder="Describe el problema que necesitas resolver..."
                    id="problemDescription"
                    aria-label="Descripción del problema"
                    minLength={10}
                    maxLength={200}
                    required
                    onChange={(e) => setBookingData(prev => ({ ...prev!, comment: e.target.value }))}
                />
                <Label
                    aria-label="Fecha preferida para la reserva"
                    htmlFor="dateOfBooking"
                >
                    Que día estás disponible para la reserva?
                </Label>
                <Input
                    id="dateOfBooking"
                    type="date"
                    aria-label="Fecha de la reserva"
                    placeholder="Fecha preferida"
                    required
                    className='bg-zinc-800 text-white border-zinc-700 focus:border-blue-500 focus:ring-blue-500'
                    onChange={(e) => setBookingData(prev => ({ ...prev!, date: e.target.value }))}
                />
                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 transition-colors duration-200 text-light">
                    Enviar reserva
                </Button>
                <Button type="button" className="w-full bg-red-500 hover:bg-red-600 duration-200 transition-colors text-light" onClick={() => setAddBookingModal(false)}>
                    Cancelar
                </Button>
            </form>
        </DialogFooter>
    );
}

export default React.memo(FormBooking);