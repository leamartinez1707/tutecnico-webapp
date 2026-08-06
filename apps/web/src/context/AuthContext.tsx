// src/context/AuthContext.tsx
import { createContext, ReactNode, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { signInRequest, signUpRequest, signUpUserRequest, verifyTokenRequest } from '../api/authApi';
import type { LoggedUser, SignIn, SignUp, SignUpUser, User, UserTechnician } from '../types';
import { isAxiosError } from 'axios';
import Cookies from "js-cookie";
import { logger } from '../utils/logger';
import { AnalyticsEvents } from '@/utils/analytics';
import { getTechDataRequest } from '@/api/techApi';

// Define el tipo de los datos que vas a manejar en el contexto
interface AuthContextType {
    user: LoggedUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: LoggedUser | null) => void;
    login: (user: SignIn) => Promise<boolean>;
    register: (user: SignUp | SignUpUser) => Promise<boolean>;
    logout: () => void;
    getTechProfile: (username: string) => void;
    errors: string[];
    setErrors: (errors: string[]) => void;
}

// Define los valores predeterminados del contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor de contexto
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | UserTechnician | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<string[]>([]);

    // BroadcastChannel para sincronizar entre pestañas
    useEffect(() => {
        const channel = new BroadcastChannel('auth_channel');

        channel.onmessage = (event) => {
            if (event.data.type === 'USER_UPDATE') {
                setUser(event.data.user);
                logger.info('Usuario actualizado desde otra pestaña');
            } else if (event.data.type === 'LOGOUT') {
                setUser(null);
                setIsAuthenticated(false);
                logger.info('Logout sincronizado desde otra pestaña');
            }
        };

        return () => channel.close();
    }, []);

    // Función para iniciar sesión
    const login = async (user: SignIn) => {
        setIsLoading(true);
        try {
            const data = await signInRequest({ ...user })
            if (data.statusCode === 401 || !data.user || !data.access_token || !data.refresh_token) {
                setErrors(["Error de autenticación, verifique sus credenciales"]);
                return false;
            }
            const isSecure = window.location.protocol === 'https:';
            Cookies.set("access_token", data.access_token, { secure: isSecure, sameSite: 'Lax', expires: 7 });
            Cookies.set("refresh_token", data.refresh_token, { secure: isSecure, sameSite: 'Lax', expires: 30 });
            setUser(data.user);
            setIsAuthenticated(true);
            setErrors([]); // Limpiar errores al iniciar sesión correctamente

            // Track login exitoso
            AnalyticsEvents.login(data.user.technician ? 'technician' : 'user');

            return true;
        } catch (error) {
            if (isAxiosError(error)) {
                if (error?.status === 401) {
                    setErrors(["Error de autenticación, verifique sus credenciales"]);
                } else {
                    console.log(error);
                    const message = error.response?.data?.message || "Hubo un error al iniciar sesión, intentelo de nuevo";
                    setErrors([message]);
                }
            } else {
                if (error instanceof Error) {
                    console.log(error);
                    setErrors(["Hubo un error al iniciar sesión, intentelo de nuevo"]);
                }
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (user: SignUp | SignUpUser) => {
        setIsLoading(true);
        try {
            if ('services' in user && Array.isArray(user.services)) {
                // Si tiene 'services', es un técnico
                await signUpRequest(user);

                // Notificar a otras pestañas que se registró un nuevo técnico
                const techChannel = new BroadcastChannel('technicians_channel');
                techChannel.postMessage({ type: 'TECHNICIAN_REGISTERED' });
                techChannel.close();

                logger.info('Nuevo técnico registrado');

                // Track registro de técnico
                AnalyticsEvents.signUp('technician');

                return true;
            } else {
                // Si no tiene 'services', es un usuario común
                await signUpUserRequest(user);

                // Track registro de usuario
                AnalyticsEvents.signUp('user');

                return true;
            }
        } catch (error: unknown) {
            logger.error('Error en el registro de usuario', error);
            if (isAxiosError(error)) {
                const message = error.response?.data?.message ?? 'Error al registrar el usuario';
                setErrors(Array.isArray(message) ? message : [message]);
            } else {
                setErrors(['Error al registrar el usuario']);
            }
            return false;
        }
        finally {
            setIsLoading(false);
        }
    }

    // Función para obtener el perfil de un técnico
    const getTechProfile = useCallback(async (username: string) => {
        try {
            const response = await getTechDataRequest(username);
            if (!response) return null;
            return response;
        } catch (error) {
            logger.error('Error al obtener perfil del técnico', error);
            return null;
        }
    }, []);

    // Wrapper de setUser que sincroniza entre pestañas
    const setUserAndSync = useCallback((newUser: LoggedUser | null) => {
        setUser(newUser);

        // Sincronizar con otras pestañas
        if (newUser) {
            const channel = new BroadcastChannel('auth_channel');
            channel.postMessage({ type: 'USER_UPDATE', user: newUser });
            channel.close();
        }
    }, []);

    // Función para cerrar sesión
    const logout = useCallback(() => {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);

        // Sincronizar logout con otras pestañas
        const channel = new BroadcastChannel('auth_channel');
        channel.postMessage({ type: 'LOGOUT' });
        channel.close();

        logger.info('Sesión cerrada');
    }, []);


    useEffect(() => {
        const checkLogin = async () => {
            setIsLoading(true);
            try {
                const token = Cookies.get("refresh_token");
                if (!token) {
                    setIsAuthenticated(false);
                    setUser(null);
                    return;
                }
                // Verificar el token en el backend
                const data = await verifyTokenRequest(token);
                console.log("Token verification data:", data);
                if (!data) {
                    setIsAuthenticated(false);
                    setUser(null);
                    return;
                }
                setUser(data.user);
                setIsAuthenticated(true);
            } catch (error) {
                logger.error('Error al verificar token', error);
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkLogin();
    }, []);

    // Limpiar errores automáticamente solo si hay errores, y evitar ciclo infinito
    const clearErrorTimeout = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (errors.length > 0) {
            if (clearErrorTimeout.current) {
                clearTimeout(clearErrorTimeout.current);
            }
            clearErrorTimeout.current = setTimeout(() => {
                setErrors([]);
            }, 5000);
        }
        // Cleanup al desmontar
        return () => {
            if (clearErrorTimeout.current) {
                clearTimeout(clearErrorTimeout.current);
            }
        };
    }, [errors]);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated,
            setUser: setUserAndSync,
            login,
            register,
            logout,
            getTechProfile,
            errors,
            setErrors
        }
        }>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
