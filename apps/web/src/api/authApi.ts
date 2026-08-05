import { isAxiosError } from "axios";
import type { SignIn, SignUp, SignUpUser } from "../types";
import api from "./axios";
import { logger } from "../utils/logger";

export const signUpRequest = async (formData: SignUp) => {
    try {
        const { data } = await api.post('technicians', formData)
        if (!data) {
            throw new Error('No hay datos en la respuesta de registro')
        }
        return data
    } catch (error) {
        logger.apiError('/technicians', error);
        if (isAxiosError(error)) {
            return error.response?.data.message ?? 'Error al registrar el usuario'
        }
        if (error instanceof Error) {
            throw new Error(error.message[0] || 'Error al registrar el técnico')
        } else {
            throw new Error('Error desconocido al registrar el técnico')
        }
    }

}

export const signUpUserRequest = async (formData: SignUpUser) => {
    const { data } = await api.post('users', formData)
    if (!data) {
        throw new Error('No hay datos en la respuesta de registro')
    }
    return data
}

export const signInRequest = async (formData: SignIn) => {
    try {
        const { data } = await api.post('/auth/login', formData)
        return data;
    } catch (error) {
        logger.apiError('/auth/login', error);
        if (error instanceof Error) {
            throw new Error(error.message[0] || 'Error al iniciar sesión')
        } else {
            throw new Error('Error desconocido al iniciar sesión')
        }
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
        logger.apiError('/auth/reset-password', error);
        throw new Error('Error al restablecer la contraseña');
    }
}
export const confirmNewPasswordRequest = async (token: string, newPassword: string) => {
    try {
        await api.post('/auth/reset-password', { token, newPassword });
        return true;
    } catch (error) {
        logger.apiError('/auth/reset-password', error);
        throw new Error('Error al restablecer la contraseña');
    }
}

export const googleAuthRequest = async () => {
    try {
        const response = await api.get('/auth/google');
        console.log(response);
        return true;
    } catch (error) {
        logger.error('auth/google', error);
        throw new Error('Error al autenticar con Google');
    }
}

