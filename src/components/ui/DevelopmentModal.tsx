import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MessageCircle, ExternalLink, LucideIcon } from 'lucide-react';

interface DevelopmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    message: string;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
}

const DevelopmentModal = ({
    isOpen,
    onClose,
    title,
    description,
    message,
    icon: Icon,
    iconColor,
    bgColor,
    borderColor,
    textColor
}: DevelopmentModalProps) => {
    const handleWhatsAppContact = () => {
        window.open('https://wa.me/59895220063', '_blank');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className={`flex items-center gap-2 ${textColor}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
                        <p className={`text-sm ${textColor}`}>
                            {message}
                        </p>
                    </div>
                    <div className="flex items-center justify-center">
                        <Button
                            onClick={handleWhatsAppContact}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 w-full"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Contactar por WhatsApp
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="w-full"
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DevelopmentModal;