# MercadoPago Integration - TechFinderUY

## 📋 Descripción

Integración completa de MercadoPago para el sistema de suscripciones premium de técnicos. La integración utiliza un flujo backend-driven donde el frontend crea una preferencia de pago y redirige al usuario a MercadoPago.

## 🏗️ Arquitectura

### Backend-Driven Checkout

```
Frontend → POST /checkouts/create-preference → Backend → MercadoPago API
                                                    ↓
                                            { preferenceId, initPoint }
                                                    ↓
                                        Redirect to initPoint URL
                                                    ↓
                                            MercadoPago Checkout
                                                    ↓
                        Payment Complete → Redirect to success/failure/pending URL
```

## 📁 Estructura de Archivos

```
src/
├── api/
│   └── checkoutApi.ts                 # API layer para MercadoPago
├── hooks/
│   └── mutations/
│       ├── useCheckoutMutations.ts    # Mutation hook para checkout
│       └── index.ts                   # Exportaciones centralizadas
├── components/
│   └── mercadopago/
│       ├── MercadoPagoModal.tsx       # Modal de pago (contenido)
│       └── MercadoPagoDialog.tsx      # Dialog wrapper
├── pages/
│   └── Payment/
│       ├── PaymentSuccessPage.tsx     # Pago exitoso
│       ├── PaymentFailurePage.tsx     # Pago fallido
│       └── PaymentPendingPage.tsx     # Pago pendiente
└── routes/
    ├── routesConfig.ts                # Configuración de rutas
    └── Router.tsx                     # Definición de rutas
```

## 🔧 Componentes

### 1. `checkoutApi.ts`

API layer con TypeScript completo:

```typescript
interface CreatePreferenceRequest {
  technicianId: number;
  planType: 'monthly' | 'yearly';
  successUrl: string;
  failureUrl: string;
  pendingUrl: string;
}

interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
}
```

### 2. `useCheckoutMutations.ts`

Hook de TanStack Query con manejo automático de redirect:

```typescript
const createCheckout = useCreateCheckout();

// Uso
createCheckout.mutate({
  technicianId: user.technician.id,
  planType: 'monthly',
  successUrl: 'http://localhost/pago-exitoso',
  failureUrl: 'http://localhost/pago-fallido',
  pendingUrl: 'http://localhost/pago-pendiente',
});
```

### 3. `MercadoPagoModal.tsx`

Modal de pago con:
- Información dinámica del plan (mensual/anual)
- Loading states con `Loader2`
- Disabled cuando no hay técnico
- Trust indicators y seguridad
- Mercado Pago branding

### 4. `MercadoPagoDialog.tsx`

Wrapper Dialog que controla el modal:

```typescript
<MercadoPagoDialog
  isOpen={isMercadoPagoModalOpen}
  onClose={() => setIsMercadoPagoModalOpen(false)}
  planType="monthly"
/>
```

### 5. Páginas de Resultado

- **PaymentSuccessPage**: Confirmación con detalles, beneficios activados, botones de navegación
- **PaymentFailurePage**: Error con causas, recomendaciones, botón de retry
- **PaymentPendingPage**: Estado pendiente con información de tiempos, próximos pasos

## 🎯 Integración en MembershipCard

```tsx
const [isMercadoPagoModalOpen, setIsMercadoPagoModalOpen] = useState(false);
const [selectedPlanType, setSelectedPlanType] = useState<'monthly' | 'yearly'>('monthly');

const handleOpenCheckout = (planType: 'monthly' | 'yearly') => {
    setSelectedPlanType(planType);
    setIsMercadoPagoModalOpen(true);
};

// Botones de planes
<Button onClick={() => handleOpenCheckout('monthly')}>
  Activar Plan Mensual
</Button>

<Button onClick={() => handleOpenCheckout('yearly')}>
  Activar Plan Anual
</Button>

// Modal
<MercadoPagoDialog
    isOpen={isMercadoPagoModalOpen}
    onClose={() => setIsMercadoPagoModalOpen(false)}
    planType={selectedPlanType}
/>
```

## 🌐 Rutas Configuradas

```typescript
// routesConfig.ts
export const publicPaths = {
    paymentSuccess: '/pago-exitoso',
    paymentFailure: '/pago-fallido',
    paymentPending: '/pago-pendiente',
    // ...
}
```

