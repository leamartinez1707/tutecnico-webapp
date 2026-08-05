import { Bookings, CreateBooking, TechnicianBookingsResponse, UserBookingsResponse } from "@/types";
import api from "./axios";

export const addBookingRequest = async (booking: CreateBooking): Promise<Bookings> => {
    try {
        const { data } = await api.post<Bookings>('/bookings', booking);
        return data;
    } catch (error) {
        console.error("Error adding booking:", error);
        throw error;
    }
}

export const deleteBookingRequest = async (id: number) => {
    try {
        const { data } = await api.delete(`/bookings/${id}`);
        return data;
    } catch (error) {
        console.error("Error deleting booking:", error);
        throw error;
    }
}

export const updateBookingRequest = async (id: number, booking: CreateBooking) => {
    try {
        const { data } = await api.patch(`/bookings/${id}`, booking);
        return data;
    } catch (error) {
        console.error("Error updating booking:", error);
        throw error;
    }
}

export const getBookingsRequest = async (username: string) => {
    try {
        const { data } = await api(`/technicians/${username}/bookings`);
        if (!data || !data.items) {
            throw new Error("No hay datos en la respuesta de la API");
        }
        return data.items;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
}
export const getBookingByIdRequest = async (id: number) => {
    try {
        const { data } = await api<TechnicianBookingsResponse>(`/bookings/${id}`);
        return data.bookings;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
}


// USERS

export const getUserBookingsRequest = async (username: string) => {
    try {
        const { data } = await api<UserBookingsResponse>(`/users/${username}/bookings`);
        return data.items;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error || "Error al obtener las reservas del usuario";
    }
}