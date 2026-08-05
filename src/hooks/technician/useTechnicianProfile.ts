import { useUsers } from "@/context/UsersContext"
import { EditProfileData } from "@/types"
import { enqueueSnackbar } from "notistack"
import { useState, useEffect, useRef } from "react"
import { useTechnicianLoggedProfile } from "../queries/useTechnicianProfile"


const useTechnicianProfile = () => {

    const { data: user } = useTechnicianLoggedProfile();
    const technician = user;

    // Estados para controlar la edición
    const [editingPersonal, setEditingPersonal] = useState(false)
    const [editingTechnical, setEditingTechnical] = useState(false)
    // Estados para almacenar los datos editados (inicializados con valores por defecto en caso de que technician sea null)
    const [editedUser, setEditedUser] = useState<EditProfileData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    })

    const [editedTechnical, setEditedTechnical] = useState({
        specialization: "",
        services: [] as string[],
    })

    // Estado para el nuevo servicio
    const [newService, setNewService] = useState("")
    const [newSpecialization, setNewSpecialization] = useState("")

    const { updateProfileData, updateTechnicalData } = useUsers()

    // Evitar re-asignar los estados de edición si el perfil no cambió realmente.
    // Algunos fetches pueden devolver un objeto nuevo (misma entidad) provocando
    // re-render innecesario si volvemos a crear nuevos objetos de estado.
    const prevTechnicianIdRef = useRef<number | string | null>(null);
    useEffect(() => {
        if (!technician) return;

        // Si el id no cambió, no reasignar estados para evitar re-renders innecesarios
        if (prevTechnicianIdRef.current === technician.id) return;

        prevTechnicianIdRef.current = technician.id ?? null;

        setEditedUser({
            firstName: technician.firstName || "",
            lastName: technician.lastName || "",
            email: technician.email || "",
            phone: technician.phone || "",
            address: technician.address || "",
        });
        setEditedTechnical({
            specialization: technician?.specialization || "",
            services: [...(technician?.services || [])],
        });
    }, [technician]); // Solo actualizar cuando cambie el objeto de perfil real

    // Manejadores para guardar cambios
    const handleSavePersonal = async () => {
        // Aquí normalmente enviarías los datos al backend
        // Por ahora solo actualizamos el estado local
        try {
            if (technician?.id === undefined) {
                enqueueSnackbar("ID de técnico no disponible", { variant: "error" })
                return
            }
            await updateProfileData(technician.id, editedUser)
            enqueueSnackbar("Datos personales actualizados", { variant: "success" })
        } catch (error) {
            console.error("Error al guardar los datos personales:", error)
            enqueueSnackbar("Error al guardar los datos personales", { variant: "error" })
        } finally {
            setEditingPersonal(false)
        }
    }

    const handleSaveTechnical = async () => {
        // Aquí normalmente enviarías los datos al backend
        try {
            if (technician?.id === undefined) {
                enqueueSnackbar("ID de técnico no disponible", { variant: "error" })
                return
            }
            await updateTechnicalData(technician.id, editedTechnical)
            enqueueSnackbar("Datos técnicos actualizados", { variant: "success" })
        } catch (error) {
            console.error("Error al guardar los datos técnicos:", error)
            enqueueSnackbar("Error al guardar los datos técnicos", { variant: "error" })

        } finally {
            setEditingTechnical(false)
        }
    }
    // Manejador para añadir un nuevo servicio
    const handleAddService = () => {
        if (newService.trim()) {
            setEditedTechnical({
                ...editedTechnical,
                services: [...editedTechnical.services, newService.trim()],
            })
            setNewService("")
        }
    }
    // Manejador para añadir una nueva especialización
    const handleAddSpecialization = () => {
        if (newSpecialization.trim()) {
            setEditedTechnical({
                ...editedTechnical,
                specialization: newSpecialization.trim(),
            })
            setNewSpecialization("")
        }
    }

    // Manejador para eliminar un servicio
    const handleRemoveService = (index: number) => {
        const updatedServices = [...editedTechnical.services]
        updatedServices.splice(index, 1)
        setEditedTechnical({
            ...editedTechnical,
            services: updatedServices,
        })
    }
    return {
        handleSavePersonal,
        handleSaveTechnical,
        handleAddService,
        handleAddSpecialization,
        handleRemoveService,
        editingPersonal,
        setEditingPersonal,
        editingTechnical,
        setEditingTechnical,
        editedUser,
        setEditedUser,
        editedTechnical,
        setEditedTechnical,
        newService,
        setNewService,
        newSpecialization,
        setNewSpecialization,
        technician,
    }
}

export default useTechnicianProfile