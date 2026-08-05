# Sistema de Manejo de Errores - TechFinderUY

## Visión General

El sistema de manejo de errores implementado en TechFinderUY tiene como objetivo principal **prevenir pantallas blancas** y proporcionar una experiencia de usuario robusta incluso cuando ocurren errores inesperados.

## Arquitectura del Sistema

### 1. Error Boundary Global (`ErrorBoundary.tsx`)

**Ubicación:** `src/components/ErrorBoundary.tsx`

Envuelve toda la aplicación en `main.tsx` para capturar cualquier error de React que no sea manejado en componentes específicos.

#### Características:
- ✅ Captura errores en cualquier componente hijo
- ✅ Muestra UI de fallback en lugar de pantalla blanca
- ✅ Registra errores completos con stack trace
- ✅ Proporciona opciones de recuperación (reintentar, recargar, ir al inicio)
- ✅ Muestra detalles técnicos solo en desarrollo

#### Acciones de Usuario:
1. **Intentar de nuevo** - Resetea el estado del error
2. **Recargar página** - Hace un reload completo
3. **Volver al inicio** - Navega a `/`

### 2. Section Error Boundary (`SectionErrorBoundary.tsx`)

**Ubicación:** `src/components/Error/SectionErrorBoundary.tsx`

Componente más granular para envolver secciones específicas de la aplicación.

#### Ventajas:
- ✅ Evita que un error en una sección rompa toda la página
- ✅ Muestra mensaje de error inline
- ✅ El resto de la página sigue funcionando
- ✅ Personalizable por sección

#### Implementaciones actuales:

**Mapa (UserDashboard.tsx):**
```tsx
<SectionErrorBoundary 
  sectionName="Mapa"
  fallbackMessage="No pudimos cargar el mapa. Por favor, recarga la página."
>
  <UserMap {...props} />
</SectionErrorBoundary>
```

**Reservas del Técnico (BookingsPage.tsx):**
```tsx
<SectionErrorBoundary 
  sectionName="Reservas"
  fallbackMessage="No pudimos cargar tus reservas. Por favor, recarga la página."
>
  <Bookings />
</SectionErrorBoundary>
```

**Historial de Reservas Usuario (ProfilePage.tsx):**
```tsx
<SectionErrorBoundary 
  sectionName="Historial de Reservas"
  fallbackMessage="No pudimos cargar tus reservas. Por favor, recarga la página."
>
  <BookingsList {...props} />
</SectionErrorBoundary>
```

### 3. Manejadores Globales de Errores (`globalErrorHandler.ts`)

**Ubicación:** `src/utils/globalErrorHandler.ts`

Captura errores que escapan los Error Boundaries (errores asíncronos, promesas rechazadas, etc.)

#### Maneja:
- `window.onerror` - Errores de JavaScript no capturados
- `window.onunhandledrejection` - Promesas rechazadas sin catch

#### Inicialización:
```tsx
// src/main.tsx
import { setupGlobalErrorHandlers } from './utils/globalErrorHandler.ts'

setupGlobalErrorHandlers()
```

## Estrategia de Logging

Todos los errores se registran usando el sistema centralizado de logging:

```typescript
logger.error('Error en sección: Mapa', {
  error: error.message,
  stack: error.stack,
  componentStack: errorInfo.componentStack,
});
```

### Niveles de logging por tipo de error:

| Tipo de Error | Nivel | Ubicación |
|---------------|-------|-----------|
| Error Boundary (global) | `error` | `ErrorBoundary.tsx` |
| Error Boundary (sección) | `error` | `SectionErrorBoundary.tsx` |
| Error global no capturado | `error` | `globalErrorHandler.ts` |
| Promesa rechazada | `error` | `globalErrorHandler.ts` |

## Flujo de Captura de Errores

```
┌─────────────────────────────────┐
│   Error ocurre en componente    │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ ¿Hay SectionErrorBoundary?      │
│ (ej: Mapa, Reservas)            │
└─────┬─────────────────┬─────────┘
      │ SÍ              │ NO
      ▼                 ▼
┌─────────────┐   ┌────────────────┐
│ Muestra UI  │   │ ¿Hay Error     │
│ de sección  │   │ Boundary Global?│
└─────────────┘   └────┬───────────┘
                       │ SÍ
                       ▼
                 ┌─────────────────┐
                 │ Muestra UI      │
                 │ global de error │
                 └─────────────────┘
```

