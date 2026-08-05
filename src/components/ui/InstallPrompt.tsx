import React from 'react';
import { X, Download, Smartphone, Share, Monitor } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { appInfo } from '@/const/appInfo';

const InstallPrompt: React.FC = () => {
  const {
    isInstallable,
    canInstall,
    isIos,
    isAndroid,
    isDesktop,
    install,
    dismiss
  } = usePWAInstall();

  const handleInstall = async () => {
    await install();
  };

  const handleDismiss = () => {
    dismiss();
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center animate-in slide-in-from-bottom-5 duration-500">
      <Card className="w-full max-w-md border-2 border-blue-500/20 shadow-2xl rounded-lg bg-white overflow-hidden">
        <CardContent className="p-6 relative">
          {/* Efecto de fondo decorativo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl -z-10"></div>

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Icono con gradiente y animación */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  {isDesktop ? (
                    <Monitor className="h-6 w-6 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                  ) : (
                    <Smartphone className="h-6 w-6 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-lg">
                  ¡Instalá la App!
                </h3>
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-md">
                  <Download className="h-3 w-3 mr-1" />
                  Acceso instantáneo
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="rounded-lg h-8 w-8 -mt-1 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isAndroid && canInstall ? (
            <>
              {/* Banner con icono decorativo */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Agregá <strong className="text-blue-700">{appInfo.name}</strong> a tu pantalla de inicio para:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Acceso instantáneo sin buscar
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Funciona sin conexión a internet
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Notificaciones en tiempo real
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Instalar Ahora
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  className="rounded-lg border-gray-300 hover:bg-gray-100 transition-colors"
                >
                  Más tarde
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Si cambias de opinión, te lo recordaremos en 7 días
              </p>
            </>
          ) : isIos ? (
            <>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-blue-200">
                <p className="text-sm text-gray-800 font-medium mb-3">
                  Para instalar <strong className="text-blue-700">{appInfo.name}</strong> en tu iPhone/iPad:
                </p>
              </div>

              <div className="space-y-3 mb-5">
                {/* Paso 1 */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                  <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0">
                    1
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-800">
                      Tocá el botón <Share className="h-4 w-4 inline mx-1 text-blue-600" />
                      <strong className="text-blue-700">Compartir</strong> en Safari
                    </span>
                  </div>
                </div>

                {/* Paso 2 */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors">
                  <span className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0">
                    2
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-800">
                      Desplázate y elegí <strong className="text-indigo-700">"Agregar a pantalla de inicio"</strong>
                    </span>
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors">
                  <span className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0">
                    3
                  </span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-800">
                      Tocá <strong className="text-purple-700">"Agregar"</strong> para completar
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleDismiss}
                className="w-full rounded-lg border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 font-semibold transition-all"
              >
                ¡Entendido!
              </Button>
              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Te lo recordaremos en 7 días si aún no instalaste la app
              </p>
            </>
          ) : isAndroid ? (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-800 font-medium mb-3">
                  Para instalar <strong className="text-blue-700">{appInfo.name}</strong>:
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </span>
                    <p className="text-sm text-gray-700">
                      Tocá el menú del navegador <strong>⋮</strong> (tres puntos verticales)
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </span>
                    <p className="text-sm text-gray-700">
                      Buscá y tocá <strong>"Agregar a pantalla de inicio"</strong>
                    </p>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </span>
                    <p className="text-sm text-gray-700">
                      Confirmá para agregar el ícono
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleDismiss}
                className="w-full rounded-lg border-2 border-blue-200 hover:bg-blue-50"
              >
                ¡Entendido!
              </Button>
              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Te lo recordaremos en 7 días
              </p>
            </>
          ) : isDesktop ? (
            <>
              {/* Sección para Desktop */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Instalá <strong className="text-blue-700">{appInfo.name}</strong> en tu escritorio para:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Acceso rápido desde tu escritorio
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                    Funciona como una aplicación nativa
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Notificaciones en tiempo real
                  </li>
                </ul>
              </div>

              {canInstall ? (
                // Si el navegador soporta el prompt automático
                <div className="flex gap-3">
                  <Button
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Instalar Ahora
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="rounded-lg border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    Más tarde
                  </Button>
                </div>
              ) : (
                // Instrucciones manuales para Chrome/Edge
                <>
                  <div className="space-y-3 mb-5">
                    {/* Opción 1 */}
                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-100 hover:border-blue-300 transition-colors">
                      <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0">
                        1
                      </span>
                      <div className="flex-1">
                        <span className="text-sm text-gray-800">
                          Hacé click en el menú <strong className="text-blue-700">⋮</strong> del navegador (arriba a la derecha)
                        </span>
                      </div>
                    </div>

                    {/* Opción 2 */}
                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors">
                      <span className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0">
                        2
                      </span>
                      <div className="flex-1">
                        <span className="text-sm text-gray-800">
                          Buscá y hacé click en <strong className="text-indigo-700">"Instalar {appInfo.name}" o "Instalar página  como app"</strong>
                        </span>
                      </div>
                    </div>

                    {/* Opción 3 */}
                    <div className="flex items-start gap-3 bg-white p-3 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors">
                      <span className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0">
                        3
                      </span>
                      <div className="flex-1">
                        <span className="text-sm text-gray-800">
                          Confirmá la instalación en el diálogo que aparece
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="w-full rounded-lg border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 font-semibold transition-all"
                  >
                    ¡Entendido!
                  </Button>
                </>
              )}

              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Te lo recordaremos en 7 días si aún no instalaste la app
              </p>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPrompt;
