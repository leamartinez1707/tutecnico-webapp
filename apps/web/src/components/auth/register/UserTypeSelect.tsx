import { UserCheck2, Wrench, User } from 'lucide-react';
import { Dispatch } from 'react'
import { motion } from 'motion/react';
import { appInfo } from '@/const/appInfo';

type TypeUserSelectProps = {
    setSelectedRole: Dispatch<React.SetStateAction<string>>;
    selectedRole: string;
};

const UserTypeSelect = ({ setSelectedRole, selectedRole }: TypeUserSelectProps) => {
    const userTypes = [
        {
            id: 'usuario',
            title: 'Soy Usuario',
            description: 'Busco técnicos para solucionar mis problemas',
            icon: User,
            gradient: 'from-blue-500 to-cyan-500',
            hoverGradient: 'from-blue-600 to-cyan-600'
        },
        {
            id: 'tecnico',
            title: 'Soy Técnico',
            description: 'Quiero ofrecer mis servicios profesionales',
            icon: Wrench,
            gradient: 'from-green-500 to-emerald-500',
            hoverGradient: 'from-green-600 to-emerald-600'
        }
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
                <UserCheck2 className="h-6 w-6 text-zinc-300" />
                <h3 className="text-lg font-bold text-white">¿Cómo querés usar {appInfo.name}?</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedRole === type.id;
                    
                    return (
                        <motion.div
                            key={type.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: type.id === 'usuario' ? 0 : 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div
                                onClick={() => setSelectedRole(type.id)}
                                className={`
                                    relative cursor-pointer p-6 rounded-lg border-2 transition-all duration-300 
                                    hover:shadow-xl group overflow-hidden
                                    ${isSelected 
                                        ? `border-transparent bg-gradient-to-br ${type.gradient} text-white shadow-lg shadow-${type.id === 'usuario' ? 'blue' : 'emerald'}-500/20` 
                                        : 'border-zinc-700/50 bg-zinc-800/50 text-zinc-200 hover:border-zinc-600 hover:shadow-md'
                                    }
                                `}
                            >
                                {/* Background animation */}
                                {!isSelected && (
                                    <div className={`
                                        absolute inset-0 bg-gradient-to-br ${type.hoverGradient} 
                                        opacity-0 group-hover:opacity-5 transition-opacity duration-300
                                    `} />
                                )}
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`
                                            p-3 rounded-md transition-all duration-300
                                            ${isSelected 
                                                ? 'bg-white/20 backdrop-blur-sm' 
                                                : `bg-gradient-to-br ${type.gradient} text-white group-hover:scale-110`
                                            }
                                        `}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h4 className={`
                                            text-lg font-bold transition-colors duration-300
                                            ${isSelected ? 'text-white' : 'text-white'}
                                        `}>
                                            {type.title}
                                        </h4>
                                    </div>
                                    
                                    <p className={`
                                        text-sm leading-relaxed transition-colors duration-300
                                        ${isSelected ? 'text-white/90' : 'text-zinc-400'}
                                    `}>
                                        {type.description}
                                    </p>
                                </div>
                                
                                {/* Selection indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-4 right-4 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                                    >
                                        <div className="w-3 h-3 bg-white rounded-full" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            
            {selectedRole && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6"
                >
                    <div className="flex items-center gap-2 p-4 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-emerald-400 font-medium text-sm">
                            Perfecto! Ahora completá los datos {selectedRole === 'tecnico' ? 'de tu perfil profesional' : 'de tu cuenta'}
                        </span>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export default UserTypeSelect;