## Patrones de Prevención de Errores

### 1. Validación de Arrays

```typescript
// ❌ Peligroso - puede causar error si bookings es undefined
const filtered = bookings.filter(b => b.status === 'pending');

// ✅ Seguro - valida antes de usar
if (!Array.isArray(bookings)) return [];
const filtered = bookings.filter(b => b.status === 'pending');
```

### 2. Optional Chaining

```typescript
// ❌ Peligroso
const count = response.length;

// ✅ Seguro
const count = response?.length || 0;
```

### 3. Nullish Coalescing

```typescript
// ❌ Puede setear undefined
setBookings(response);

// ✅ Garantiza array
setBookings(response || []);
```

### 4. Try-Catch con Fallbacks

```typescript
try {
  const data = await fetchData();
  setBookings(data || []);
} catch (error) {
  logger.error('Error fetching data', error);
  setBookings([]); // Fallback seguro
}
```

## Mejores Prácticas

### ✅ DO (Hacer)

1. **Siempre envolver secciones críticas** con `SectionErrorBoundary`
2. **Validar datos antes de operar** sobre ellos (Array.isArray, typeof, etc.)
3. **Usar optional chaining** para acceso a propiedades
4. **Proporcionar fallbacks** en catch blocks
5. **Registrar errores** con contexto completo usando `logger.error()`
6. **Testear escenarios de error** (datos undefined, API failures, etc.)

### ❌ DON'T (No hacer)

1. **No asumir que los datos existen** sin validar
2. **No ignorar errores** sin al menos loggearlos
3. **No dejar try-catch vacíos** sin fallback
4. **No usar console.error** - usar `logger.error()` en su lugar
5. **No olvidar casos edge** (arrays vacíos, null, undefined)

## Testing de Error Boundaries

Para testear que los Error Boundaries funcionan:

### Simular Error en Desarrollo:

```tsx
// Agregar temporalmente en un componente
throw new Error('Test error boundary');
```

### Verificar:
1. ✅ No debe aparecer pantalla blanca
2. ✅ Debe mostrar UI de error (global o de sección)
3. ✅ El error debe aparecer en console (development)
4. ✅ Botones de recuperación deben funcionar

## Secciones Críticas Protegidas

| Sección | Componente | Error Boundary |
|---------|-----------|----------------|
| Mapa principal | `UserMap` | ✅ `SectionErrorBoundary` |
| Mapa móvil | `UserMap` (fullscreen) | ✅ `SectionErrorBoundary` |
| Reservas técnico | `Bookings` | ✅ `SectionErrorBoundary` |
| Historial reservas | `BookingsList` | ✅ `SectionErrorBoundary` |
| App completa | Todo | ✅ `ErrorBoundary` (global) |

## Monitoreo en Producción

### Logs a revisar:

```typescript
// Buscar en logs de producción:
logger.error('Error capturado por Error Boundary', ...)
logger.error('Error en sección: [Nombre]', ...)
logger.error('Error global no capturado', ...)
logger.error('Promesa rechazada no manejada', ...)
```

### Métricas importantes:
- Frecuencia de errores por sección
- Errores más comunes (agrupar por mensaje)
- Tasa de recuperación (usuario recarga vs abandona)

## Extensiones Futuras

### Posibles mejoras:

1. **Servicio de error tracking** (Sentry, LogRocket)
2. **Reportes automáticos** a backend cuando ocurre error
3. **Métricas de error** en dashboard de admin
4. **A/B testing** de mensajes de error
5. **Recovery automático** para ciertos tipos de errores
6. **Modo offline** con sincronización posterior

## Troubleshooting

### Problema: Error Boundary no captura el error

**Causas posibles:**
- Error en event handler (no en render)
- Error asíncrono sin await/catch
- Error en código fuera de React

**Solución:**
- Usar try-catch en event handlers
- Usar try-catch en funciones async
- Usar `globalErrorHandler` para errores fuera de React

### Problema: Pantalla blanca persiste

**Verificar:**
1. ¿Error Boundary está en `main.tsx`? ✓
2. ¿`setupGlobalErrorHandlers()` está llamado? ✓
3. ¿Error es en código de build (Vite)? → Revisar console

## Recursos

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [MDN: window.onerror](https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event)
- [MDN: unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event)

---

**Última actualización:** Noviembre 2025  
**Mantenedor:** Equipo de Desarrollo TechFinderUY
