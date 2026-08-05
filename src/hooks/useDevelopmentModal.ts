import { useState } from 'react';
import { Lock, AlertCircle, LucideIcon } from 'lucide-react';

export type ModalType = 'password' | 'deleteAccount';

interface ModalConfig {
    title: string;
    description: string;
    message: string;
    icon: LucideIcon;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
}

const modalConfigs: Record<ModalType, ModalConfig> = {
    password: {
        title: 'Funcionalidad en desarrollo',
        description: 'La funcionalidad de cambio de contraseña está actualmente en desarrollo.',
        message: 'Estamos trabajando en esta característica para ofrecerte la mejor experiencia. Por favor, contacta a nuestro equipo de atención al cliente para solicitar un cambio de contraseña.',
        icon: Lock,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
    },
    deleteAccount: {
        title: 'Funcionalidad en desarrollo',
        description: 'La funcionalidad de eliminación de cuenta está actualmente en desarrollo.',
        message: 'Estamos implementando un proceso seguro para la eliminación de cuentas. Si necesitas eliminar tu cuenta, por favor contacta a nuestro equipo de atención al cliente.',
        icon: AlertCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
    }
};

export const useDevelopmentModal = () => {
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);

    const openModal = (type: ModalType) => {
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    const modalConfig = activeModal ? modalConfigs[activeModal] : null;

    return {
        activeModal,
        modalConfig,
        openModal,
        closeModal,
        isOpen: activeModal !== null
    };
};

export default useDevelopmentModal;