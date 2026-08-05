import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import {
    Menu, X, MapPin, Home, Search,
    ContactIcon, User, Star, LayoutDashboard, Calendar
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { authPaths, publicPaths, userPaths, technicianPaths } from "@/routes/routesConfig";
import { isTechnician } from "@/utils";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth();

    // Detectar si estamos en la landing page
    const isLandingPage = location.pathname === publicPaths.home;

    // Items de navegación para la landing
    const landingNavItems = [
        { label: "Inicio", href: "#hero" },
        { label: "Buscar técnico", href: "#search" },
        { label: "Cómo funciona", href: "#how-it-works" },
        { label: "Características", href: "#features" },
        { label: "Precios", href: "#pricing" },
    ];

    // Items de navegación para usuarios autenticados
    const userNavItems = [
        { label: "Inicio", path: publicPaths.home, icon: Home },
        { label: "Buscar", path: userPaths.map, icon: Search },
        { label: "Perfil", path: userPaths.profile, icon: User },
        { label: "Reservas", path: userPaths.bookings, icon: Calendar },
        { label: "Favoritos", path: userPaths.favorites, icon: Star },
        { label: "Contacto", path: publicPaths.contact, icon: ContactIcon },
    ];

    const technicianNavItems = [
        { label: "Inicio", path: publicPaths.home, icon: Home },
        { label: "Mapa", path: userPaths.map, icon: MapPin },
        { label: "Panel", path: technicianPaths.dashboard, icon: LayoutDashboard },
        { label: "Reservas", path: technicianPaths.bookings, icon: Calendar },
        { label: "Contacto", path: publicPaths.contact, icon: ContactIcon },
    ];

    const publicNavItems = [
        { label: "Inicio", path: publicPaths.home, icon: MapPin },
        { label: "Buscar técnico", path: userPaths.map },
        { label: "Contacto", path: publicPaths.contact },
    ];

    // Determinar qué items mostrar
    const getNavigationItems = () => {
        if (isAuthenticated && user) {
            // Usuario autenticado: siempre muestra sus menús personales
            return isTechnician(user) ? technicianNavItems : userNavItems;
        } else if (isLandingPage) {
            // No autenticado en landing: muestra scroll sections
            return landingNavItems;
        } else {
            // No autenticado en otras páginas: muestra menú público
            return publicNavItems;
        }
    };

    const navigationItems = getNavigationItems();
    const isScrollNavigation = !isAuthenticated && isLandingPage;

    const scrollToSection = (href: string) => {
        setIsMenuOpen(false);

        // Si no estamos en la landing, navegar primero
        if (!isLandingPage) {
            navigate(publicPaths.home);
            // Esperar a que se monte la página antes de hacer scroll
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } else {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const handleNavigation = (path: string) => {
        setIsMenuOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
        navigate(publicPaths.home);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50"
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate(publicPaths.home)}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <img
                            className="w-40"
                            src="/logo_servyfix.svg"
                            alt="Logo ServyFix"
                            style={{ filter: "invert(1) brightness(2)" }}
                        />
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8">
                        {isScrollNavigation ? (
                            // Navegación de scroll en landing (solo no autenticados)
                            navigationItems.map((item: any, index: number) => (
                                <motion.button
                                    key={item.href}
                                    onClick={() => scrollToSection(item.href)}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-zinc-400 hover:text-white transition-colors relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-emerald-600 group-hover:w-full transition-all duration-300" />
                                </motion.button>
                            ))
                        ) : isAuthenticated && user ? (
                            // Navegación para usuarios autenticados (con iconos)
                            navigationItems.map((item: any, index: number) => (
                                <motion.button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`flex items-center gap-2 transition-colors relative group ${location.pathname === item.path
                                        ? 'text-blue-400'
                                        : 'text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                    {location.pathname === item.path && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-blue-600 to-emerald-600" />
                                    )}
                                </motion.button>
                            ))
                        ) : (
                            // Navegación pública (no autenticado, no landing)
                            navigationItems.map((item: any, index: number) => (
                                <motion.button
                                    key={item.path}
                                    onClick={() => handleNavigation(item.path)}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-zinc-400 hover:text-white transition-colors relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-blue-600 to-emerald-600 group-hover:w-full transition-all duration-300" />
                                </motion.button>
                            ))
                        )}
                    </div>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden lg:flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    Cerrar sesión
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate(authPaths.login)}
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    Iniciar Sesión
                                </Button>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={() => navigate(authPaths.register)}
                                        className="bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg shadow-blue-600/20"
                                    >
                                        Registrate
                                    </Button>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden text-zinc-400 hover:text-white transition-colors p-2"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 space-y-4">
                            {isScrollNavigation ? (
                                // Menú móvil para landing (solo no autenticados)
                                navigationItems.map((item: any, index: number) => (
                                    <motion.button
                                        key={item.href}
                                        onClick={() => scrollToSection(item.href)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="block w-full text-left text-zinc-400 hover:text-white transition-colors py-2"
                                    >
                                        {item.label}
                                    </motion.button>
                                ))
                            ) : isAuthenticated && user ? (
                                // Menú móvil para usuarios autenticados
                                navigationItems.map((item: any, index: number) => (
                                    <motion.button
                                        key={item.path}
                                        onClick={() => handleNavigation(item.path)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className={`flex items-center gap-2 w-full text-left transition-colors py-2 ${location.pathname === item.path
                                            ? 'text-blue-400'
                                            : 'text-zinc-400 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </motion.button>
                                ))
                            ) : (
                                // Menú móvil público
                                navigationItems.map((item: any, index: number) => (
                                    <motion.button
                                        key={item.path}
                                        onClick={() => handleNavigation(item.path)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="block w-full text-left text-zinc-400 hover:text-white transition-colors py-2"
                                    >
                                        {item.label}
                                    </motion.button>
                                ))
                            )}

                            <div className="pt-4 space-y-3 border-t border-zinc-800/50">
                                {isAuthenticated && user ? (
                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full border-zinc-700 hover:bg-zinc-800 text-red-400"
                                    >
                                        Cerrar sesión
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                navigate(authPaths.login);
                                            }}
                                            className="w-full text-white border-zinc-700 hover:bg-zinc-800"
                                        >
                                            Iniciar Sesión
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                navigate(authPaths.register);
                                            }}
                                            className="w-full bg-linear-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
                                        >
                                            Registrate
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
