# 💳 Sistema de Renovación de Suscripciones - ServicioYA

## 📋 Descripción General

Sistema completo de renovación y activación de suscripciones mediante pago por transferencia bancaria. El técnico puede seleccionar un plan, recibir instrucciones de pago, y enviar su comprobante para verificación.

---

## 🎯 Flujo de Renovación

### Paso 1: Selección de Plan
- El técnico hace clic en "Activar/Renovar Suscripción"
- Se muestra un modal con los planes disponibles:
  - **Plan Premium**: $990 / 30 días

### Paso 2: Instrucciones de Pago
- Se muestra la información bancaria completa
- El técnico puede copiar cada dato con un clic
- Instrucciones claras sobre cómo realizar la transferencia

### Paso 3: Confirmación de Pago
- El técnico ingresa:
  - Número de referencia del comprobante
  - Fecha de la transferencia
- Se envía la información para verificación

### Paso 4: Verificación (Backend)
- El equipo de ServicioYA verifica el pago
- Activa la suscripción (24-48 horas hábiles)
- El técnico recibe confirmación por email

---

## 📦 Componentes Creados

### 1. **RenewalModal.tsx**
Modal de 3 pasos para el proceso de renovación

**Props:**
```typescript
interface RenewalModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentMembershipType?: MembershipType;
    onSubmitProof: (proofData: ProofOfPayment) => Promise<void>;
}
```

**Estados:**
- `select`: Selección de plan
- `payment`: Instrucciones de pago
- `proof`: Carga de comprobante

### 2. **membershipApi.ts**
API para gestión de membresías

**Endpoints:**
```typescript
// Enviar comprobante de pago
POST /technicians/:id/membership/proof
{
  membershipType: "PAID",
  transactionReference: "123456789",
  transactionDate: "2025-10-15",
  amount: 990,
  bankAccount: "001-123456-78"
}

// Obtener historial de pagos
GET /technicians/:id/membership/history

// Obtener estado de membresía
GET /technicians/:id/membership/status
```

### 3. **MembershipCard.tsx (Actualizado)**
Ahora incluye botón de renovación

**Nuevo botón:**
- "Activar Suscripción" (si no está activa)
- "Renovar Suscripción" (si está activa)

---

## 🏦 Datos Bancarios

**Configuración actual:**
```typescript
const BANK_ACCOUNT_INFO = {
    bank: "Banco República",
    accountNumber: "001-123456-78",
    accountType: "Caja de Ahorro",
    holder: "ServicioYA S.A.",
    rut: "21.123.456-0001",
};
```

**Para cambiar los datos bancarios:**
Edita el objeto `BANK_ACCOUNT_INFO` en `RenewalModal.tsx` (línea ~50)

---

## 💰 Planes Disponibles

### Plan Premium
- **Precio**: $990 UYU
- **Duración**: 30 días
- **Características**:
  - ✅ Acceso completo a todas las funcionalidades
  - ✅ Reservas ilimitadas
  - ✅ Prioridad en resultados de búsqueda
  - ✅ Soporte prioritario 24/7
  - ✅ Estadísticas detalladas

---

## 🔧 Integración Backend

### Endpoints Necesarios

#### 1. POST /technicians/:id/membership/proof
Recibe el comprobante de pago para verificación

**Request:**
```json
{
  "membershipType": "PAID",
  "transactionReference": "123456789",
  "transactionDate": "2025-10-15",
  "amount": 990,
  "bankAccount": "001-123456-78"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Comprobante recibido. Será verificado en 24-48 horas hábiles",
  "proofId": 123,
  "status": "pending_verification"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error al procesar el comprobante",
  "errors": ["El número de referencia ya fue usado"]
}
```

#### 2. GET /technicians/:id/membership/history
Retorna el historial de pagos del técnico

**Response:**
```json
{
  "payments": [
    {
      "id": 123,
      "membershipType": "PAID",
      "amount": 990,
      "transactionReference": "123456789",
      "transactionDate": "2025-10-15",
      "status": "verified", // "pending_verification" | "verified" | "rejected"
      "verifiedAt": "2025-10-16T10:30:00Z",
      "createdAt": "2025-10-15T14:20:00Z"
    }
  ]
}
```

#### 3. GET /technicians/:id/membership/status
Retorna el estado actual de la membresía

**Response:**
```json
{
  "membershipType": "PAID",
  "membershipActive": true,
  "membershipExpiresAt": "2025-11-15T23:59:59Z",
  "daysRemaining": 31,
  "pendingVerifications": 0
}
```

---

## 📊 Base de Datos

### Tabla: membership_proofs

```sql
CREATE TABLE membership_proofs (
  id SERIAL PRIMARY KEY,
  technician_id INTEGER REFERENCES technicians(id),
  membership_type VARCHAR(10) NOT NULL, -- 'TRIAL' | 'PAID'
  transaction_reference VARCHAR(100) UNIQUE NOT NULL,
  transaction_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  bank_account VARCHAR(50) NOT NULL,
  status VARCHAR(30) DEFAULT 'pending_verification', -- 'pending_verification' | 'verified' | 'rejected'
  verified_by INTEGER REFERENCES admins(id),
  verified_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_technician_proofs ON membership_proofs(technician_id);
CREATE INDEX idx_proof_status ON membership_proofs(status);
CREATE UNIQUE INDEX idx_transaction_ref ON membership_proofs(transaction_reference);
```

