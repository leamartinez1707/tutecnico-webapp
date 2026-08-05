import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { enqueueSnackbar } from "notistack";
import emailjs from "@emailjs/browser";
import { logger } from "@/utils/logger";

const contactFormSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe tener al menos 3 carácteres" }),
    email: z.email({ message: "Por favor utiliza un correo válido" }),
    phone: z.string(),
    issueType: z.string({
        error: "Por favor selecciona un tipo de problema",
    }),
    subject: z.string().min(5, { message: "El asunto debe tener al menos 5 carácteres" }),
    message: z.string().min(10, { message: "El mensaje debe contener al menos 10 carácteres" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const issueTypes = [
    { value: "technical", label: "Problema técnico" },
    { value: "billing", label: "Pregunta de pagos" },
    { value: "account", label: "Problema con la cuenta" },
    { value: "feedback", label: "Feedback de nuestro servicio" },
    { value: "feature", label: "Petición de funcionalidad" },
    { value: "other", label: "Otro" },
];

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            issueType: "",
            subject: "",
            message: "",
        },
    });

    async function onSubmit(data: ContactFormValues) {
        setIsSubmitting(true);

        try {
            await emailjs.send(
                import.meta.env.VITE_SERVICE_ID,
                import.meta.env.VITE_TEMPLATE_ID,
                data,
                import.meta.env.VITE_EMAIL
            )

            setIsSubmitted(true);
            enqueueSnackbar("Su mensaje de ha enviado correctamente!", {
                variant: "success",
            });

            // Show success message
            setIsSubmitted(true);
            form.reset();

        } catch (error: any) {
            logger.error('Error al enviar mensaje de contacto', error);
            enqueueSnackbar("No se pudo enviar el mensaje, intente nuevamente o contactese directamente con nosotros!", {
                variant: "error",
            });

        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSubmitted) {
        return (
            <Card className="w-full shadow-xl rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800/90 border border-zinc-700/60">
                <CardContent className="p-0">
                    <div className="p-8 text-center">
                        <div className="mx-auto w-12 h-12 flex items-center justify-center mb-4 bg-blue-900/50 rounded-lg">
                            <CheckCircle2 className="h-6 w-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">¡Gracias!</h2>
                        <p className="text-zinc-400 mb-6">
                            Tu mensaje ha sido enviado correctamente. Nuestro equipo de soporte lo revisará y se pondrá en contacto contigo lo antes posible.
                        </p>
                        <Button onClick={() => setIsSubmitted(false)} className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Enviar otro mensaje</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full shadow-xl rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800/90 border border-zinc-700/60">
            <CardContent className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-300 font-semibold">Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tu nombre" {...field} className="rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-300 font-semibold">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="tu.email@ejemplo.com" type="email" {...field} className="rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-300 font-semibold">Teléfono</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ejemplo: 095123321" {...field} className="rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="issueType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-300 font-semibold">Tipo de problema</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-lg bg-zinc-800 border-zinc-700 text-white focus:ring-blue-500">
                                                    <SelectValue placeholder="Selecciona un tipo de problema" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-lg bg-zinc-800 border-zinc-700 text-white">
                                                {issueTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value} className="hover:bg-zinc-700 focus:bg-zinc-700">
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300 font-semibold">Motivo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Breve descripción del motivo" {...field} className="rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-300 font-semibold">Mensaje</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Danos más detalles sobre tu problema o consulta"
                                            className="min-h-[120px] rounded-lg bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:ring-blue-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Incluye detalles relevantes como mensajes de error, información del dispositivo o cuando sucedió el problema.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full md:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Enviar mensaje"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}