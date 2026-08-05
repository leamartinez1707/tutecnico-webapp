import { Dispatch } from 'react'
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle, Shield } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { PasswordErrors, PasswordFormData } from '@/types';
import DevelopmentModal from '@/components/ui/DevelopmentModal';
import { useDevelopmentModal } from '@/hooks/useDevelopmentModal';
import { useNavigate } from 'react-router-dom';

export interface UserSecurityDataProps {
    isChangingPassword?: boolean;
    passwordData: PasswordFormData;
    passwordErrors: PasswordErrors;
    setIsChangingPassword: Dispatch<React.SetStateAction<boolean>>;
    setPasswordData: Dispatch<React.SetStateAction<PasswordFormData>>;
    setPasswordErrors: Dispatch<React.SetStateAction<PasswordErrors>>;
    handleChangePassword: () => Promise<void>;
}

const UserSecurityData = () => {
    const { modalConfig, openModal, closeModal, isOpen } = useDevelopmentModal();
    const navigate = useNavigate();
    return (
        <div className="space-y-8">
            {/* Cambio de contraseña */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">Cambiar contraseña</h3>
                            <p className="text-sm text-zinc-400">Mantén tu cuenta segura con una contraseña fuerte</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate('/recuperar-contrasena')}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Lock className="h-4 w-4" />
                        Cambiar
                    </Button>
                </div>


            </div>

            <Separator className="my-8" />

            {/* Zona de peligro */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-900/50 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-400">Zona de peligro</h3>
                        <p className="text-sm text-zinc-400">Acciones irreversibles en tu cuenta</p>
                    </div>
                </div>

                <Alert variant="destructive" className="border-red-900/50 bg-red-950/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-red-300">Eliminar cuenta</AlertTitle>
                    <AlertDescription className="text-red-200/80">
                        Una vez que elimines tu cuenta, no hay vuelta atrás. Todos tus datos, reservas e historial se perderán permanentemente.
                    </AlertDescription>
                </Alert>

                <Button
                    variant="destructive"
                    onClick={() => openModal('deleteAccount')}
                    className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                >
                    <AlertCircle className="h-4 w-4" />
                    Eliminar mi cuenta
                </Button>
            </div>

            {/* Modal reutilizable para funcionalidades en desarrollo */}
            {modalConfig && (
                <DevelopmentModal
                    isOpen={isOpen}
                    onClose={closeModal}
                    title={modalConfig.title}
                    description={modalConfig.description}
                    message={modalConfig.message}
                    icon={modalConfig.icon}
                    iconColor={modalConfig.iconColor}
                    bgColor={modalConfig.bgColor}
                    borderColor={modalConfig.borderColor}
                    textColor={modalConfig.textColor}
                />
            )}
        </div>
    )
}

export default UserSecurityData