import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"
import { enqueueSnackbar } from "notistack"
import ErrorMessage from "../Error/Message"
import { LockIcon, User2, UserPlus2Icon, LogIn } from "lucide-react"
import Loader from "../loader/Loader"
import { motion } from "motion/react"
import { appInfo } from '@/const/appInfo'
import RateLimitWarning from "@/components/ui/RateLimitWarning"
import { publicPaths } from "@/routes/routesConfig"


const Login = () => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    })
    const { login, isLoading, errors, setErrors } = useAuth()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            if (!form.username || !form.password) {
                setErrors(['Por favor, complete todos los campos'])
                return;
            }
            const data = await login(form)
            if (!data) {
                enqueueSnackbar('Credenciales incorrectas', { variant: 'error' })
                return;
            }
            enqueueSnackbar('Autenticado correctamente', { variant: 'success' })
        } catch (error) {
            console.error('Error al iniciar sesión:', error)
            if (error instanceof Error) {
                enqueueSnackbar(error.message, { variant: 'error' })
            } else {
                enqueueSnackbar('Error al iniciar sesión', { variant: 'error' })
            }
        }
    }

    // La redirección post-login se maneja solo en el Router

    useEffect(() => {
        const timer = setTimeout(() => {
            setErrors([]) // Limpiar errores al cargar el componente
        }, 8000)

        return () => clearTimeout(timer)
    }, [setErrors])

    if (isLoading) return <Loader />

    const handleGoogleAuth = () => {
        // Redirige al endpoint de Google Auth del backend
        window.location.href = `${import.meta.env.VITE_API_URL}auth/google`;
    }

    return (
        <div className="relative flex flex-col w-full justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-linear-to-b from-black via-zinc-900 to-black overflow-hidden">
            {/* Animated background orbs */}
            <motion.div
                className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 rounded-2xl bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 shadow-2xl overflow-hidden w-full max-w-md mx-auto"
            >
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-600/10" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="flex flex-col items-center justify-center mb-4 sm:mb-6"
                        >
                            <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4">
                                <LogIn className="h-7 w-7 sm:h-9 sm:w-9 text-white" aria-hidden="true" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white text-center">¡Bienvenido!</h1>
                        </motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-zinc-300 text-base sm:text-lg"
                        >
                            Ingresá a tu cuenta de <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-semibold">{appInfo.name}</span>
                        </motion.p>
                    </div>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="w-full p-6 sm:p-8 space-y-6"
                >
                    {/* Rate Limit Warning */}
                    <RateLimitWarning endpoint="/auth/login" />

                    {/* Error messages */}
                    {errors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-2"
                        >
                            {errors.map((error, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ErrorMessage>{error}</ErrorMessage>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Username field */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                    >
                        <label htmlFor="username" className="block text-zinc-200 font-semibold text-sm">
                            Nombre de usuario
                        </label>
                        <div className="relative group">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 sm:w-12 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                                <User2 className="size-4 sm:size-5" aria-hidden="true" />
                            </div>
                            <input
                                aria-label="Nombre de usuario"
                                autoSave="username webauthn"
                                autoFocus
                                autoComplete="username webauthn"
                                required
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                value={form.username}
                                type="text"
                                id="username"
                                name="username"
                                className="text-sm sm:text-base placeholder-zinc-500 text-white pl-10 sm:pl-12 pr-4 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 w-full py-3 sm:py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-zinc-600"
                                placeholder="Ej: jose123"
                            />
                        </div>
                    </motion.div>

                    {/* Password field */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                    >
                        <label htmlFor="password" className="block text-zinc-200 font-semibold text-sm">
                            Contraseña
                        </label>
                        <div className="relative group">
                            <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 sm:w-12 text-zinc-500 group-focus-within:text-blue-400 transition-colors">
                                <LockIcon className="size-4 sm:size-5" aria-hidden="true" />
                            </div>
                            <input
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                value={form.password}
                                required
                                minLength={6}
                                maxLength={20}
                                aria-label="Contraseña"
                                autoSave="current-password"
                                autoComplete="current-password"
                                type="password"
                                id="password"
                                name="password"
                                className="text-sm sm:text-base placeholder-zinc-500 text-white pl-10 sm:pl-12 pr-4 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 w-full py-3 sm:py-3.5 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 hover:border-zinc-600"
                                placeholder="Tu contraseña"
                            />
                        </div>
                    </motion.div>

                    {/* Forgot password link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex justify-end"
                    >
                        <Link
                            to={publicPaths.passwordReset}
                            className="text-xs sm:text-sm bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-semibold hover:opacity-80 transition-opacity"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </motion.div>

                    {/* Submit button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-linear-to-r from-blue-600 to-emerald-600 text-white font-bold py-3 sm:py-4 px-6 rounded-lg hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg shadow-blue-500/20 text-sm sm:text-base"
                    >
                        <span className="mr-2">
                            {isLoading ? 'Ingresando...' : 'Ingresar a mi cuenta'}
                        </span>
                        {!isLoading && (
                            <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-lg"
                            >
                                →
                            </motion.div>
                        )}
                    </motion.button>
                </motion.form>
                <hr className="border border-emerald-500 my-4" />

                {/* Google Login button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    disabled={isLoading}
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full bg-white text-zinc-800 font-semibold mb-6 py-2 sm:py-1 px-4 rounded-lg hover:bg-zinc-100 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-md shadow-zinc-300/20 text-sm sm:text-base"
                >
                    <img className="size-10" src="/google-icon.svg" alt="Google Icon" />
                </motion.button>

                {/* Register link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="flex mx-auto justify-center w-full mb-6 sm:mb-8 items-center text-xs sm:text-sm text-center bg-zinc-800/50 border-t border-zinc-700/50 py-4 sm:py-6"
                >
                    <UserPlus2Icon className="size-4 sm:size-5 text-zinc-300" aria-hidden="true" />
                    <span className="ml-2 text-zinc-200">
                        ¿No tienes una cuenta?
                        <Link
                            to={'/register'}
                            aria-label="Ir a la página de registro"
                            className="text-blue-400 hover:text-blue-300 font-bold ml-1 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
                        >
                            Registrate aquí
                        </Link>
                    </span>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default Login
