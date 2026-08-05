import api from "./axios";

export const updateUserDataRequest = async (id: number, profileData: object) => {
    try {
        const { data } = await api.patch(`/users/${id}`, profileData);
        return data;
    } catch (error) {
        console.error("Error updating user data:", error);
        throw error;
    }
}

export const updateProfilePhotoRequest = async (userId: number, photoUrl: string) => {
    try {
        const { data } = await api.patch(`/users/${userId}`, { profilePhotoUrl: photoUrl });
        console.log("Updated user profile photo:", data);
        return data;
    } catch (error) {
        console.error("Error al actualizar la foto de perfil", error);
        throw error;
    }
}

export const removeProfilePhotoRequest = async (userId: number) => {
    try {
        const { data } = await api.patch(`/users/${userId}`, { profilePhotoUrl: null });
        return data;
    } catch (error) {
        console.error("Error removing profile photo:", error);
        throw error;
    }
}
