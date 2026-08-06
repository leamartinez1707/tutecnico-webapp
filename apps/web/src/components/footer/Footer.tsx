import { motion } from "motion/react";
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appInfo } from "@/const/appInfo";
import { publicPaths, authPaths, userPaths } from "@/routes/routesConfig";

export function Footer() {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();

    return (
        <footer className="relative bg-zinc-950 border-t border-zinc-800">
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            style={{ filter: "invert(1) brightness(2)" }}
                            loading="lazy" src="/logo_servyfix.svg" alt="TuTecnico Logo" className="w-40 mb-4" />
                        <p className="text-zinc-400 mb-6">
                            Conectando técnicos profesionales con clientes en todo Uruguay.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Linkedin, href: "#" },
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center justify-center transition-colors"
                                >
                                    <social.icon className="h-5 w-5 text-zinc-400 hover:text-white transition-colors" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* For Users */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="text-white mb-4">Para Usuarios</h3>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => navigate(userPaths.map)}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Ver Mapa
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        navigate(publicPaths.home);
                                        setTimeout(() => {
                                            document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cómo Funciona
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        navigate(publicPaths.home);
                                        setTimeout(() => {
                                            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Características
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate(publicPaths.contact)}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Contacto
                                </button>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-white mb-4">Para Técnicos</h3>
                        <ul className="space-y-3">
                            <li>
                                <button
                                    onClick={() => navigate(authPaths.register)}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Registrarse
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        navigate(publicPaths.home);
                                        setTimeout(() => {
                                            document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Planes y Precios
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        navigate(publicPaths.home);
                                        setTimeout(() => {
                                            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Beneficios
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate(publicPaths.contact)}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    Centro de Ayuda
                                </button>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3 className="text-white mb-4">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href={`mailto:${appInfo.email}`}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    {appInfo.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                                <a
                                    href={`tel:${appInfo.phoneNumber}`}
                                    className="text-zinc-400 hover:text-white transition-colors"
                                >
                                    {appInfo.phoneNumber}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                                <span className="text-zinc-400">
                                    Montevideo, Uruguay
                                </span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="pt-8 border-t border-zinc-800"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-zinc-400 text-sm">
                            © {currentYear} {appInfo.name}. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a
                                href="#"
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                Privacidad
                            </a>
                            <a
                                href="#"
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                Cookies
                            </a>
                            <a
                                href="#"
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                Legal
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
