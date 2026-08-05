import { useAuth } from "@/context/AuthContext"
import { useUsers } from "@/context/UsersContext"
import BasicInformation from "@/components/user/profile/BasicInformation"
import UserData from "@/components/user/profile/UserData"
import { useEditProfile } from "@/hooks/useEditUserProfile"
import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import { AlertCircle } from "lucide-react"

const ProfilePage = () => {
  const { user, checkProfileCompletion } = useAuth()
  const { updateUserData } = useUsers()
  const [showCompletionAlert, setShowCompletionAlert] = useState(false)

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

      // Verificar si necesita completar el perfil
      const isComplete = checkProfileCompletion(user);
      setShowCompletionAlert(!isComplete);
      
      // Mostrar aviso si falta dirección o teléfono (solo una vez)
      if (!isComplete && !sessionStorage.getItem('profile_warning_shown')) {
        enqueueSnackbar("Por favor completa tu dirección y teléfono para finalizar el registro.", { 
          variant: "warning",
          autoHideDuration: 6000
        });
        sessionStorage.setItem('profile_warning_shown', 'true');
      }
    }
  }, [user, setEditedPersonal, setEditedContact, checkProfileCompletion])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-7xl">
        {/* Header mejorado */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tu Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal</p>
        </div>

        {/* Alerta de perfil incompleto */}
        {showCompletionAlert && (
          <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Completa tu perfil</h3>
                <p className="text-sm text-amber-800">
                  Para poder reservar servicios necesitas completar tu <strong>dirección</strong> y <strong>teléfono</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

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

