import { useState } from 'react';
import { Search, MapPin, Filter, CircleX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTechnicians } from '@/hooks';
import { capitalizeFirstLetter, countryInfo } from '@/utils';
import { useSpecializations } from '@/hooks/queries/useSpecializations';

type SearchFiltersProps = {
    searchTerm: string,
    setSearchTerm: (value: string) => void
    setSpecializationFilter: (value: string) => void
    specializationFilter: string
    departmentFilter: string
    setDepartmentFilter: (value: string) => void
}

const SearchFilters = ({ searchTerm, setSearchTerm, specializationFilter, setSpecializationFilter, departmentFilter, setDepartmentFilter }: SearchFiltersProps) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const { data: technicians = [] } = useTechnicians();
    const { data: specializations } = useSpecializations();

    // Obtener lista única de departamentos ordenados
    const departments = countryInfo
        .map(dept => dept.name)
        .sort((a, b) => a.localeCompare(b));

    return (
        <div className="bg-white rounded-md shadow-lg p-6 mt-4 mb-6 mx-4">
            <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Busca el técnico más cercano y de confianza</h1>
                <p className="text-gray-600">
                    Conecta con técnicos certificados y confiables en tu área para resolver tu problema cuanto antés.
                </p>
            </div>

            {/* Main Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                    <label htmlFor="searchTechnicians" className="sr-only">Buscar técnicos por servicio, marca o problema</label>
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" aria-hidden="true" />
                    <input
                        id="searchTechnicians"
                        type="text"
                        placeholder="Buscar por servicio, marca o problema..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    aria-label={showAdvancedFilters ? "Ocultar filtros avanzados" : "Mostrar filtros avanzados"}
                    aria-expanded={showAdvancedFilters}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                    {!showAdvancedFilters ? <Filter className="w-5 h-5" aria-hidden="true" /> : <CircleX className="w-5 h-5" aria-hidden="true" />}
                    Filtros
                </button>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="lg:w-48 px-4 py-6 border bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent className='bg-white max-h-60'>
                        <SelectItem value="all">Todos</SelectItem>
                        {departments.map((dept) => (
                            <SelectItem className='hover:bg-gray-100' key={dept} value={dept}>
                                {dept}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                    <SelectTrigger className="lg:w-48 px-4 py-6 border bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                        <SelectValue placeholder="Especialización" />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                        <SelectItem value="all">Todas</SelectItem>
                        {specializations?.items && specializations.items
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((spec, index) => (
                                <SelectItem className='hover:bg-gray-100 capitalize' key={index} value={spec.name}>
                                    {capitalizeFirstLetter(spec.name)}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Advanced Filters */}
            {/* {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Calificación mínima</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Cualquiera</option>
                            <option value="4">4+ estrellas</option>
                            <option value="4.5">4.5+ estrellas</option>
                            <option value="5">Solo 5 estrellas</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilidad</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Cualquiera</option>
                            <option value="now">Disponible ahora</option>
                            <option value="today">Hoy</option>
                            <option value="week">Esta semana</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rango de precios</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Cualquiera</option>
                            <option value="low">$500 - $1,500</option>
                            <option value="mid">$1,500 - $3,000</option>
                            <option value="high">$3,000+</option>
                        </select>
                    </div>
                </div>
            )} */}

            {/* Quick Stats */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{technicians.filter(tech => tech.membershipActive == true).length} técnicos activos disponibles</span>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;