---

## 🎨 Personalización

### Cambiar Precios de Planes

```typescript
// En RenewalModal.tsx
const MEMBERSHIP_PLANS = {
    PAID: {
        name: "Plan Premium",
        price: 990,  // ← Cambiar aquí
        duration: "30 días",
        // ...
    },
};
```

### Agregar Nuevo Plan

```typescript
const MEMBERSHIP_PLANS = {
    // ... planes existentes
    YEARLY: {
        name: "Plan Anual",
        price: 9900,
        duration: "365 días",
        icon: Trophy,
        color: "purple",
        features: [
            "Todas las características Premium",
            "2 meses gratis",
            "Descuento del 20%",
        ],
    },
};
```

### Cambiar Tiempo de Verificación

```typescript
// En RenewalModal.tsx (líneas ~230, ~320)
"Tu suscripción será activada una vez verificado el pago (24-48 horas hábiles)"
// Cambiar por el tiempo que prefieras
```

---

## 🔔 Notificaciones

### Email al Técnico (Comprobante Recibido)
```
Asunto: Comprobante de Pago Recibido - ServicioYA

Hola [Nombre],

Hemos recibido tu comprobante de pago para el Plan Premium.

Detalles:
- Plan: Premium
- Monto: $990
- Referencia: 123456789
- Fecha: 15 de octubre de 2025

Nuestro equipo verificará tu pago en un plazo de 24-48 horas hábiles.
Te notificaremos por email cuando tu suscripción sea activada.

Gracias por confiar en ServicioYA.
```

### Email al Técnico (Pago Verificado)
```
Asunto: ¡Suscripción Activada! - ServicioYA

Hola [Nombre],

¡Buenas noticias! Tu pago ha sido verificado y tu suscripción Premium está ahora activa.

Detalles:
- Plan: Premium
- Válida hasta: 15 de noviembre de 2025
- Días restantes: 30

Ya puedes disfrutar de todas las características premium:
✓ Reservas ilimitadas
✓ Prioridad en búsquedas
✓ Soporte 24/7

¡Que tengas mucho éxito!
```

### Email al Admin (Nuevo Comprobante)
```
Asunto: Nuevo Comprobante de Pago - ServicioYA Admin

Nuevo comprobante pendiente de verificación:

Técnico: [Nombre] (ID: 123)
Plan: Premium
Monto: $990
Referencia: 123456789
Fecha de transferencia: 15/10/2025
Enviado: 15/10/2025 14:20

[Ver en Panel de Admin]
```

---

## 🧪 Testing

### Probar el Flujo Completo

1. **Como Técnico:**
```bash
# Iniciar sesión como técnico
# Ir al dashboard
# Hacer clic en "Activar Suscripción"
# Completar los 3 pasos del modal
```

2. **Como Admin (Backend):**
```bash
# Verificar que el comprobante llegó a la BD
SELECT * FROM membership_proofs WHERE status = 'pending_verification';

# Aprobar el comprobante
UPDATE membership_proofs SET status = 'verified', verified_at = NOW() WHERE id = 123;
UPDATE technicians SET 
    membership_type = 'PAID',
    membership_active = TRUE,
    membership_expires_at = NOW() + INTERVAL '30 days'
WHERE id = 123;
```

3. **Verificar en Frontend:**
```bash
# El card de membresía debe actualizarse
# Debe mostrar "Premium" activa
# Debe mostrar fecha de expiración
```

---

## 📱 UI/UX

### Botón de Renovación

**Estados:**
- **Sin suscripción**: Botón dorado "Activar Suscripción"
- **Suscripción activa**: Botón gris "Renovar Suscripción"
- **Por vencer**: Botón pulsante con animación

### Modal

**Características:**
- Responsive (móvil y desktop)
- 3 pasos claramente diferenciados
- Botón de copiar en datos bancarios
- Validación de formulario
- Loading states

---

## 🔒 Seguridad

### Validaciones

1. **Frontend:**
   - Referencia de transacción requerida
   - Fecha no puede ser futura
   - Monto debe coincidir con el plan

2. **Backend:**
   - Referencia única (no duplicada)
   - Técnico autenticado
   - Validar que el monto sea correcto
   - Rate limiting (máx 5 intentos por hora)

---

## 📈 Métricas a Trackear

- Conversión de activaciones
- Tiempo promedio de verificación
- Tasa de rechazo de comprobantes
- Renovaciones automáticas vs manuales
- Métodos de pago más usados

---

## 🚀 Próximas Mejoras

- [ ] Upload de imagen del comprobante
- [ ] Integración con pasarela de pago (MercadoPago, PayPal)
- [ ] Renovación automática con tarjeta guardada
- [ ] Descuentos por pago anual
- [ ] Sistema de referidos
- [ ] Panel de admin para aprobar/rechazar comprobantes
- [ ] Historial de pagos visible para el técnico
- [ ] Facturas electrónicas automáticas

---

## 📝 Changelog

### v1.0.0 (Octubre 2025)
- ✅ Sistema de renovación por transferencia bancaria
- ✅ Modal de 3 pasos
- ✅ Validación de formularios
- ✅ API endpoints documentados
- ✅ Integración con MembershipCard
- ✅ Notificaciones con Snackbar
- ✅ Logging para debugging

---

**Desarrollado con ❤️ para ServicioYA**
