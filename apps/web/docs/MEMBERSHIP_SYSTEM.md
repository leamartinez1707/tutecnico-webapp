# Sistema de Membresías - ServicioYA

## 📋 Descripción

Sistema de visualización del estado de suscripción para técnicos en el dashboard. Muestra información sobre el tipo de membresía, estado activo/inactivo y fecha de expiración.

---

## 🎨 Tipos de Membresía

### 1. **NONE** - Sin Suscripción
- **Color:** Gris
- **Icono:** AlertCircle
- **Estado:** Inactiva
- **Descripción:** El técnico no tiene ninguna suscripción activa

### 2. **TRIAL** - Periodo de Prueba
- **Color:** Azul
- **Icono:** Sparkles ✨
- **Estado:** Activa (temporal)
- **Descripción:** Periodo de prueba gratuito
- **Duración típica:** 14-30 días

### 3. **PAID** - Suscripción Premium
- **Color:** Dorado/Ámbar 👑
- **Icono:** Crown
- **Estado:** Activa
- **Descripción:** Suscripción pagada con acceso completo
- **Duración típica:** Mensual/Anual

---

## 📦 Estructura de Datos

### Type Definition

```typescript
// src/types/membership.ts
export type MembershipType = 'NONE' | 'TRIAL' | 'PAID';

// src/types/index.ts
export type Technician = {
    id: number;
    latitude: string;
    longitude: string;
    services: string[];
    specialization: string;
    membershipType?: MembershipType;      // Tipo de membresía
    membershipActive?: boolean;            // Estado activo/inactivo
    membershipExpiresAt?: string;         // Fecha de expiración ISO 8601
}
```

### Ejemplo de Respuesta del Backend

```json
{
  "id": 1,
  "latitude": "-34.9011",
  "longitude": "-56.1645",
  "services": ["Plomería", "Electricidad"],
  "specialization": "Plomero",
  "membershipType": "PAID",
  "membershipActive": true,
  "membershipExpiresAt": "2025-12-31T23:59:59.000Z"
}
```

---

## 🚀 Uso del Componente

### Básico

```tsx
import MembershipCard from "@/components/technician/MembershipCard";

<MembershipCard 
    membershipType="PAID"
    membershipActive={true}
    membershipExpiresAt="2025-12-31T23:59:59.000Z"
/>
```

### Con datos del técnico

```tsx
import MembershipCard from "@/components/technician/MembershipCard";
import { useAuth } from "@/context/AuthContext";

const DashboardUI = () => {
    const { user } = useAuth();
    const technician = user?.technician;

    return (
        <MembershipCard 
            membershipType={technician?.membershipType}
            membershipActive={technician?.membershipActive}
            membershipExpiresAt={technician?.membershipExpiresAt}
        />
    );
};
```

---

## 🎯 Características

### 1. **Indicador Visual de Estado**
- Badge de color según el tipo de membresía
- Iconos diferenciados por tipo
- Colores de fondo adaptativos

### 2. **Información de Expiración**
- Fecha formateada en español (Uruguay)
- Contador de días restantes
- **Alerta visual** cuando faltan ≤ 7 días

### 3. **Estados Especiales**

#### ⚠️ Por Vencer (≤ 7 días)
```tsx
{
  membershipType: "PAID",
  membershipActive: true,
  membershipExpiresAt: "2025-10-20T23:59:59.000Z" // 5 días restantes
}
```
- Fondo rojo claro
- Borde rojo
- Mensaje de advertencia

#### ❌ Sin Suscripción
```tsx
{
  membershipType: "NONE",
  membershipActive: false
}
```
- Mensaje motivacional
- Call-to-action para activar suscripción

---

## 🧪 Testing con Mock Data

```typescript
import { membershipExamples } from "@/components/technician/membershipMockData";

// Sin suscripción
<MembershipCard {...membershipExamples.noSubscription} />

// Prueba activa
<MembershipCard {...membershipExamples.trialActive} />

// Premium activa
<MembershipCard {...membershipExamples.premiumActive} />

// Por vencer
<MembershipCard {...membershipExamples.expiringSoon} />

// Prueba expirada
<MembershipCard {...membershipExamples.trialExpired} />
```

---

## 🔧 Integración con Backend

### Endpoints Necesarios

```typescript
// GET /technicians/:id
// Response debe incluir:
{
  "membershipType": "PAID" | "TRIAL" | "NONE",
  "membershipActive": boolean,
  "membershipExpiresAt": "ISO 8601 string" | null
}
```

### Actualización de Datos

El backend debe actualizar automáticamente:
- `membershipActive = false` cuando `membershipExpiresAt < now()`
- `membershipType = 'NONE'` al expirar

---

## 📱 Responsive Design

- **Móvil:** Card ocupa todo el ancho
- **Tablet:** Se adapta al grid del dashboard
- **Desktop:** Máximo ancho para mejor lectura

---

## 🎨 Personalización

### Colores por Tipo

```typescript
// NONE / Inactiva
bg-gray-50 border-gray-300 text-gray-400

// TRIAL
bg-blue-50 border-blue-300 text-blue-600

// PAID
bg-gradient-to-br from-amber-50 to-yellow-50 
border-amber-300 text-amber-600
```

### Modificar Días de Alerta

```typescript
// En MembershipCard.tsx, línea ~60
const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
// Cambiar 7 por el número de días deseado
```

---

## 📊 Próximas Mejoras

- [ ] Botón para renovar/actualizar suscripción
- [ ] Historial de pagos
- [ ] Comparación de planes
- [ ] Notificaciones push antes de expirar
- [ ] Integración con pasarela de pago

---

## 🐛 Troubleshooting

### La fecha no se muestra correctamente
- Verificar que `membershipExpiresAt` esté en formato ISO 8601
- Ejemplo correcto: `"2025-12-31T23:59:59.000Z"`

### El componente no aparece
- Verificar que el técnico tenga datos de membresía en el objeto
- Revisar consola para errores de importación

### Los colores no se ven
- Verificar que Tailwind esté compilando las clases dinámicas
- Agregar clases al safelist si es necesario

---

## 📝 Changelog

### v1.0.0 (Octubre 2025)
- ✅ Componente MembershipCard creado
- ✅ Tipos de membresía definidos
- ✅ Integración con DashboardUI
- ✅ Sistema de alertas por vencimiento
- ✅ Mock data para testing
- ✅ Documentación completa

---

## 👥 Contribuir

Para agregar nuevos tipos de membresía:

1. Actualizar `src/types/membership.ts`
2. Agregar caso en `getMembershipStyle()` en `MembershipCard.tsx`
3. Actualizar documentación
4. Agregar ejemplo en `membershipMockData.ts`
