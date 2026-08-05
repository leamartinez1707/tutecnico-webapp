import ContactForm from "@/components/contact/ContactForm";
import { appInfo } from "@/const/appInfo";
import { Wrench } from "lucide-react";



const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mt-18">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Ponte en contacto
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3/4 leading-relaxed">
              ¿Tienes problemas con nuestro servicio o quieres reportar un inconveniente? Nuestro equipo está listo para
              ayudarte. Completa el siguiente formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 xl:gap-12">
            <div className="xl:col-span-1 mb-8 lg:mb-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-24">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6 lg:mb-8">Cómo podemos ayudarte</h3>

                <div className="space-y-3">
                  <div className="group flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl hover:from-blue-100 hover:to-blue-100/50 transition-all duration-300 cursor-pointer border border-blue-100/50 hover:border-blue-200 hover:shadow-md">
                    <div className="h-14 w-14 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <Wrench className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors duration-300">Problemas técnicos</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Problemas con nuestra plataforma o servicios
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-5 bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-xl hover:from-emerald-100 hover:to-emerald-100/50 transition-all duration-300 cursor-pointer border border-emerald-100/50 hover:border-emerald-200 hover:shadow-md">
                    <div className="h-14 w-14 rounded-full bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                        <path d="M10 9H8" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-900 transition-colors duration-300">Feedback de los servicios</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Compartí tu experiencia con nuestros técnicos
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start gap-4 p-5 bg-gradient-to-r from-violet-50 to-violet-50/50 rounded-xl hover:from-violet-100 hover:to-violet-100/50 transition-all duration-300 cursor-pointer border border-violet-100/50 hover:border-violet-200 hover:shadow-md">
                    <div className="h-14 w-14 rounded-full bg-violet-100 group-hover:bg-violet-200 flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-violet-600 group-hover:text-violet-700 transition-colors duration-300"
                      >
                        <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z" />
                        <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z" />
                        <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z" />
                        <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-violet-900 transition-colors duration-300">Solicitud de funcionalidades</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Sugiere mejoras o nuevas funcionalidades
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 text-white shadow-2xl border border-gray-700">
                    <div className="mb-6">
                      <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
                        Contacto directo
                      </h4>
                      <p className="text-gray-300 text-base leading-relaxed">
                        ¿Necesitas una respuesta inmediata? Contáctanos directamente:
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div className="group flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-blue-500/20 group-hover:bg-blue-500/30 rounded-full flex items-center justify-center transition-colors duration-300">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Email</p>
                          <a href={`mailto:${appInfo.email}`} className="text-white hover:text-blue-300 font-medium text-sm group-hover:text-blue-300 transition-colors duration-300 break-all">
                            {appInfo.email}
                          </a>
                        </div>
                      </div>

                      <div className="group flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 bg-green-500/20 group-hover:bg-green-500/30 rounded-full flex items-center justify-center transition-colors duration-300">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Teléfono</p>
                          <a href="tel:+59895220063" className="text-white hover:text-green-300 font-medium text-sm group-hover:text-green-300 transition-colors duration-300">
                            (598) 95 220 063
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Horario</p>
                          <p className="text-white font-medium text-sm">24/7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 lg:p-10 hover:shadow-md transition-shadow duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    Envíanos un mensaje
                  </h2>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage