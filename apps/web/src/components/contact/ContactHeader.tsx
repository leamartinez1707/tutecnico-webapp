import { Lightbulb } from "lucide-react";

export default function ContactHeader() {
    return (
        <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Ponte en contacto</h1>
            <p className="mt-3 text-muted-foreground max-w-3xl">
                ¿Tienes problemas con nuestro servicio o quieres reportar un inconveniente? Nuestro equipo está listo para ayudarte.
                Completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
        </div>
    );
}