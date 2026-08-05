import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useUsers } from "@/context/UsersContext"
import { Briefcase, Phone, Mail, Home, Edit, Save, X, ClipboardCheckIcon, PencilIcon } from "lucide-react"
import { capitalizeFirstLetter, professions } from "@/utils"
import LeafletMap from "@/components/map/LeaFlet"
import { Rating } from "@mui/material"
import { Label } from "@/components/ui/label"
import useTechnicianProfile from "@/hooks/technician/useTechnicianProfile"
import MembershipCard from "./MembershipCard"
import ProfilePhotoUpload from "@/components/ui/ProfilePhotoUpload"
import UserAvatar from "@/components/ui/UserAvatar"
import { useSpecializations } from "@/hooks/queries/useSpecializations"

const DashboardUi = memo(() => {
    const { data: specializations } = useSpecializations();
    const { updateProfilePhoto, removeProfilePhoto } = useUsers();

    const navigate = useNavigate();

    const { handleSavePersonal, handleSaveTechnical, handleAddService, handleAddSpecialization, handleRemoveService, editingPersonal, setEditingPersonal, editingTechnical, setEditingTechnical, editedUser, setEditedUser, editedTechnical, setEditedTechnical, newService, setNewService, newSpecialization, setNewSpecialization, technician } = useTechnicianProfile();

    // Si no hay datos de técnico, mostrar un mensaje
    if (!technician) {
        return (
            <div className="container mx-auto py-8 px-4 text-center">
                <h1 className="text-3xl font-semibold mb-4">Panel de Técnico</h1>
                <p className="text-xl text-black">Gestiona tu información personal y servicios.</p>
                <Card>
                    <CardContent className="py-10">
                        <p>No se encontraron datos de técnico. Por favor, contacta al administrador.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Debug logs removed to avoid noisy repeated console output

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Panel de Técnico</h1>
                    <p className="text-gray-600 text-base">Gestiona tu información profesional y servicios</p>
                </div>

                {/* Cartel de Membresía */}
                <div className="mb-6">
                    <MembershipCard
                        membershipType={technician.membershipType}
                        membershipActive={technician.membershipActive}
                        membershipExpiresAt={technician.membershipExpiresAt}
                    />
                </div>

                {/* Foto de Perfil */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-900">Foto de Perfil</CardTitle>
                        <CardDescription className="text-sm text-gray-500">
                            Sube una foto para que los clientes puedan identificarte
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <ProfilePhotoUpload
                            currentPhotoUrl={technician.profilePhotoUrl}
                            firstName={technician.firstName}
                            lastName={technician.lastName}
                            onUpload={updateProfilePhoto}
                            onRemove={removeProfilePhoto}
                        />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información Personal */}
                    <Card className={`hover:shadow-lg transition-all duration-200 ${editingPersonal ? 'bg-blue-50 border-2 border-blue-200 shadow-lg' : 'bg-white border-0 shadow-sm'}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div className="flex items-center gap-3">
                                <UserAvatar
                                    photoUrl={technician.profilePhotoUrl}
                                    fallbackBgColor={editingPersonal ? 'bg-blue-600 animate-pulse' : 'bg-gray-800'}
                                />
                                <div>
                                    <CardTitle className={`text-lg font-semibold ${editingPersonal ? 'text-blue-900' : 'text-gray-900'}`}>
                                        Información Personal {editingPersonal && <span className="text-sm font-normal">(Editando)</span>}
                                    </CardTitle>
                                    <CardDescription className={`text-sm ${editingPersonal ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {editingPersonal ? 'Modifica tus datos personales' : 'Tus datos personales'}
                                    </CardDescription>
                                </div>
                            </div>
                            {!editingPersonal ? (
                                <Button className="hover:cursor-pointer h-8 w-8" variant="ghost" size="icon" onClick={() => setEditingPersonal(true)}>
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="pt-0">
                            {!editingPersonal ? (
                                <div className="space-y-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <ClipboardCheckIcon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Nombre</div>
                                            <div className="text-sm font-medium text-gray-900 capitalize">
                                                {technician.firstName} {technician.lastName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Mail className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Email</div>
                                            <div className="text-sm font-medium text-gray-900">{technician.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Phone className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Teléfono</div>
                                            <div className="text-sm font-medium text-gray-900">{technician.phone}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <Home className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Dirección</div>
                                            <div className="text-sm font-medium text-gray-900 capitalize">{technician.address}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 bg-white rounded-lg p-4 border border-blue-200">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-blue-700 font-medium">✏️ Modo de edición activo</p>
                                        <p className="text-xs text-blue-600 mt-1">Modifica los campos que necesites y guarda los cambios</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                                <ClipboardCheckIcon className="w-4 h-4" />
                                                Nombre
                                            </label>
                                            <Input
                                                id="firstName"
                                                className="capitalize border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
                                                value={editedUser.firstName}
                                                onChange={(e: { target: { value: string } }) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                                <ClipboardCheckIcon className="w-4 h-4" />
                                                Apellido
                                            </label>
                                            <Input
                                                id="lastName"
                                                className="capitalize border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
                                                value={editedUser.lastName}
                                                onChange={(e: { target: { value: string } }) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
                                            value={editedUser.email}
                                            onChange={(e: { target: { value: string } }) => setEditedUser({ ...editedUser, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Teléfono
                                        </label>
                                        <Input
                                            id="phone"
                                            className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
                                            value={editedUser.phone}
                                            onChange={(e: { target: { value: string } }) => setEditedUser({ ...editedUser, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="address" className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                            <Home className="w-4 h-4" />
                                            Dirección
                                        </label>
                                        <Input
                                            id="address"
                                            className="capitalize border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-blue-50"
                                            value={editedUser.address}
                                            onChange={(e: { target: { value: string } }) => setEditedUser({ ...editedUser, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        {editingPersonal && (
                            <CardFooter className="flex justify-between gap-3 bg-blue-50 rounded-b-lg border-t border-blue-200 p-4">
                                <Button
                                    className="hover:cursor-pointer flex-1 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                                    variant="outline"
                                    onClick={() => {
                                        setEditedUser({ ...technician })
                                        setEditingPersonal(false)
                                    }}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancelar cambios
                                </Button>
                                <Button
                                    className="bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer flex-1 shadow-lg"
                                    onClick={handleSavePersonal}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar cambios
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Información Técnica */}
                    <Card className={`hover:shadow-lg transition-all duration-200 ${editingTechnical ? 'bg-green-50 border-2 border-green-200 shadow-lg' : 'bg-white border-0 shadow-sm'}`}>
                        <CardHeader className="flex flex-row items-center justify-between pb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${editingTechnical ? 'bg-green-600 animate-pulse' : 'bg-blue-600'}`}>
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className={`text-lg font-semibold ${editingTechnical ? 'text-green-900' : 'text-gray-900'}`}>
                                        Información Técnica {editingTechnical && <span className="text-sm font-normal">(Editando)</span>}
                                    </CardTitle>
                                    <CardDescription className={`text-sm ${editingTechnical ? 'text-green-600' : 'text-gray-500'}`}>
                                        {editingTechnical ? 'Modifica tu especialización y servicios' : 'Tu especialización y servicios'}
                                    </CardDescription>
                                </div>
                            </div>
                            {!editingTechnical ? (
                                <Button
                                    className="hover:cursor-pointer h-8 w-8"
                                    variant="ghost" size="icon" onClick={() => setEditingTechnical(true)}>
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="pt-0">
                            {!editingTechnical ? (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Briefcase className="w-3 h-3 text-blue-600" />
                                            </div>
                                            <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Especialización</span>
                                        </div>
                                        <div className="ml-8">
                                            <Badge className="bg-blue-600 text-white px-3 py-1 text-sm font-medium capitalize">
                                                {technician?.specialization}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="text-sm font-medium text-gray-700">Servicios</div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {editedTechnical.services.map(service => (
                                                <Badge key={service} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 text-sm border-0">
                                                    {capitalizeFirstLetter(service)}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                                            onClick={() => setEditingTechnical(true)}
                                        >
                                            Agregar nuevo servicio
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5 bg-white rounded-lg p-4 border border-green-200">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                        <p className="text-sm text-green-700 font-medium">🛠️ Editando información técnica</p>
                                        <p className="text-xs text-green-600 mt-1">Actualiza tu especialización y servicios disponibles</p>
                                    </div>
                                    <div className="space-y-4">
                                        <Label htmlFor="specialization" className="text-sm font-semibold text-green-800 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            Especialización Actual
                                        </Label>
                                        <Input
                                            disabled
                                            id="specialization"
                                            className="capitalize bg-green-50 border-green-300 text-green-800"
                                            value={editedTechnical.specialization}
                                        />
                                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                            <label className="text-sm font-semibold text-green-800 mb-2 block">Cambiar especialización</label>
                                            <div className="flex gap-2">
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500 capitalize"
                                                    value={newSpecialization}
                                                    onChange={(e) => setNewSpecialization(e.target.value)}
                                                >
                                                    <option disabled>
                                                        Seleccionar Especialización
                                                    </option>
                                                    {specializations?.items && specializations.items
                                                        .filter((service) => !editedTechnical.specialization.includes(service.name.toLowerCase()))
                                                        .map((service) => (
                                                            <option className="capitalize" key={service.id} value={service.name.toLowerCase()}>
                                                                {service.name}
                                                            </option>
                                                        ))}
                                                </select>
                                                <Button
                                                    className="hover:cursor-pointer bg-green-600 text-white hover:bg-green-700"
                                                    onClick={handleAddSpecialization}>
                                                    Cambiar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="bg-green-200" />
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-green-800 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4" />
                                            Servicios disponibles
                                        </label>
                                        <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {editedTechnical.services.map((service: string, index: number) => (
                                                    <Badge key={index} className="bg-green-600 text-white flex items-center gap-1 px-3 py-1">
                                                        {capitalizeFirstLetter(service)}
                                                        <button
                                                            onClick={() => handleRemoveService(index)}
                                                            className="ml-1 rounded-full hover:bg-green-500 p-0.5 hover:cursor-pointer"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <select
                                                    className="flex h-10 w-full rounded-md border border-green-300 bg-white px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
                                                    value={newService}
                                                    onChange={(e) => setNewService(e.target.value)}
                                                >
                                                    <option value="" disabled>
                                                        Seleccionar nuevo servicio
                                                    </option>
                                                    {professions
                                                        .filter((service) => !editedTechnical.services.includes(service.nombre.toLowerCase()))
                                                        .sort((a, b) => a.nombre.localeCompare(b.nombre))
                                                        .map((service) => (
                                                            <option key={service.id} value={service.nombre.toLowerCase()}>
                                                                {service.nombre}
                                                            </option>
                                                        ))}
                                                </select>
                                                <Button
                                                    className="hover:cursor-pointer bg-green-600 text-white hover:bg-green-700"
                                                    onClick={handleAddService}>
                                                    Añadir
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        {editingTechnical && (
                            <CardFooter className="flex justify-between gap-3 bg-green-50 rounded-b-lg border-t border-green-200 p-4">
                                <Button
                                    className="hover:cursor-pointer flex-1 border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                                    variant="outline"
                                    onClick={() => {
                                        setEditedTechnical({
                                            specialization: technician?.specialization || "",
                                            services: [...(technician?.services ?? [])],
                                        })
                                        setEditingTechnical(false)
                                    }}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancelar cambios
                                </Button>
                                <Button
                                    className="bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer flex-1 shadow-lg"
                                    onClick={handleSaveTechnical}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Guardar cambios
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    {/* Ubicación */}
                    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white border-0 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Ubicación</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Tus coordenadas geográficas</CardDescription>
                                </div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 mt-4">
                                <p className="text-sm text-blue-700">
                                    Modificá tus datos personales y guarda los cambios para actualizar tu dirección.
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <LeafletMap userDirection={editedUser.address} />
                        </CardContent>
                    </Card>

                    {/* Estado de la cuenta */}
                    <Card className="hover:shadow-lg transition-shadow duration-200 bg-white border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                    <ClipboardCheckIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-gray-900">Estado de la cuenta</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">Información sobre tu cuenta</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Estado de membresía</div>
                                    <Badge
                                        className={technician.membershipActive ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}
                                    >
                                        {technician.membershipActive ? "Activa" : "Inactiva"}
                                    </Badge>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-lg">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">ID de técnico</div>
                                    <div className="text-lg font-bold text-gray-900">{technician.id}</div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Nombre de usuario</div>
                                <div className="text-sm font-medium text-gray-900">{technician.username}</div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Calificación</div>
                                <div className="flex items-center gap-2">
                                    <Rating name="size-medium" readOnly value={+technician.averageRating} size="small" />
                                    <span className="text-sm text-gray-600">({+technician.averageRating}/5)</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => navigate(`/panel/tecnico/calificacion/${technician.id}`)}
                                    className="w-full hover:cursor-pointer bg-gray-800 text-white hover:bg-gray-700 h-11">
                                    <ClipboardCheckIcon className="w-4 h-4 mr-2" />
                                    Ver reseñas de clientes
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full hover:cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-50 h-11">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Cambiar contraseña
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
})

DashboardUi.displayName = 'DashboardUi';

export default DashboardUi;