const APP_NAME = 'ServyFix';

export interface AppInfoType {
    name: string;
    email: string;
    phoneNumber: string;
    faqs: {
        question: string;
        answer: string;
    }[];
}

export const appInfo: AppInfoType = {
    name: APP_NAME,
    email: "hello@servyfix.com",
    phoneNumber: "+59895220063",
    faqs: [
        {
            question: `¿Es gratis usar ${APP_NAME}?`,
            answer:
                "¡Sí! Para las personas que buscan técnicos es 100% gratis. Los técnicos solo pagan una pequeña suscripción mensuale.",
        },
        {
            question: "¿Cómo sé que los técnicos son confiables?",
            answer:
                "Todos nuestros técnicos están verificados y tienen calificaciones reales de otros clientes. Podés ver sus comentarios y puntuaciones antes de elegir.",
        },
        {
            question: "¿Qué pasa si no quedo conforme con el servicio?",
            answer:
                "Tu satisfacción es lo más importante. Si no estás conforme, podés dejar una calificación y nosotros te ayudamos a resolver el problema.",
        },
        {
            question: "¿En qué ciudades está disponible?",
            answer:
                "¡Estamos en todo el Uruguay!",
        },
    ]
}

export const DEFAULT_IMAGE = "https://pbs.twimg.com/profile_images/1183307306995306496/P1K5Kt_5_400x400.jpg";