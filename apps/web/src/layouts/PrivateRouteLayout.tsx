import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isTechnician } from "@/utils";

interface PrivateRouteProps {
    element: React.ReactNode;
    requiredRole?: "technician" | "user" | 'any' // Rol que se requiere para acceder
}

const roles = {
    technician: "technician",
    user: "user",
    any: "any"
} as const; // Definimos los roles como constantes para evitar errores de escritura

// Guard que valida si el usuario es un técnico

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredRole }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
    }

    if (!isAuthenticated && !user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    // Si hay un rol requerido, validamos si el usuario tiene el rol adecuado
    if (requiredRole && user) {
        if (requiredRole === roles.technician && !isTechnician(user)) {
            return <Navigate to="/not-found" />;
        }

        if (requiredRole === roles.user && isTechnician(user)) {
            return <Navigate to="/not-found" />;
        }
    }

    return <>{element}</>; // Si pasa las validaciones, renderiza el componente
};

export default PrivateRoute;
