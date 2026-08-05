import { Review } from "@/types";
import { handleApiError } from "@/utils";
import api from "./axios";



export const getTechnicianReviewsByUsernameRequest = async (username: string): Promise<Review[]> => {
    try {
        const response = await api(`/technicians/${username}/reviews`);
        console.log(response)
        return response.data.items || [];
    } catch (error) {
        const apiError = handleApiError(error, `/technicians/${username}/reviews`);
        console.error("Error fetching technician reviews:", apiError.message);
        return [];
    }
}


export const getUserReviewsByUsernameRequest = async (username: string) => {
    try {
        const response = await api(`/users/${username}/reviews`);
        return response.data.items || [];
    } catch (error) {
        const apiError = handleApiError(error, `/users/${username}/reviews`);
        throw new Error(apiError.message);
    }
}

export const getAllReviewsRequest = async (): Promise<Review[]> => {
    try {
        const response = await api(`/reviews`);
        return response.data.items || [];
    } catch (error) {
        const apiError = handleApiError(error, '/reviews');
        throw new Error(apiError.message);
    }
}

export const createReviewRequest = async (technicianId: number, userId: number, rating: number, comment: string): Promise<Review> => {
    try {
        const response = await api.post(`/reviews`, {
            technician: technicianId,
            user: userId,
            rating,
            date: new Date().toISOString(),
            comment: comment.trim()
        });
        return response.data;
    } catch (error) {
        const apiError = handleApiError(error, '/reviews');
        throw new Error(apiError.message);
    }
}