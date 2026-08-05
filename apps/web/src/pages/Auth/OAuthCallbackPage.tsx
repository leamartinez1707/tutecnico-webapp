
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { enqueueSnackbar } from "notistack";

const OAuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setErrors } = useAuth();

    useEffect(() => {
        const access_token = searchParams.get("access_token");
        const refresh_token = searchParams.get("refresh_token");
        if (!access_token || !refresh_token) {
            enqueueSnackbar("Tokens de autenticación no encontrados", { variant: "error" });
            setErrors(["Tokens de autenticación no encontrados"]);
            navigate("/login");
            return;
        }
        // Guardar tokens
        Cookies.set("access_token", access_token);
        Cookies.set("refresh_token", refresh_token);

        // Navegar a la página principal (el AuthContext se encargará de cargar el usuario)
        navigate("/perfil", { replace: true });
    }, [searchParams, navigate, setErrors]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <span className="text-lg text-zinc-700">Procesando autenticación...</span>
        </div>
    );
};

export default OAuthCallbackPage;