## 🔄 Flujo Completo

1. **Usuario hace clic en "Activar ahora"**
   - Se abre `MercadoPagoDialog` con plan seleccionado
   - Se muestra información del plan, trust badges, etc.

2. **Usuario hace clic en "Proceder al pago seguro"**
   - `handleCheckout()` llama a `createCheckout.mutate()`
   - POST a `/checkouts/create-preference` con datos del técnico y plan
   - Backend crea preferencia en MercadoPago
   - Backend retorna `{ preferenceId, initPoint }`

3. **Redirect automático a MercadoPago**
   - `onSuccess` del mutation ejecuta `window.location.href = data.initPoint`
   - Usuario ve checkout de MercadoPago

4. **Usuario completa el pago**
   - MercadoPago procesa el pago
   - Redirige a una de las URLs configuradas:
     - Success: `/pago-exitoso?payment_id=XXX&status=approved`
     - Failure: `/pago-fallido?payment_id=XXX&status=rejected`
     - Pending: `/pago-pendiente?payment_id=XXX&status=pending`

5. **Páginas de resultado**
   - Muestran información relevante según el estado
   - Logs automáticos con `logger.info/error`
   - Botones para navegar al dashboard o home

## 🎨 Mejores Prácticas Implementadas

### React 19 & TypeScript
- ✅ Functional components con `memo`
- ✅ Hooks personalizados con types inferidos
- ✅ `useMemo` para cálculos costosos
- ✅ `useCallback` para funciones estables
- ✅ Type guards para validación

### TanStack Query
- ✅ Mutations con manejo de estados (isPending, isError, isSuccess)
- ✅ Callbacks onSuccess/onError
- ✅ Integración con logger centralizado

### UX/UI
- ✅ Loading states claros
- ✅ Disabled states cuando no hay datos
- ✅ Trust indicators y seguridad visible
- ✅ Responsive design
- ✅ Feedback al usuario en cada paso

### Logging
- ✅ `logger.debug` para debugging
- ✅ `logger.info` para eventos importantes
- ✅ `logger.error` para errores
- ✅ `logger.apiError` para errores de API

### Tailwind CSS
- ✅ Uso de `bg-linear-to-*` en lugar de `bg-gradient-to-*`
- ✅ Uso de `shrink-0` en lugar de `flex-shrink-0`
- ✅ Convenciones del proyecto respetadas

## 🔒 Seguridad

- Validación de técnico antes de crear checkout
- URLs de retorno dinámicas basadas en `window.location.origin`
- No se exponen secrets en frontend
- Backend maneja toda la comunicación con MercadoPago API
- Logging de todos los eventos importantes

## 📊 Planes Disponibles

### Plan Mensual
- Precio: $990/mes
- Perfil destacado en búsquedas
- Acceso prioritario a reservas
- Sin límite de servicios
- Estadísticas en tiempo real

### Plan Anual
- Precio: $9,990/año (≈ $832/mes)
- Ahorro del 16% (2 meses gratis)
- Todos los beneficios del plan mensual
- Soporte prioritario
- Badge exclusivo de "Profesional Verificado"

## 🚀 Testing

Para probar la integración:

1. Ir al dashboard del técnico
2. Ver la `MembershipCard` sin suscripción activa
3. Hacer clic en "Activar ahora" en cualquier plan
4. Ver el modal con información del plan
5. Hacer clic en "Proceder al pago seguro"
6. Verificar redirect a MercadoPago
7. Completar pago de prueba
8. Verificar redirect a página de éxito/fallo/pendiente

## 📝 Notas

- Las URLs de retorno se generan dinámicamente basadas en `window.location.origin`
- El backend debe estar corriendo en el puerto configurado en `VITE_API_URL`
- Asegurarse de que el backend tenga las credenciales de MercadoPago configuradas
- Los query params en las URLs de retorno son manejados por MercadoPago automáticamente

## 🐛 Debug

Si hay problemas:

1. Verificar console logs con `logger.debug`
2. Verificar network tab para el POST a `/checkouts/create-preference`
3. Verificar que el usuario tenga `technician.id`
4. Verificar que el backend retorne `preferenceId` e `initPoint`
5. Verificar redirect automático en onSuccess del mutation
