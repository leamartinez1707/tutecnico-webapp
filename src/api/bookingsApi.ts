import { Bookings, CreateBooking, TechnicianBookingsResponse, UserBookingsResponse } from "@/types";
import { handleApiError } from "@/utils";
import api from "./axios";

export const addBookingRequest = async (booking: CreateBooking): Promise<Bookings> => {
    try {
        const { data } = await api.post<Bookings>('/bookings', booking);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, '/bookings');
        throw new Error(apiError.message);
    }
}

export const deleteBookingRequest = async (id: number) => {
    try {
        const { data } = await api.delete(`/bookings/${id}`);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/bookings/${id}`);
        throw new Error(apiError.message);
    }
}

export const updateBookingRequest = async (id: number, booking: CreateBooking) => {
    try {
        const { data } = await api.patch(`/bookings/${id}`, booking);
        return data;
    } catch (error) {
        const apiError = handleApiError(error, `/bookings/${id}`);
        throw new Error(apiError.message);
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
        const apiError = handleApiError(error, `/technicians/${username}/bookings`);
        throw new Error(apiError.message);
    }
}

export const getBookingByIdRequest = async (id: number) => {
    try {
        const { data } = await api<TechnicianBookingsResponse>(`/bookings/${id}`);
        return data.bookings;
    } catch (error) {
        const apiError = handleApiError(error, `/bookings/${id}`);
        throw new Error(apiError.message);
    }
}


// USERS

export const getUserBookingsRequest = async (username: string) => {
    try {
        const { data } = await api<UserBookingsResponse>(`/users/${username}/bookings`);
        return data.items;
    } catch (error) {
        const apiError = handleApiError(error, `/users/${username}/bookings`);
        throw new Error(apiError.message);
    }
}