import { motion } from "motion/react";
import { Search, UserCheck, Star, Wrench, CreditCard, TrendingUp } from "lucide-react";

const userSteps = [
  {
    icon: Search,
    title: "Buscá",
    description: "Ingresá el servicio que necesitás y tu ubicación",
  },
  {
    icon: UserCheck,
    title: "Elegí",
    description: "Compará perfiles, calificaciones y precios",
  },
  {
    icon: Star,
    title: "Contactá",
    description: "Conectá directamente con el técnico ideal",
  },
];

const technicianSteps = [
  {
    icon: Wrench,
    title: "Registrate",
    description: "Creá tu perfil profesional en minutos",
  },
  {
    icon: CreditCard,
    title: "Suscribite",
    description: "Plan mensual accesible, sin costos ocultos",
  },
  {
    icon: TrendingUp,
    title: "Crecé",
    description: "Recibí contactos y expandí tu negocio",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 px-4 bg-zinc-900">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-white">
            ¿Cómo funciona?
          </h2>
          <p className="text-xl text-zinc-400">
            Simple, rápido y efectivo para todos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 mb-12">
          {/* For Users */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-blue-400">Para Usuarios</span>
              </div>
              <h3 className="text-3xl text-white mb-2">
                Encontrá ayuda al instante
              </h3>
              <p className="text-zinc-400">
                100% gratis para siempre
              </p>
            </div>

            <div className="space-y-6">
              {userSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-blue-400">Paso {index + 1}</span>
                    </div>
                    <h4 className="text-xl text-white mb-1">{step.title}</h4>
                    <p className="text-zinc-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* For Technicians */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 border border-emerald-600/30 rounded-full mb-4">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-sm text-emerald-400">Para Técnicos</span>
              </div>
              <h3 className="text-3xl text-white mb-2">
                Hacé crecer tu negocio
              </h3>
              <p className="text-zinc-400">
                Suscripción mensual accesible
              </p>
            </div>

            <div className="space-y-6">
              {technicianSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-emerald-400">Paso {index + 1}</span>
                    </div>
                    <h4 className="text-xl text-white mb-1">{step.title}</h4>
                    <p className="text-zinc-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
