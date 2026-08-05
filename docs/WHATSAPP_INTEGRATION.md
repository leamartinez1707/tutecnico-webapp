# Integración de WhatsApp - TechFinderUY

## 📱 Visión General

Sistema de comunicación directa entre usuarios y técnicos mediante WhatsApp cuando una reserva es **Aceptada** o **Completada**.

## 🎯 Objetivo

Facilitar la comunicación rápida y efectiva entre:
- **Usuario → Técnico**: Para coordinar detalles del servicio
- **Técnico → Usuario**: Para confirmar visita y dar seguimiento

## 🔧 Implementación

### Componente WhatsAppButton (`src/components/ui/WhatsAppButton.tsx`)

Componente reutilizable que genera enlaces de WhatsApp con mensajes personalizados.

#### Características:

✅ **Formateo automático de números**
- Agrega código de país (+598) si no está presente
- Limpia caracteres no numéricos
- Valida longitud mínima (8 dígitos)

✅ **Mensajes personalizados**
- Incluye nombre del destinatario
- Referencia al número de reserva
- Fecha de la reserva
- Contexto de TechFinder Uruguay

✅ **Responsive y accesible**
- Tamaños variables (sm, default, lg)
- Variantes de estilo (default, outline, ghost)
- Opción de mostrar texto o solo ícono
- Previene propagación de eventos (stopPropagation)

#### Props del Componente:

```typescript
interface WhatsAppButtonProps {
  phoneNumber: string;        // Requerido: Número de teléfono
  message?: string;           // Opcional: Mensaje personalizado
  userName?: string;          // Opcional: Nombre del destinatario
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  showText?: boolean;         // Mostrar "WhatsApp" junto al ícono
  className?: string;         // Clases CSS adicionales
}
```

#### Ejemplo de uso:

```tsx
<WhatsAppButton
  phoneNumber={booking.user.phone}
  userName={`${booking.user.firstName} ${booking.user.lastName}`}
  message="Hola, soy Juan. Te contacto por la reserva #123."
  size="sm"
  showText={false}
/>
```

## 📍 Ubicaciones del Botón

### 1. Tabla de Reservas (`BookingRow.tsx`)

**Cuándo aparece:**
- Estado: `Aceptado` o `Completado`
- Para usuarios y técnicos

**Mensaje generado:**
```
Hola [Nombre], soy [Usuario Actual]. Te contacto por la reserva #[ID] del [Fecha].
```

**Ubicación visual:**
- En la columna de "Acciones"
- Entre el botón "Ver detalles" y otros botones de estado
- Ícono pequeño de MessageCircle verde

### 2. Modal de Detalles (`BookingSelected.tsx`)

**Cuándo aparece:**
- Estado: `Aceptado` o `Completado`
- En la parte inferior del modal, junto al botón "Cerrar"

**Características especiales:**
- Botón más prominente con texto "WhatsApp"
- Tamaño `default` (más grande que en la tabla)
- Incluye contexto completo de la reserva en el mensaje

## 🎨 Estilos Visuales

### Paleta de colores:
- **Verde WhatsApp**: `#25D366` (aproximado con green-600)
- **Border**: `green-200`
- **Hover**: `green-50` background, `green-700` text

### Estados:
- **Normal**: Borde verde, texto verde, fondo blanco
- **Hover**: Fondo verde claro, texto verde oscuro
- **Oculto**: No se renderiza si no hay número válido

## 🔐 Validaciones de Seguridad

### Validación de número de teléfono:

```typescript
// Limpieza de caracteres no numéricos
const cleanPhone = phoneNumber?.replace(/\D/g, '') || '';

// Validación de longitud mínima
if (!cleanPhone || cleanPhone.length < 8) {
  return null; // No renderiza el botón
}

// Formato para Uruguay
const formattedPhone = cleanPhone.startsWith('598') 
  ? cleanPhone 
  : `598${cleanPhone}`;
```

### Prevención de XSS:

```typescript
// Codificación del mensaje para URL
const encodedMessage = encodeURIComponent(whatsappMessage);
```

### Apertura segura:

```typescript
// Previene phishing con rel="noopener noreferrer"
<a 
  href={whatsappUrl} 
  target="_blank" 
  rel="noopener noreferrer"
>
```

## 📊 Flujo de Interacción

```
┌─────────────────────────────────┐
│ Usuario solicita servicio       │
│ Estado: Pendiente               │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Técnico acepta la reserva       │
│ Estado: Aceptado                │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ ✅ Botón WhatsApp APARECE       │
│ Usuario y Técnico pueden        │
│ comunicarse directamente        │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Click en botón WhatsApp         │
│ Abre chat con mensaje pre-      │
│ cargado en WhatsApp Web/App     │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Usuario y Técnico coordinan     │
│ detalles del servicio           │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Técnico completa el servicio    │
│ Estado: Completado              │
│ ✅ Botón WhatsApp SIGUE VISIBLE │
└─────────────────────────────────┘
```

