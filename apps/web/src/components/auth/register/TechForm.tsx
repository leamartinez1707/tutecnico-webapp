import ErrorMessage from '@/components/Error/Message';
import { SignUp, SignUpUser } from '@/types';
import { countryInfo } from '@/utils';
import { Briefcase, Map, MapPinned } from 'lucide-react';
import { Dispatch, useState } from 'react';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { useSpecializations } from '@/hooks/queries/useSpecializations';

type TechFormProps = {

    setSelectedDepartment: Dispatch<React.SetStateAction<string>>
    selectedDepartment: string;
    register: UseFormRegister<SignUp | SignUpUser>;
    selectedRole: string;
    setShowProfessions: Dispatch<React.SetStateAction<boolean>>
    showProfessions: boolean;
    services: string[];
    setServices: Dispatch<React.SetStateAction<string[]>>
    errors: FieldErrors<SignUp | SignUpUser>
}

const TechForm = ({ setSelectedDepartment, selectedDepartment, register, selectedRole, setShowProfessions, showProfessions, services, setServices, errors }: TechFormProps) => {

    const { data: specializations } = useSpecializations();
    const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");

    return (
        <div className="space-y-6">
            {/* Mensaje informativo */}
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs sm:text-sm text-blue-300">
                    <strong>Importante:</strong> Selecciona el departamento donde trabajas. Tu dirección se usará para ubicarte en el mapa con precisión.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="department" className="block text-zinc-200 font-semibold text-sm">Departamento *</label>
                    <div className="relative group">
                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-12 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                            <Map className="size-5" />
                        </div>
                        <select
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="text-sm sm:text-base text-white pl-12 pr-10 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 hover:bg-zinc-800/30 w-full py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 hover:border-zinc-600 appearance-none cursor-pointer"
                            name="department"
                            id="department"
                        >
                            <option value="">Seleccionar departamento</option>
                            {countryInfo.map((info) => (
                                <option className='bg-zinc-800' key={info.id} value={info.name.toLowerCase()}>{info.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="neighborhood" className="block text-zinc-200 font-semibold text-sm">Barrio</label>
                    <div className="relative group">
                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-12 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                            <MapPinned className="size-5" />
                        </div>
                        <select
                            className="text-sm sm:text-base text-white pl-12 pr-10 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 w-full py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 hover:border-zinc-600 appearance-none cursor-pointer"
                            name="neighborhood"
                            id="neighborhood"
                            disabled={!selectedDepartment}
                        >
                            <option value="">
                                {selectedDepartment ? "Seleccionar barrio" : "Primero selecciona departamento"}
                            </option>
                            {countryInfo.find((info) => info.name.toLowerCase() === selectedDepartment)?.towns.map((neighborhood) => (
                                <option className='bg-zinc-800' key={neighborhood.id} value={neighborhood.name.toLowerCase()}>{neighborhood.name}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="specialization" className="block text-zinc-200 font-semibold text-sm">Especialización *</label>
                <div className="relative group">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-12 text-zinc-500 group-focus-within:text-emerald-400 transition-colors">
                        <Briefcase className="size-5" />
                    </div>
                    <select
                        className="text-sm sm:text-base text-white pl-12 pr-10 rounded-lg border-2 border-zinc-700/50 bg-zinc-800/50 hover:bg-zinc-800/30 w-full py-3 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 hover:border-zinc-600 appearance-none cursor-pointer"
                        id="specialization"
                        {...register("specialization")}
                        onChange={(e) => setSelectedSpecialization(e.target.value)}
                    >
                        <option value="">Seleccionar especialización</option>
                        {specializations?.items && specializations.items
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((spec) => (
                                <option className='bg-zinc-800' key={spec.id} value={spec.name.toLowerCase()}>
                                    {spec.name.charAt(0).toUpperCase() + spec.name.slice(1)}
                                </option>
                            ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <ErrorMessage>
                        {selectedRole === 'tecnico' && 'specialization' in errors && errors.specialization?.message}
                    </ErrorMessage>
                </div>

                {/* Descripción de la especialización seleccionada */}
                {selectedSpecialization && specializations?.items && (() => {
                    const selected = specializations.items.find(s => s.name.toLowerCase() === selectedSpecialization);
                    return selected ? (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <p className="text-sm text-blue-800">
                                <strong>{selected.name.charAt(0).toUpperCase() + selected.name.slice(1)}:</strong> {selected.description}
                            </p>
                        </div>
                    ) : null;
                })()}
            </div>

            <div className="space-y-2">
                <label className="block text-zinc-200 font-semibold text-sm">Profesiones</label>
                <button
                    type="button"
                    onClick={() => setShowProfessions(!showProfessions)}
                    className="flex items-center justify-between w-full text-sm sm:text-base px-4 py-3 rounded-md border-2 border-zinc-700/50 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-200 bg-zinc-800/50 hover:bg-zinc-800/30 hover:border-zinc-600 group"
                >
                    <span className="text-zinc-200 font-medium">
                        {services.length > 0
                            ? `${services.length} profesión${services.length > 1 ? 'es' : ''} seleccionada${services.length > 1 ? 's' : ''}`
                            : "Seleccionar profesiones"
                        }
                    </span>
                    <div className={`transform transition-transform duration-200 ${showProfessions ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {/* Lista desplegable de checkboxes con animación */}
                {showProfessions && selectedSpecialization && (
                    <div className="border-2 border-zinc-700/50 rounded-md p-4 mt-2 max-h-64 overflow-y-auto bg-zinc-800/30 shadow-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(() => {
                                const selectedSpec = specializations?.items.find(s => s.name.toLowerCase() === selectedSpecialization);
                                return selectedSpec?.professions
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((prof) => (
                                        <div key={prof.id} className="flex items-center p-2 rounded-md hover:bg-zinc-800/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                id={`service-${prof.id}`}
                                                value={prof.name.toLowerCase()}
                                                checked={services.includes(prof.name.toLowerCase())}
                                                {...register("services", { required: "Debes seleccionar al menos un servicio" })}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setServices([...services, e.target.value]);
                                                    } else {
                                                        setServices(services.filter(service => service !== e.target.value));
                                                    }
                                                }}
                                                className="w-4 h-4 text-emerald-400 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 cursor-pointer"
                                            />
                                            <label
                                                htmlFor={`service-${prof.id}`}
                                                className="ml-3 text-sm text-zinc-200 cursor-pointer select-none font-medium"
                                            >
                                                {prof.name}
                                            </label>
                                        </div>
                                    ));
                            })()}
                        </div>

                        {services.length > 0 && (
                            <div className="mt-4 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-md">
                                <p className="text-sm text-emerald-400 font-medium mb-2">Profesiones seleccionadas:</p>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((service, index) => {
                                        const selectedSpec = specializations?.items.find(s => s.name.toLowerCase() === selectedSpecialization);
                                        const professionName = selectedSpec?.professions.find(p => p.name.toLowerCase() === service)?.name;
                                        return (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                            >
                                                {professionName}
                                                <button
                                                    type="button"
                                                    onClick={() => setServices(services.filter(s => s !== service))}
                                                    className="ml-2 text-emerald-400 hover:text-green-800 focus:outline-none"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <ErrorMessage>
                    {selectedRole === 'tecnico' && 'services' in errors && errors.services?.message}
                </ErrorMessage>
            </div>
        </div>
    )
}

export default TechForm

