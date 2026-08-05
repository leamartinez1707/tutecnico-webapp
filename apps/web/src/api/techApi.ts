import { isAxiosError } from "axios";
import api from "./axios";
import { EditLocationData, EditProfileData, EditTechnicalData, Technicians } from "@/types";
import { GetTechniciansResponse } from "./technician/technicianResponse-interface";
import { logger } from "@/utils";

export const getTechniciansRequest = async () => {
    const limit = 1000;
    const { data } = await api<GetTechniciansResponse>(`/technicians?page=1&limit=${limit}&sort=id&order=DESC&membershipActive=true`);
    if (!data || !data.items) {
        throw new Error('Error al obtener los técnicos desde la API');
    }
    logger.debug(`Obtenidos ${data.items.length} técnicos desde la API`);
    return data.items;
};

export const getTechDataRequest = async (username: string) => {
    try {
        const { data } = await api(`/technicians/${username}`);
        if (!data) {
            throw new Error('No hay datos en la respuesta de la API');
        }
        return data as Technicians;
    } catch (error) {
        console.log(error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
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
        console.log(error)
        if (isAxiosError(error) && error.message) {
            throw new Error(error.message);
        }
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
        console.log(error)
        if (isAxiosError(error) && error.message) {
            throw new Error(error.message);
        }
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
        console.log(error)
        if (isAxiosError(error) && error.message) {
            throw new Error(error.message);
        }
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
        console.log(error)
        if (isAxiosError(error) && error.message) {
            throw new Error(error.message);
        }
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
        console.error("Error updating technician profile photo:", error);
        if (isAxiosError(error) && error.message) {
            throw new Error(error.message);
        }
        throw error;
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
        console.error("Error removing technician profile photo:", error);
        if (isAxiosError(error) && error.message) {
            throw new Error(error.message);
        }
        throw error;
    }
}