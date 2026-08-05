import api from "./axios";
import { EditLocationData, EditProfileData, EditTechnicalData, Technicians } from "@/types";
import { GetTechniciansResponse } from "./technician/technicianResponse-interface";
import { handleApiError } from "@/utils";

export const getTechniciansRequest = async () => {
    try {
        const limit = 1000;
        const { data } = await api<GetTechniciansResponse>(`/technicians?page=1&limit=${limit}&sort=id&order=DESC&membershipActive=true`);
        if (!data || !data.items) {
            throw new Error('Error al obtener los técnicos desde la API');
        }
        console.log(`Obtenidos ${data.items.length} técnicos desde la API`);
        return data.items;
    } catch (error) {
        const apiError = handleApiError(error, '/technicians');
        throw new Error(apiError.message);
    }
};

export const getTechDataRequest = async (username: string) => {
    try {
        const { data } = await api(`/technicians/${username}`);
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        return data as Technicians;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${username}`);
        throw new Error(apiError.message);
    }
}

export const getMyDataRequest = async () => {
    try {
        const { data } = await api<Technicians>('/technicians/me');
        console.log("Fetched my data:", data);
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        return data;
    } catch (error) {
        const apiError = handleApiError(error, '/technicians/me');
        throw new Error(apiError.message);
    }
}

export const updateProfileDataRequest = async (id: number, userData: EditProfileData) => {
    try {
        const { data } = await api.put(`/technicians/${id}`, userData);
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${id}`);
        throw new Error(apiError.message);
    }
}

export const updateTechnicalDataRequest = async (id: number, userData: EditTechnicalData) => {
    try {
        const { data } = await api.put(`/technicians/${id}`, userData);
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${id}`);
        throw new Error(apiError.message);
    }
}

export const updateLocationDataRequest = async (id: number, userData: EditLocationData) => {
    try {
        const { data } = await api.put(`/technicians/${id}`, userData);
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${id}`);
        throw new Error(apiError.message);
    }
}

export const updateTechnicianProfilePhotoRequest = async (technicianId: number, photoUrl: string) => {
    try {
        const { data } = await api.put(`/technicians/${technicianId}`, { profilePhotoUrl: photoUrl });
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        console.log("Updated technician profile photo:", data);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${technicianId}`);
        throw new Error(apiError.message);
    }
}

export const removeTechnicianProfilePhotoRequest = async (technicianId: number) => {
    try {
        const { data } = await api.put(`/technicians/${technicianId}`, { profilePhotoUrl: null });
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${technicianId}`);
        throw new Error(apiError.message);
    }
}