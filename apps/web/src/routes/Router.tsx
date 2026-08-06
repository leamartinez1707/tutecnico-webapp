import { FC, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import PrivateRoute from "@/layouts/PrivateRouteLayout";
import { authPaths, publicPaths, technicianPaths, userPaths } from "./routesConfig";
import PageWrapper from "@/components/motion/PageWrapper";
import { AnimatePresence } from "motion/react"

const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFound = lazy(() => import("@/pages/NotFoundPage"));
const AuthPage = lazy(() => import("@/pages/AuthPage"));
const OAuthCallbackPage = lazy(() => import("@/pages/Auth/OAuthCallbackPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const ResetPasswordPage = lazy(() => import("@/pages/Auth/PasswordReset"));

// Payment pages
const PaymentSuccessPage = lazy(() => import("@/pages/Payment/PaymentSuccessPage"));
const PaymentFailurePage = lazy(() => import("@/pages/Payment/PaymentFailurePage"));
const PaymentPendingPage = lazy(() => import("@/pages/Payment/PaymentPendingPage"));

// User pages 
const ProfilePage = lazy(() => import("@/pages/User/ProfilePage"));
const FavoritesPage = lazy(() => import("@/pages/User/NewFavoritePage"));
const UserBookingsPage = lazy(() => import("@/pages/User/BookingsPage"));

// Dashboard page (accessible to both users and technicians)
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));

// Technician pages
const BookingsPage = lazy(() => import("@/pages/Tech/BookingsPage"));
const RatingPage = lazy(() => import("@/pages/Tech/RatingPage"));

// Rutas comunes
const publicRoutes = [
    { path: publicPaths.home, element: <HomePage />, index: true },
    { path: publicPaths.contact, element: <ContactPage /> },
    { path: publicPaths.passwordReset, element: <ResetPasswordPage /> },
    { path: publicPaths.paymentSuccess, element: <PaymentSuccessPage /> },
    { path: publicPaths.paymentFailure, element: <PaymentFailurePage /> },
    { path: publicPaths.paymentPending, element: <PaymentPendingPage /> },
    { path: publicPaths.notFound, element: <NotFound /> },
    { path: userPaths.map, element: <DashboardPage /> },
    { path: userPaths.technicianRating, element: <RatingPage /> }, // Perfil público de técnico
];

// Rutas de autenticación
const authRoutes = [
    { path: authPaths.login, element: <AuthPage /> },
    { path: authPaths.register, element: <AuthPage /> },
    { path: authPaths.googleAuth, element: <OAuthCallbackPage /> },
];

// Rutas privadas
const userRoutes = [
    { path: userPaths.profile, element: <ProfilePage /> },
    { path: userPaths.favorites, element: <FavoritesPage /> },
    { path: userPaths.bookings, element: <UserBookingsPage /> },
];

// Rutas para técnicos
const technicianRoutes = [
    { path: technicianPaths.rating, element: <RatingPage /> },
    { path: technicianPaths.bookings, element: <BookingsPage /> },
    { path: technicianPaths.dashboard, element: <DashboardPage /> },
];

const Router: FC = () => {
    const { isAuthenticated, user, isLoading } = useAuth();

    const location = useLocation();

    // Esperar a que el auth check termine antes de decidir rutas
    if (isLoading) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
    }

    // Evita redirigir en rutas privadas como /panel
    const isOnPublicPage = location.pathname === '/login' || location.pathname === '/register';

    if (isAuthenticated && isOnPublicPage) {
        // LOG: Estado de autenticación y localStorage
        console.log('[Router] Usuario autenticado:', user);
        const pendingTechnician = typeof window !== 'undefined' ? localStorage.getItem('pendingBookingTechnician') : null;
        console.log('[Router] pendingBookingTechnician en localStorage:', pendingTechnician);
        // Si el usuario es técnico, ignorar la reserva pendiente
        if (user?.technician) {
            if (pendingTechnician) localStorage.removeItem('pendingBookingTechnician');
            console.log('[Router] Redirigiendo a /panel/tecnico');
            return <Navigate to="/panel/tecnico" replace />;
        }
        if (pendingTechnician) {
            console.log('[Router] Redirigiendo a /tecnico/detalle/' + pendingTechnician + '?reserva=1');
            return <Navigate to={`/tecnico/detalle/${pendingTechnician}?reserva=1`} replace />;
        }
        // Preservar ruta de retorno desde PrivateRoute
        const returnTo = (location.state as { from?: string })?.from;
        if (returnTo && returnTo !== '/login' && returnTo !== '/register') {
            console.log('[Router] Redirigiendo a ruta de retorno:', returnTo);
            return <Navigate to={returnTo} replace />;
        }
        console.log('[Router] Redirigiendo a /mapa');
        return <Navigate to="/mapa" replace />;
    }

    return (

        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Rutas de autenticacion */}
                <Route element={<MainLayout />}>
                    {authRoutes.map(({ path, element }) => (
                        <Route key={path} path={path} element={<PageWrapper>{element}</PageWrapper>} />
                    ))}

                    {/* Rutas comunes */}

                    {/* Rutas publicas */}
                    {publicRoutes.map(({ path, element }) => (
                        <Route key={path} path={path} element={<PageWrapper>{element}</PageWrapper>} />
                    ))}
                    {/* Rutas del usuario */}
                    {userRoutes.map(({ path, element }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<PageWrapper><PrivateRoute element={element} requiredRole="user" /></PageWrapper>}
                        />
                    ))}
                    {/* Rutas del tecnico */}
                    {technicianRoutes.map(({ path, element }) => (
                        <Route
                            key={path}
                            path={path}
                            element={<PageWrapper><PrivateRoute element={element} requiredRole="technician" /></PageWrapper>}
                        />
                    ))}
                </Route>

                {/* Ruta 404 */}
                <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
            </Routes>
        </AnimatePresence>

    );
};

export default Router;
