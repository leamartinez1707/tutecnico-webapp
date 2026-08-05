
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { enqueueSnackbar } from "notistack";
import { verifyTokenRequest } from "@/api/authApi";
import { logger } from "@/utils/logger";
import Loader from "@/components/loader/Loader";

const OAuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser, setErrors } = useAuth();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                const access_token = searchParams.get("access_token");
                const refresh_token = searchParams.get("refresh_token");
                
                if (!access_token || !refresh_token) {
                    enqueueSnackbar("Tokens de autenticación no encontrados", { variant: "error" });
                    setErrors(["Tokens de autenticación no encontrados"]);
                    navigate("/login", { replace: true });
                    return;
                }
                
                // Guardar tokens
                Cookies.set("access_token", access_token);
                Cookies.set("refresh_token", refresh_token);
                
                logger.info('Tokens de OAuth guardados, verificando usuario...');
                
                // Verificar el token y cargar el usuario inmediatamente
                const data = await verifyTokenRequest(refresh_token);
                
                if (!data || !data.user) {
                    enqueueSnackbar("Error al cargar el usuario", { variant: "error" });
                    navigate("/login", { replace: true });
                    return;
                }
                
                // Actualizar el usuario en el contexto
                setUser(data.user);
                logger.info('Usuario cargado desde OAuth', { userId: data.user.id, username: data.user.username });
                
                // Verificar si es técnico
                if (data.user.technician) {
                    enqueueSnackbar('¡Bienvenido de vuelta!', { variant: 'success' });
                    navigate("/panel/tecnico", { replace: true });
                    return;
                }
                
                // Verificar si el usuario tiene dirección y teléfono
                const needsProfileCompletion = !data.user.address || !data.user.phone;
                
                if (needsProfileCompletion) {
                    enqueueSnackbar('Por favor, completa tu perfil con tu dirección y teléfono', { 
                        variant: 'info',
                        autoHideDuration: 5000
                    });
                    logger.info('Usuario necesita completar perfil', { userId: data.user.id });
                    navigate("/perfil", { replace: true });
                } else {
                    enqueueSnackbar('¡Bienvenido de vuelta!', { variant: 'success' });
                    navigate("/mapa", { replace: true });
                }
            } catch (error) {
                logger.error('Error en callback de OAuth', error);
                enqueueSnackbar("Error al procesar la autenticación", { variant: "error" });
                navigate("/login", { replace: true });
            } finally {
                setIsProcessing(false);
            }
        };
        
        handleOAuthCallback();
    }, [searchParams, navigate, setErrors, setUser]);

    if (isProcessing) {
        return <Loader />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="text-lg text-zinc-700">Procesando autenticación...</span>
        </div>
    );
};

export default OAuthCallbackPage;
