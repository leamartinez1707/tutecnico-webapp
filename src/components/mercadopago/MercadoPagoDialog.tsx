import { memo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import MercadoPagoModal from './MercadoPagoModal';

interface MercadoPagoDialogProps {
    isOpen: boolean;
    onClose: () => void;
    planType: 'monthly' | 'yearly';
}

const MercadoPagoDialog = memo(({ isOpen, onClose, planType }: MercadoPagoDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white">
                <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Activar Suscripción {planType === 'monthly' ? 'Mensual' : 'Anual'}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Completa tu suscripción de forma segura con Mercado Pago
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto px-6 pb-6">
                    <MercadoPagoModal planType={planType} />
                </div>
            </DialogContent>
        </Dialog>
    );
});

MercadoPagoDialog.displayName = 'MercadoPagoDialog';

export default MercadoPagoDialog;
