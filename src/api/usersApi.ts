import { handleApiError } from "@/utils";
import api from "./axios";

export const updateUserDataRequest = async (id: number, profileData: object) => {
    try {
        const { data } = await api.patch(`/users/${id}`, profileData);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/users/${id}`);
        throw new Error(apiError.message);
    }
}

export const updateProfilePhotoRequest = async (userId: number, photoUrl: string) => {
    try {
        const { data } = await api.patch(`/users/${userId}`, { profilePhotoUrl: photoUrl });
        console.log("Updated user profile photo:", data);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/users/${userId}`);
        throw new Error(apiError.message);
    }
}

export const removeProfilePhotoRequest = async (userId: number) => {
    try {
        const { data } = await api.patch(`/users/${userId}`, { profilePhotoUrl: null });
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/users/${userId}`);
        throw new Error(apiError.message);
    }
}
