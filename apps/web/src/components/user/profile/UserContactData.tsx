import { Dispatch } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContactFormData, LoggedUser } from '@/types'
import { Edit, X, Save, Mail, Phone, MapPin } from 'lucide-react';

export interface UserContactDataProps {
    isEditingContact: boolean;
    user: LoggedUser | null;
    editedContact: ContactFormData;
    setIsEditingContact: Dispatch<React.SetStateAction<boolean>>;
    setEditedContact: Dispatch<React.SetStateAction<ContactFormData>>;
    handleSaveContact: () => Promise<void>;
}

const UserContactData = ({ editedContact, handleSaveContact, isEditingContact, setEditedContact, setIsEditingContact, user }: UserContactDataProps) => {
    return (
        <div className="space-y-6">
            {/* Header con botón */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Tu información de contacto actualizada</p>
                <div className="flex gap-2">
                    {!isEditingContact ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsEditingContact(true)}
                            className="flex items-center gap-2 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                        >
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
                    ) : (
                        <>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    setEditedContact({
                                        email: user?.email || "",
                                        phone: user?.phone || "",
                                        address: user?.address || "",
                                    });
                                    setIsEditingContact(false);
                                }}
                                className="flex items-center gap-2 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
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
                                <Mail className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-zinc-500">Correo electrónico</p>
                                <p className="text-base text-white font-medium break-all">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <Phone className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Teléfono</p>
                                <p className="text-base text-white font-medium">
                                    {user?.phone || 'No especificado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <MapPin className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-zinc-500">Dirección</p>
                                <p className="text-base text-white">
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
                            <Label htmlFor="email" className="text-sm font-medium text-zinc-300">
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={editedContact.email}
                                onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium text-zinc-300">
                                    Teléfono
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={editedContact.phone}
                                    onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                                    className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                    placeholder="+598 99 123 456"
                                />
                            </div>

                            <div>
                                <Label htmlFor="address" className="text-sm font-medium text-zinc-300">
                                    Dirección
                                </Label>
                                <Input
                                    id="address"
                                    type="text"
                                    value={editedContact.address}
                                    onChange={(e) => setEditedContact({ ...editedContact, address: e.target.value })}
                                    className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                    placeholder="Tu dirección completa"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserContactData