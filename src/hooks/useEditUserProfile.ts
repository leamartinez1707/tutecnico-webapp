import { useState } from "react";
import { enqueueSnackbar } from "notistack";
import { PersonalFormData, ContactFormData, PasswordFormData, PasswordErrors, LoggedUser } from "@/types"

interface UseEditProfileProps {
    user: LoggedUser | null;
    updateUserData: (id: number, userData: object) => Promise<void>
}

export function useEditProfile({ user, updateUserData }: UseEditProfileProps) {


    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [editedPersonal, setEditedPersonal] = useState<PersonalFormData>({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
    });

    const [editedContact, setEditedContact] = useState<ContactFormData>({
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
    });

    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleSavePersonal = async () => {
        try {
            if (!user?.id) return;
            const updatedFields: Partial<PersonalFormData> = {};
            if (editedPersonal.firstName !== user.firstName) {
                updatedFields.firstName = editedPersonal.firstName;
            }
            if (editedPersonal.lastName !== user.lastName) {
                updatedFields.lastName = editedPersonal.lastName;
            }
            if (Object.keys(updatedFields).length > 0) {
                await updateUserData(user.id, updatedFields);
                enqueueSnackbar("Datos personales actualizados", { variant: "success" });
            } else {
                enqueueSnackbar("No se realizaron cambios", { variant: "info" });
            }
            setIsEditingPersonal(false);
        } catch {
            enqueueSnackbar("Error al actualizar datos personales", { variant: "error" });
        }
    };

    const handleSaveContact = async () => {
        try {
            if (!user?.id) return;
            const updatedFields: Partial<ContactFormData> = {};
            if (editedContact.email !== user.email) {
                updatedFields.email = editedContact.email;
            }
            if (editedContact.phone !== user.phone) {
                updatedFields.phone = editedContact.phone;
            }
            if (editedContact.address !== user.address) {
                updatedFields.address = editedContact.address;
            }

            if (Object.keys(updatedFields).length > 0) {
                await updateUserData(user.id, updatedFields);
                enqueueSnackbar("Datos de contacto actualizados", { variant: "success" });
            } else {
                enqueueSnackbar("No se realizaron cambios", { variant: "info" });
            }
            setIsEditingContact(false);
        } catch {
            enqueueSnackbar("Error al actualizar datos de contacto", { variant: "error" });
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.currentPassword.length < 6) {
            setPasswordErrors(prev => ({ ...prev, currentPassword: "La contraseña actual es incorrecta" }));
            return;
        }
        if (passwordData.newPassword.length < 6) {
            setPasswordErrors(prev => ({ ...prev, newPassword: "La contraseña debe tener al menos 6 caracteres" }));
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }));
            return;
        }

        try {
            if (!user?.id) return;
            await updateUserData(user.id, { password: passwordData.newPassword });
            enqueueSnackbar("Contraseña actualizada correctamente", { variant: "success" });

            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setPasswordErrors({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setIsChangingPassword(false);
        } catch {
            enqueueSnackbar("Error al actualizar la contraseña", { variant: "error" });
        }
    };

    return {
        // Estados
        isEditingPersonal,
        setIsEditingPersonal,
        isEditingContact,
        setIsEditingContact,
        isChangingPassword,
        setIsChangingPassword,

        // Formularios
        editedPersonal,
        setEditedPersonal,
        editedContact,
        setEditedContact,
        passwordData,
        setPasswordData,
        passwordErrors,
        setPasswordErrors,

        // Handlers
        handleSavePersonal,
        handleSaveContact,
        handleChangePassword,
    };
}
