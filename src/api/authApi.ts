import type { SignIn, SignUp, SignUpUser } from "../types";
import api from "./axios";
import { handleApiError } from "../utils/errorHandler";

export const signUpRequest = async (formData: SignUp) => {
    try {
        const { data } = await api.post('technicians', formData)
        if (!data) {
            throw new Error('No hay datos en la respuesta de registro')
        }
        return data
    } catch (error) {
        const apiError = handleApiError(error, '/technicians');
        throw new Error(apiError.message);
    }
}

export const signUpUserRequest = async (formData: SignUpUser) => {
    try {
        const { data } = await api.post('users', formData)
        if (!data) {
            throw new Error('No hay datos en la respuesta de registro')
        }
        return data
    } catch (error) {
        const apiError = handleApiError(error, '/users');
        throw new Error(apiError.message);
    }
}

export const signInRequest = async (formData: SignIn) => {
    try {
        const { data } = await api.post('/auth/login', formData)
        return data;
    } catch (error) {
        const apiError = handleApiError(error, '/auth/login');
        throw new Error(apiError.message);
    }
}

export const verifyTokenRequest = async (refresh_token: string) => {
    const { data } = await api.post('/auth/refresh', { refresh_token })
    if (!data || !data.user || !data.access_token) {
        throw new Error('No se pudo verificar el token')
    }
    return data
}

export const resetPasswordRequest = async (email: string) => {
    try {
        await api.post('/auth/request-password-reset', { email });
        return true;
    } catch (error) {
        const apiError = handleApiError(error, '/auth/request-password-reset');
        throw new Error(apiError.message);
    }
}

export const confirmNewPasswordRequest = async (token: string, newPassword: string) => {
    try {
        await api.post('/auth/reset-password', { token, newPassword });
        return true;
    } catch (error) {
        const apiError = handleApiError(error, '/auth/reset-password');
        throw new Error(apiError.message);
    }
}

export const googleAuthRequest = async () => {
    try {
        const response = await api.get('/auth/google');
        console.log(response);
        return true;
    } catch (error) {
        const apiError = handleApiError(error, '/auth/google');
        throw new Error(apiError.message);
    }
}

