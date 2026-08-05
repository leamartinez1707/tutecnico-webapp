

// Ejemplo direccion https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion?calle=Cayetano%20rivas%204007&departamento=montevideo
export const getGeoLocation = async (address: string, department?: string) => {
    try {
        const formatedAddress = encodeURIComponent(address);
        let url = `https://direcciones.ide.uy/api/v0/geocode/BusquedaDireccion?calle=${formatedAddress}`;
        
        // Agregar departamento si está presente para mayor precisión
        if (department) {
            const formatedDepartment = encodeURIComponent(department.toLowerCase());
            url += `&departamento=${formatedDepartment}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener la ubicación geográfica');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la ubicación geográfica');
    }
}
