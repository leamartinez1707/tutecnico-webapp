import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignUp, SignUpUser } from "../../types"
import ErrorMessage from "../Error/Message"
import { signUpSchema, signUpUserSchema } from "../../schemas/auth-schema"
import { useAuth } from "@/context/AuthContext"
import { enqueueSnackbar } from "notistack"
import { Link, useNavigate } from "react-router-dom"
import TechForm from "./register/TechForm"
import BothUserForm from "./register/BothUserForm"
import UserTypeSelect from "./register/UserTypeSelect"
import { LogInIcon, UserCheck } from "lucide-react"
import Loader from "../loader/Loader"
import { motion, AnimatePresence } from "motion/react"
import { appInfo } from "@/const/appInfo"
import { logger } from "@/utils/logger"
import RateLimitWarning from "@/components/ui/RateLimitWarning"

const Register = () => {

    const [selectedRole, setSelectedRole] = useState<string>('')
    const [selectedDepartment, setSelectedDepartment] = useState<string>('')
    const [services, setServices] = useState<string[]>([]);
    const [showProfessions, setShowProfessions] = useState(false);
    const [serverError, setServerError] = useState<string>('')

    const { register: signUp } = useAuth()
    const initialValues: Partial<SignUp & SignUpUser> = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        services: [''],
        username: '',
        password: '',
        confirm_password: '',
        specialization: "",
        address: ""
    }
    const selectedSchema = selectedRole === 'tecnico' ? signUpSchema : signUpUserSchema;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SignUp | SignUpUser>({
        resolver: zodResolver(selectedSchema),
        defaultValues: initialValues
    });

    const { errors: signupErrors, isLoading } = useAuth()

    const navigate = useNavigate()

    const handleSignup = async (formData: SignUp | SignUpUser) => {
        setServerError('')
        if (!selectedRole) {
            enqueueSnackbar('Debes seleccionar un tipo de usuario', { variant: 'error' })
            return;
        }
        try {
            // Para técnicos, agregar departamento y barrio a la dirección para geolocalización precisa
            if (selectedRole === 'tecnico' && 'services' in formData) {
                const addressParts = [formData.address];
                if (selectedDepartment) {
                    // Capitalizar departamento para mejor formato
                    const capitalizedDept = selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1);
                    addressParts.push(capitalizedDept);
                }
                addressParts.push('Uruguay');
                formData.address = addressParts.join(', ');

                logger.info('Dirección procesada para geolocalización', { address: formData.address });
            }

            const data = await signUp(formData)
            if (!data) {
                logger.error('Error al registrarse: respuesta vacía');
                enqueueSnackbar('Error al registrarse', { variant: 'error' })
                return;
            }
            if (data) {
                logger.info('Usuario registrado exitosamente');
                enqueueSnackbar('Registrado correctamente', { variant: 'success' })
                reset()
                navigate('/login')
            }
        } catch (error) {
            logger.error('Error al registrarse', error);
            if (error instanceof Error) {
                setServerError(error.message);
            } else {
                setServerError('Error desconocido');
            }
            enqueueSnackbar(error instanceof Error ? error.message : String(error), { variant: 'error' })
        }
    }
    if (isLoading) return <Loader />
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-black via-zinc-900 to-black overflow-hidden w-full">
            {/* Animated background orbs */}
            <motion.div
                className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
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
                className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
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

            <div className="relative z-10 bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl my-8 mx-auto flex flex-col justify-between">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="px-8 py-10 text-center relative overflow-hidden"
                    >
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-600/10" />

                        <div className="relative z-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="flex items-center justify-center mb-4"
                            >
                                <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-5 mr-4">
                                    <UserCheck className="h-9 w-9 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-white">Únete a {appInfo.name}</h1>
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-zinc-300 text-lg"
                            >
                                Conectamos técnicos con personas que necesitan <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-semibold">soluciones</span>
                            </motion.p>
                        </div>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        onSubmit={handleSubmit(handleSignup)}
                        className="w-full p-8 space-y-8"
                    >
                        {/* Rate Limit Warning */}
                        <RateLimitWarning endpoint="/auth/register" />

                        {!selectedRole && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <ErrorMessage>Debes seleccionar un tipo de usuario para registrarse</ErrorMessage>
                            </motion.div>
                        )}

                        <UserTypeSelect
                            setSelectedRole={setSelectedRole}
                            selectedRole={selectedRole}
                        />

                        <AnimatePresence mode="wait">
                            {selectedRole && (
                                <motion.div
                                    key="form-fields"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="space-y-6"
                                >
                                    {selectedRole === 'tecnico' && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 p-6 rounded-md border border-green-200"
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                                                <h2 className="font-bold text-green-800 text-lg">Datos profesionales</h2>
                                            </div>
                                            <TechForm
                                                setSelectedDepartment={setSelectedDepartment}
                                                register={register}
                                                selectedRole={selectedRole}
                                                setShowProfessions={setShowProfessions}
                                                showProfessions={showProfessions}
                                                services={services}
                                                setServices={setServices}
                                                errors={errors}
                                            />
                                        </motion.div>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: selectedRole === 'tecnico' ? 0.4 : 0.2 }}
                                        className="bg-linear-to-br from-blue-600/10 to-cyan-600/10 p-6 rounded-xl border border-blue-700/30"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" aria-hidden="true" />
                                            <h2 className="font-bold text-blue-600 text-lg">Datos personales</h2>
                                        </div>
                                        <BothUserForm
                                            register={register}
                                            errors={errors}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <p className="text-red-400 text-sm bg-red-900/30 p-3 rounded-lg border border-red-700/30">{serverError}</p>
                            </motion.div>
                        )}

                        {signupErrors && signupErrors.map((error, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-red-900/30 border border-red-700/30 p-3 text-red-400 text-center rounded-lg"
                            >
                                {error}
                            </motion.div>
                        ))}

                        <AnimatePresence>
                            {selectedRole && (
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group shadow-lg shadow-blue-500/20"
                                >
                                    <span className="mr-2">
                                        {isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
                                    </span>
                                    {!isSubmitting && (
                                        <motion.div
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                        >
                                            →
                                        </motion.div>
                                    )}
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.form>
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex mx-auto justify-center w-full mb-8 items-center text-sm text-center bg-zinc-800/50 border-t border-zinc-700/50 py-6"
                >
                    <LogInIcon className="size-5 text-zinc-300" aria-hidden="true" />
                    <span className="ml-2 text-zinc-200">
                        ¿Ya tienes una cuenta?
                        <Link
                            to={'/login'}
                            aria-label="Ir a la página de inicio de sesión"
                            className="text-blue-400 hover:text-blue-300 font-bold ml-1 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
                        >
                            Ingresá aquí
                        </Link>
                    </span>
                </motion.div>
            </div>
        </div>
    )
}

export default Register