export const publicPaths = {
    home: '/',
    contact: '/contacto',
    passwordReset: '/recuperar-contrasena',
    paymentSuccess: '/pago-exitoso',
    paymentFailure: '/pago-fallido',
    paymentPending: '/pago-pendiente',
    notFound: '*',
}

export const authPaths = {
    login: '/login',
    register: '/register',
    googleAuth: '/oauth/callback',
}

export const userPaths = {
    profile: '/perfil',
    map: '/mapa',
    favorites: '/favoritos',
    bookings: '/reservas',
    technicianRating: '/tecnico/detalle/:username',
}

export const technicianPaths = {
    dashboard: '/panel/tecnico',
    rating: '/panel/tecnico/calificacion/:technicianId',
    bookings: '/panel/tecnico/reservas',
}