import { updateLocationDataRequest, updateProfileDataRequest, updateTechnicalDataRequest, updateTechnicianProfilePhotoRequest, removeTechnicianProfilePhotoRequest } from "@/api/techApi";
import type { EditLocationData, EditProfileData, EditTechnicalData } from "@/types";
import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAuth } from "./AuthContext";
import { updateUserDataRequest, updateProfilePhotoRequest, removeProfilePhotoRequest } from "@/api/usersApi";
import { logger } from "@/utils/logger";
import { isTechnician } from "@/utils";

/**
 * UsersContext refactorizado para usar React Query
 * Mantiene solo las funciones helper para actualizar el usuario en AuthContext
 * Los datos (technicians, reviews, favorites) ahora se obtienen con React Query hooks
 */

interface UsersContextType {
    // Usuarios - Funciones helper para actualizar datos en AuthContext
    updateUserData: (id: number, userData: object) => Promise<void>;
    updateProfilePhoto: (photoUrl: string) => Promise<void>;
    removeProfilePhoto: () => Promise<void>;

    // Técnicos - Funciones helper para actualizar datos en AuthContext
    updateProfileData: (id: number, profileData: EditProfileData) => Promise<void>;
    updateTechnicalData: (id: number, profileData: EditTechnicalData) => Promise<void>;
    updateLocationData: (id: number, profileData: EditLocationData) => Promise<void>;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

interface UsersProviderProps {
    children: ReactNode;
}

export const UsersProvider = ({ children }: UsersProviderProps) => {
    const { user, setUser } = useAuth();

    /**
     * Actualizar datos básicos del usuario
     */
    const updateUserData = useCallback(async (id: number, userData: object) => {
        try {
            const data = await updateUserDataRequest(id, userData);
            if (data) {
                setUser({
                    ...user,
                    ...data,
                });
            }
        } catch (error) {
            logger.error('Error al actualizar datos de usuario', error);
            throw error;
        }
    }, [user, setUser]);

    /**
     * Actualizar foto de perfil (usuarios y técnicos)
     */
    const updateProfilePhoto = useCallback(async (photoUrl: string) => {
        if (!user?.id) {
            throw new Error('Usuario no autenticado');
        }

        try {
            const isTech = isTechnician(user);
            const data = isTech 
                ? await updateTechnicianProfilePhotoRequest(user.technician!.id, photoUrl)
                : await updateProfilePhotoRequest(user.id, photoUrl);
                
            if (data) {
                if (isTech) {
                    // WORKAROUND: Backend devuelve null, usar photoUrl directamente
                    setUser({
                        ...user,
                        profilePhotoUrl: photoUrl,
                        technician: {
                            ...user.technician!,
                            ...data
                        }
                    });
                } else {
                    setUser({
                        ...user,
                        ...data
                    });
                }
                logger.info('Foto de perfil actualizada', { isTechnician: isTech });
            }
        } catch (error) {
            logger.error('Error al actualizar foto de perfil', error);
            throw error;
        }
    }, [user, setUser]);

    /**
     * Eliminar foto de perfil (usuarios y técnicos)
     */
    const removeProfilePhoto = useCallback(async () => {
        if (!user?.id) {
            throw new Error('Usuario no autenticado');
        }

        try {
            const isTech = isTechnician(user);
            const data = isTech
                ? await removeTechnicianProfilePhotoRequest(user.technician!.id)
                : await removeProfilePhotoRequest(user.id);
                
            if (data) {
                if (isTech) {
                    setUser({
                        ...user,
                        profilePhotoUrl: undefined,
                        technician: {
                            ...user.technician!,
                            ...data
                        }
                    });
                } else {
                    setUser({
                        ...user,
                        ...data
                    });
                }
                logger.info('Foto de perfil eliminada', { isTechnician: isTech });
            }
        } catch (error) {
            logger.error('Error al eliminar foto de perfil', error);
            throw error;
        }
    }, [user, setUser]);

    /**
     * Actualizar datos de perfil del técnico
     */
    const updateProfileData = useCallback(async (id: number, profileData: EditProfileData) => {
        const updatedData = await updateProfileDataRequest(id, profileData);
        setUser({
            ...user!,
            ...updatedData,
        });
    }, [user, setUser]);

    /**
     * Actualizar datos técnicos del técnico (especialización, servicios)
     */
    const updateTechnicalData = useCallback(async (id: number, profileData: EditTechnicalData) => {
        const technicianData = await updateTechnicalDataRequest(id, profileData);
        setUser({
            ...user!,
            technician: {
                id,
                specialization: technicianData.specialization,
                latitude: technicianData.latitude,
                longitude: technicianData.longitude,
                services: technicianData.services,
                membershipType: technicianData.membershipType || user?.technician?.membershipType,
                membershipActive: technicianData.membershipActive ?? user?.technician?.membershipActive,
                membershipExpiresAt: technicianData.membershipExpiresAt || user?.technician?.membershipExpiresAt,
            }
        });
    }, [user, setUser]);

    /**
     * Actualizar datos de ubicación del técnico
     */
    const updateLocationData = useCallback(async (id: number, profileData: EditLocationData) => {
        const technicianData = await updateLocationDataRequest(id, profileData);
        setUser({
            ...user!,
            address: technicianData.address,
            technician: {
                id,
                specialization: technicianData.specialization,
                latitude: technicianData.latitude,
                longitude: technicianData.longitude,
                services: technicianData.services,
                membershipType: technicianData.membershipType || user?.technician?.membershipType,
                membershipActive: technicianData.membershipActive ?? user?.technician?.membershipActive,
                membershipExpiresAt: technicianData.membershipExpiresAt || user?.technician?.membershipExpiresAt,
            }
        });
    }, [user, setUser]);

    return (
        <UsersContext.Provider
            value={{
                updateUserData,
                updateProfilePhoto,
                removeProfilePhoto,
                updateProfileData,
                updateTechnicalData,
                updateLocationData,
            }}>
            {children}
        </UsersContext.Provider>
    );
};

export const useUsers = (): UsersContextType => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('useUsers must be used within an UsersProvider');
    }
    return context;
};