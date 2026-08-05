import api from "./axios"

export const getLocation = async (address: string) => {
    const url = `geocoding/coordinates?address=${address}`
    const { data } = await api(url)
    if (!data) {
        throw new Error('No hay datos en la respuesta de registro')
    }
    return data
}