## 🌐 Formato de URL de WhatsApp

### Estructura:
```
https://wa.me/[PHONE_NUMBER]?text=[ENCODED_MESSAGE]
```

### Ejemplo real:
```
https://wa.me/59891234567?text=Hola%20Juan%2C%20soy%20Mar%C3%ADa.%20Te%20contacto%20por%20la%20reserva%20%23123%20del%2021%2F11%2F2025.
```

### Decodificado:
```
Hola Juan, soy María. Te contacto por la reserva #123 del 21/11/2025.
```

## 📱 Compatibilidad

### Escritorio:
- ✅ Abre WhatsApp Web si está logueado
- ✅ Redirige a web.whatsapp.com si no está logueado
- ✅ Opción de abrir WhatsApp Desktop si está instalado

### Móvil:
- ✅ Abre la app de WhatsApp directamente
- ✅ Mensaje pre-cargado listo para enviar
- ✅ Funciona en iOS y Android

### Navegadores:
- ✅ Chrome, Firefox, Safari, Edge
- ✅ Navegadores móviles

## 🎯 Casos de Uso

### Para Usuarios:

1. **Confirmar horario exacto**
   ```
   "Hola, ¿podemos confirmar que vienes mañana a las 10:00?"
   ```

2. **Consultar antes del servicio**
   ```
   "¿Necesitas que tenga algún material listo?"
   ```

3. **Compartir ubicación exacta**
   ```
   "Te envío el pin de mi ubicación para que llegues más fácil"
   ```

### Para Técnicos:

1. **Confirmar visita**
   ```
   "Hola, confirmando que mañana estaré a las 14:00"
   ```

2. **Avisar retrasos**
   ```
   "Disculpa, voy con 15 minutos de retraso"
   ```

3. **Solicitar información adicional**
   ```
   "¿Qué marca es el electrodoméstico que necesita reparación?"
   ```

## 🔄 Estados de Reserva y Visibilidad

| Estado | Botón WhatsApp |
|--------|----------------|
| **Pendiente** | ❌ No visible |
| **Aceptado** | ✅ Visible |
| **Completado** | ✅ Visible |
| **Rechazado** | ❌ No visible |

## 🚀 Mejoras Futuras

### Posibles extensiones:

1. **Plantillas de mensajes**
   - Dropdown con mensajes predefinidos
   - "¿A qué hora llegas?"
   - "¿Cuál es tu ubicación exacta?"
   - "¿Qué materiales necesito tener?"

2. **Historial de comunicación**
   - Registrar que se abrió el chat de WhatsApp
   - Timestamp de último contacto
   - Indicador visual "Contactado"

3. **Recordatorios automáticos**
   - Notificación para contactar 24h antes del servicio
   - Sugerencia de confirmar asistencia

4. **Botón de emergencia**
   - Para cancelaciones de último momento
   - Mensaje urgente predefinido

5. **Multi-idioma**
   - Mensajes en inglés/portugués para técnicos extranjeros
   - Detección automática de idioma preferido

## 📊 Métricas Sugeridas

### KPIs a monitorear:

- **Tasa de uso**: % de reservas aceptadas donde se usa WhatsApp
- **Tiempo de respuesta**: Tiempo entre aceptación y primer contacto
- **Satisfacción**: Correlación entre uso de WhatsApp y reseñas positivas
- **Tasa de completación**: % de reservas completadas con vs sin uso de WhatsApp

## ⚠️ Consideraciones Importantes

### Privacidad:
- ✅ El número de teléfono ya está en la base de datos
- ✅ Solo se comparte entre partes de una reserva activa
- ❌ No se guarda historial de mensajes de WhatsApp
- ❌ TechFinder no tiene acceso a las conversaciones

### Limitaciones:
- El botón solo crea el enlace de WhatsApp
- El usuario debe tener WhatsApp instalado
- No hay confirmación de que el mensaje fue enviado
- No hay integración con API de WhatsApp Business

### Legal:
- Los usuarios deben dar consentimiento para compartir su teléfono
- Incluir en términos y condiciones el uso de WhatsApp
- GDPR/protección de datos: número usado solo para coordinación de servicios

## 🛠️ Testing

### Casos a testear:

1. **Números válidos**
   - ✅ Con código de país (598...)
   - ✅ Sin código de país (91234567)
   - ✅ Con espacios/guiones

2. **Números inválidos**
   - ❌ Vacío o undefined
   - ❌ Menos de 8 dígitos
   - ❌ Caracteres no numéricos

3. **Mensajes**
   - ✅ Con caracteres especiales (á, é, í, ñ)
   - ✅ Con emojis
   - ✅ Mensaje largo

4. **Estados**
   - ✅ Visible en "Aceptado"
   - ✅ Visible en "Completado"
   - ❌ No visible en "Pendiente"
   - ❌ No visible en "Rechazado"

---

**Última actualización:** Noviembre 21, 2025  
**Mantenedor:** Equipo de Desarrollo TechFinderUY
