import { Navigate } from "react-router-dom";
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
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated && !user) {
        return <Navigate to="/login" replace />;
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
