import { Dispatch, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactFormData, LoggedUser } from '@/types'
import { Edit, X, Save, Mail, Phone, MapPin } from 'lucide-react';
import { uruguayanPhoneRegex } from '@/schemas/user-schema';
import { cn } from '@/lib/utils';

export interface UserContactDataProps {
    isEditingContact: boolean;
    user: LoggedUser | null;
    editedContact: ContactFormData;
    setIsEditingContact: Dispatch<React.SetStateAction<boolean>>;
    setEditedContact: Dispatch<React.SetStateAction<ContactFormData>>;
    handleSaveContact: () => Promise<void>;
}

const UserContactData = ({ editedContact, handleSaveContact, isEditingContact, setEditedContact, setIsEditingContact, user }: UserContactDataProps) => {
    // Estados para validación
    const [phoneError, setPhoneError] = useState('');
    const [addressError, setAddressError] = useState('');

    // Validar teléfono en tiempo real
    const handlePhoneChange = (value: string) => {
        setEditedContact({ ...editedContact, phone: value });
        
        if (value.length > 0 && !uruguayanPhoneRegex.test(value)) {
            setPhoneError('Formato inválido. Ej: 099 123 456');
        } else {
            setPhoneError('');
        }
    };

    // Manejar cambio de dirección
    const handleAddressChange = (value: string) => {
        setEditedContact({ ...editedContact, address: value });
        
        if (value.length > 0 && value.length < 8) {
            setAddressError('La dirección debe tener al menos 8 caracteres');
        } else {
            setAddressError('');
        }
    };

    // Resetear errores al cancelar edición
    const handleCancelEdit = () => {
        setEditedContact({
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
        });
        setIsEditingContact(false);
        setPhoneError('');
        setAddressError('');
    };

    return (
        <div className="space-y-6">
            {/* Header con botón */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Tu información de contacto actualizada</p>
                <div className="flex gap-2">
                    {!isEditingContact ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsEditingContact(true)}
                            className="flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleCancelEdit}
                                className="flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={handleSaveContact}
                                className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {!isEditingContact ? (
                /* Vista de solo lectura */
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <Mail className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Correo electrónico</p>
                                <p className="text-base text-gray-900 font-medium break-all">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <Phone className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                <p className="text-base text-gray-900 font-medium">
                                    {user?.phone || 'No especificado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <MapPin className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-500">Dirección</p>
                                <p className="text-base text-gray-900">
                                    {user?.address || 'No especificada'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Vista de edición */
                <div className="grid gap-6 md:grid-cols-1">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={editedContact.email}
                                onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                                className="mt-1"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Teléfono <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={editedContact.phone}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    className={cn(
                                        "mt-1",
                                        phoneError && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    placeholder="099 123 456"
                                />
                                {phoneError && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-3 h-3" />
                                        {phoneError}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Formatos: 099123456 o 099 123 456
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                                    Dirección <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={editedContact.address}
                                    onChange={(e) => handleAddressChange(e.target.value)}
                                    className={cn(
                                        "mt-1",
                                        addressError && "border-red-500 focus-visible:ring-red-500"
                                    )}
                                    placeholder="Ej: 18 de Julio 1234"
                                />
                                {addressError && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                        <X className="w-3 h-3" />
                                        {addressError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserContactData