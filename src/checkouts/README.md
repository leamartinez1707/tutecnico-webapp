# MercadoPago Checkout Integration - Suscripciones de Técnicos

## Configuración

### Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=your_access_token_here
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

### Credenciales de MercadoPago

1. Crea una cuenta en [MercadoPago Developers](https://www.mercadopago.com.uy/developers)
2. Obtén tus credenciales de prueba/producción
3. Configura `MERCADOPAGO_ACCESS_TOKEN` con tu Access Token

## Migración de Base de Datos

Ejecuta la migración para crear la tabla de pagos:

```bash
npm run migration:run
```

## Endpoints

### 1. Crear Preferencia de Pago

**POST** `/checkouts/create-preference`

Crea una preferencia de pago en MercadoPago para la suscripción de un técnico.

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "technicianId": 1,
  "planType": "monthly",
  "successUrl": "https://yourapp.com/subscription/success",
  "failureUrl": "https://yourapp.com/subscription/failure",
  "pendingUrl": "https://yourapp.com/subscription/pending"
}
```

**Tipos de Plan:**
- `monthly`: Suscripción mensual ($9.90 UYU)
- `yearly`: Suscripción anual ($99.90 UYU - ahorra 17%)

**Respuesta:**
```json
{
  "id": "123456789-abcd-1234-5678-123456789abc",
  "init_point": "https://www.mercadopago.com.uy/checkout/v1/redirect?pref_id=...",
  "sandbox_init_point": "https://sandbox.mercadopago.com.uy/checkout/v1/redirect?pref_id=...",
  "external_reference": "TECH-1-monthly-1732492800000"
}
```

### 2. Webhook de MercadoPago

**POST** `/checkouts/webhook`

Endpoint público que recibe notificaciones de MercadoPago cuando cambia el estado de un pago.

**No requiere autenticación** (validado por MercadoPago)

MercadoPago enviará automáticamente notificaciones a este endpoint cuando:
- Un pago es aprobado
- Un pago es rechazado
- Un pago está pendiente
- Un pago es reembolsado

### 3. Obtener Pagos de un Técnico

**GET** `/checkouts/payments/technician/:technicianId`

Obtiene el historial de pagos de un técnico específico.

**Headers:**
- `Authorization: Bearer <token>`

**Respuesta:**
```json
[
  {
    "id": 1,
    "mercadopagoPaymentId": "123456789",
    "mercadopagoPreferenceId": "pref-123",
    "status": "approved",
    "amount": 990,
    "planType": "monthly",
    "externalReference": "TECH-1-monthly-1732492800000",
    "technicianId": 1,
    "createdAt": "2025-11-24T12:00:00.000Z",
    "updatedAt": "2025-11-24T12:05:00.000Z"
  }
]
```

## Flujo de Suscripción

1. **El técnico solicita una suscripción:**
   - Frontend llama a `POST /checkouts/create-preference`
   - Backend crea la preferencia en MercadoPago
   - Backend guarda un registro del pago con estado `pending`

2. **El técnico es redirigido a MercadoPago:**
   - Frontend redirige al usuario a `init_point` (o `sandbox_init_point` en desarrollo)
   - El técnico completa el pago en MercadoPago

3. **MercadoPago notifica al backend:**
   - MercadoPago envía webhook a `/checkouts/webhook`
   - Backend actualiza el estado del pago
   - Si el pago es aprobado, activa la membresía del técnico

4. **Activación de membresía:**
   - `membershipType` → `PAID`
   - `membershipActive` → `true`
   - `membershipStartedAt` → fecha actual
   - `membershipExpiresAt` → +30 días (monthly) o +365 días (yearly)

## Estados de Pago

- `pending`: Pago pendiente de procesamiento
- `approved`: Pago aprobado y membresía activada
- `in_process`: Pago en proceso de verificación
- `rejected`: Pago rechazado
- `cancelled`: Pago cancelado por el usuario
- `refunded`: Pago reembolsado

## Configuración de Webhook en MercadoPago

1. Accede a tu cuenta de MercadoPago Developers
2. Ve a "Tus integraciones" → selecciona tu aplicación
3. En "Webhooks" configura la URL: `https://your-backend.com/checkouts/webhook`
4. Selecciona los eventos a notificar: `payment`

## Testing

### Datos de prueba de MercadoPago

Para probar pagos en modo sandbox, usa:

**Tarjetas de crédito aprobadas:**
- Mastercard: 5031 7557 3453 0604
- Visa: 4509 9535 6623 3704

**CVV:** Cualquier número de 3 dígitos
**Fecha de vencimiento:** Cualquier fecha futura
**Titular:** APRO (para aprobado)

Más información: [MercadoPago Test Cards](https://www.mercadopago.com.uy/developers/es/docs/checkout-pro/additional-content/test-cards)

## Seguridad

- Los endpoints de creación y consulta de pagos requieren autenticación JWT
- Solo usuarios con rol `TECNICO` o `ADMIN` pueden crear preferencias
- El webhook es público pero solo procesa notificaciones válidas de MercadoPago
- Las credenciales de MercadoPago deben guardarse en variables de entorno

## Ejemplo de Integración Frontend

```typescript
// Crear preferencia de pago
const createSubscription = async (technicianId: number, planType: 'monthly' | 'yearly') => {
  const response = await fetch('/checkouts/create-preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      technicianId,
      planType,
      successUrl: window.location.origin + '/subscription/success',
      failureUrl: window.location.origin + '/subscription/failure',
      pendingUrl: window.location.origin + '/subscription/pending'
    })
  });
  
  const { init_point } = await response.json();
  
  // Redirigir al checkout de MercadoPago
  window.location.href = init_point;
};
```

## Notas Importantes

1. **Ambiente de prueba vs producción:**
   - Usa `sandbox_init_point` para testing
   - Usa `init_point` para producción

2. **Expiración de preferencias:**
   - Las preferencias expiran en 24 horas
   - Después de este tiempo, se debe crear una nueva preferencia

3. **Renovación de suscripciones:**
   - Actualmente las suscripciones no se renuevan automáticamente
   - El técnico debe crear una nueva preferencia cuando expire su membresía
   - Para renovación automática, considera usar [MercadoPago Subscriptions](https://www.mercadopago.com.uy/developers/es/docs/subscriptions)

4. **Moneda:**
   - Configurado para UYU (pesos uruguayos)
   - Modifica `currency_id` en el servicio si necesitas otra moneda
