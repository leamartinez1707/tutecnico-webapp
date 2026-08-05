import { useAuth } from "@/context/AuthContext"
import { useUsers } from "@/context/UsersContext"
import BasicInformation from "@/components/user/profile/BasicInformation"
import UserData from "@/components/user/profile/UserData"
import { useEditProfile } from "@/hooks/useEditUserProfile"
import { useEffect } from "react"
import { enqueueSnackbar } from "notistack"

const ProfilePage = () => {
  const { user } = useAuth()
  const { updateUserData } = useUsers()

  const { isEditingPersonal, isEditingContact, editedPersonal, editedContact, setIsEditingContact, setIsEditingPersonal, setEditedPersonal, setEditedContact, handleSaveContact, handleSavePersonal } = useEditProfile({ user, updateUserData })

  // Actualizar estados de edición cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setEditedPersonal({
        firstName: user?.firstName,
        lastName: user?.lastName,
      })

      setEditedContact({
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
      })

      // Mostrar aviso si falta dirección o teléfono
      if (!user.address || !user.phone) {
        enqueueSnackbar("Por favor completa tu dirección y teléfono para finalizar el registro.", { variant: "warning" });
      }
    }
  }, [user, setEditedPersonal, setEditedContact])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-7xl">
        {/* Header mejorado */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tu Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>

        {/* Layout responsive mejorado */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Información básica - más compacta */}
          <div className="xl:col-span-1">
            <BasicInformation user={user} />
          </div>

          {/* Datos editables - más espacio */}
          <div className="xl:col-span-3">
            <UserData
              user={user}
              isEditingPersonal={isEditingPersonal}
              isEditingContact={isEditingContact}
              editedPersonal={editedPersonal}
              editedContact={editedContact}
              setIsEditingPersonal={setIsEditingPersonal}
              setIsEditingContact={setIsEditingContact}
              setEditedPersonal={setEditedPersonal}
              setEditedContact={setEditedContact}
              handleSavePersonal={handleSavePersonal}
              handleSaveContact={handleSaveContact}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;

