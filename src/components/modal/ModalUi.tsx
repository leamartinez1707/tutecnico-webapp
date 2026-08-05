import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'


interface ModalUiProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    children?: React.ReactNode;
    firstName?: string;
    lastName?: string;
}
import { CalendarCheck2, XIcon } from "lucide-react";

const ModalUi = ({ open, setOpen, children, firstName, lastName }: ModalUiProps) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full mx-auto mt-8 p-0 max-w-lg sm:max-w-xl [&>button]:hidden h-[100dvh] sm:h-auto flex items-center justify-center">
                <div className="flex flex-col gap-0 w-full bg-gradient-to-br from-zinc-900 via-black to-zinc-800/90 backdrop-blur border border-zinc-700/60 shadow-2xl shadow-blue-900/20 overflow-hidden text-white rounded-2xl p-0 sm:p-2 max-h-[95dvh] sm:max-h-[90vh] overflow-y-auto pb-6 sm:pb-4">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-700/60 px-4 py-3 bg-zinc-950/80">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center rounded-full bg-blue-600/10 p-2">
                                <CalendarCheck2 className="w-6 h-6 text-blue-500" />
                            </span>
                            <DialogHeader className="p-0 m-0">
                                <DialogTitle className="text-lg sm:text-xl font-bold ">
                                    Reservar con <span className="capitalize">{firstName}</span> <span className="capitalize">{lastName}</span>
                                </DialogTitle>
                            </DialogHeader>
                        </div>
                        <DialogClose asChild>
                            <button
                                className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform focus:outline-none"
                                aria-label="Cerrar"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </DialogClose>
                    </div>
                    {/* Descripción */}
                    <DialogDescription className="text-base text-zinc-100 mb-0 px-4 pt-4 pb-2">
                        <div className="space-y-2">
                            <div className="font-semibold text-lg sm:text-xl">Completa el formulario para enviar una reserva al técnico seleccionado.</div>
                            <div className="text-zinc-300">El día que selecciones es el día en el que crees estar disponible para que el técnico pueda atenderte.</div>
                            <div className="text-sm text-blue-200">El técnico podrá aceptar o rechazar la reserva según su disponibilidad.</div>
                            <div className="text-sm text-blue-200">Se comunicará contigo a la brevedad para coordinar los detalles.</div>
                        </div>
                    </DialogDescription>
                    {/* Formulario */}
                    <div className="rounded-lg px-4 py-4 sm:p-6 w-full bg-zinc-900/60">
                        {children}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ModalUi