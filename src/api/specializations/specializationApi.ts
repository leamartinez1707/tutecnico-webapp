import axios from "../axios"
import { Specialization, SpecializationsResponse } from "./types/specialization-interface";

export const getSpecializationsRequest = async () => {
    const { data } = await axios<SpecializationsResponse>("/services/with-professions?limit=100");
    if (!data || !data.items) {
        throw new Error('No hay datos en la respuesta de la API');
    }
    return data;
}

export const getSpecializationById = async (id: number) => {
    const { data } = await axios<Specialization>(`/services/${id}`);
    if (!data.id) {
        throw new Error('No hay datos en la respuesta de la API');
    }
    return data;
}