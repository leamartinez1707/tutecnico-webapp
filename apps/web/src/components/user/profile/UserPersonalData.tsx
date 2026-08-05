import { Dispatch } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoggedUser, PersonalFormData } from "@/types"
import { Edit, Save, X, User, AtSign } from "lucide-react"

export interface UserPersonalDataProps {
    isEditingPersonal: boolean;
    user: LoggedUser | null;
    editedPersonal: PersonalFormData;
    setIsEditingPersonal: Dispatch<React.SetStateAction<boolean>>;
    setEditedPersonal: Dispatch<React.SetStateAction<PersonalFormData>>;
    handleSavePersonal: () => Promise<void>;
}

const UserPersonalData = ({ isEditingPersonal, user, editedPersonal, setIsEditingPersonal, setEditedPersonal, handleSavePersonal }: UserPersonalDataProps) => {
    return (
        <div className="space-y-6">
            {/* Header con botón */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">Información básica de tu perfil</p>
                <div className="flex gap-2">
                    {!isEditingPersonal ? (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setIsEditingPersonal(true)}
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
                                    setEditedPersonal({
                                        firstName: user?.firstName || "",
                                        lastName: user?.lastName || ""
                                    });
                                    setIsEditingPersonal(false);
                                }}
                                className="flex items-center gap-2 border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </Button>
                            <Button 
                                size="sm" 
                                onClick={handleSavePersonal}
                                className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {!isEditingPersonal ? (
                /* Vista de solo lectura */
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <User className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Nombre completo</p>
                                <p className="text-base text-white font-medium">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <AtSign className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Nombre de usuario</p>
                                <p className="text-base text-white">
                                    @{user?.username}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <User className="w-5 h-5 text-zinc-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-500">Estado de cuenta</p>
                                <p className="text-base text-white">
                                    {user?.isActive ? 'Activa' : 'Inactiva'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Vista de edición */
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="firstName" className="text-sm font-medium text-zinc-300">
                                Nombre
                            </Label>
                            <Input
                                id="firstName"
                                type="text"
                                value={editedPersonal.firstName}
                                onChange={(e) => setEditedPersonal({ ...editedPersonal, firstName: e.target.value })}
                                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                placeholder="Tu nombre"
                            />
                        </div>

                        <div>
                            <Label htmlFor="lastName" className="text-sm font-medium text-zinc-300">
                                Apellido
                            </Label>
                            <Input
                                id="lastName"
                                type="text"
                                value={editedPersonal.lastName}
                                onChange={(e) => setEditedPersonal({ ...editedPersonal, lastName: e.target.value })}
                                className="mt-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                placeholder="Tu apellido"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="username" className="text-sm font-medium text-zinc-500">
                                Nombre de usuario
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={`@${user?.username}`}
                                disabled
                                className="mt-1 bg-zinc-800/50 text-zinc-500 border-zinc-700"
                            />
                            <p className="text-xs text-zinc-500 mt-1">
                                El nombre de usuario no se puede cambiar
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserPersonalData