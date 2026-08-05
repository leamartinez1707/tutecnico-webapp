# ✅ Checklist de Verificación - Sistema de Membresías

## 📋 Verificaciones de Integración

### 1. **Backend - Datos Esperados**

El backend debe retornar estos campos en el endpoint del técnico:

```json
{
  "id": 1,
  "username": "juan_plomero",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "technician": {
    "id": 1,
    "latitude": "-34.9011",
    "longitude": "-56.1645",
    "services": ["Plomería", "Electricidad"],
    "specialization": "Plomero",
    "membershipType": "PAID",        // ← DEBE EXISTIR
    "membershipActive": true,         // ← DEBE EXISTIR
    "membershipExpiresAt": "2025-12-31T23:59:59.000Z" // ← DEBE EXISTIR
  }
}
```

---

### 2. **Frontend - Verificación Visual**

#### ✓ En el Dashboard del Técnico debe aparecer:

1. **Card de Membresía** arriba de las cards de información personal
2. **Colores correctos** según el tipo:
   - Gris = Sin suscripción
   - Azul = Periodo de prueba
   - Dorado = Premium

3. **Información visible:**
   - Título del tipo de membresía
   - Badge de estado (Inactiva/Prueba/Premium)
   - Fecha de expiración (si está activa)
   - Días restantes (si está activa)

---

### 3. **Debugger de Desarrollo**

En **modo desarrollo**, debes ver un panel flotante en la esquina inferior derecha con:

```
🔍 Membership Debug
Type: PAID
Active: ✓ true
Expires: 2025-12-31T23:59:59.000Z
```

**Si NO aparece el debugger:**
- Verifica que estés en modo desarrollo (`npm run dev`)
- Verifica que no haya errores en la consola

**Si aparece pero muestra "undefined":**
- El backend no está retornando los campos de membresía
- Verifica la respuesta del API en la pestaña Network del navegador

---

### 4. **Casos de Prueba**

#### Caso 1: Sin Suscripción
```json
{
  "membershipType": "NONE",
  "membershipActive": false,
  "membershipExpiresAt": null
}
```
**Resultado esperado:**
- Card gris con icono ⚠️
- Badge "Inactiva"
- Mensaje motivacional

---

#### Caso 2: Periodo de Prueba Activo
```json
{
  "membershipType": "TRIAL",
  "membershipActive": true,
  "membershipExpiresAt": "2025-11-15T23:59:59.000Z"
}
```
**Resultado esperado:**
- Card azul con icono ✨
- Badge "Prueba"
- Fecha de expiración visible
- Contador de días

---

#### Caso 3: Premium Activa
```json
{
  "membershipType": "PAID",
  "membershipActive": true,
  "membershipExpiresAt": "2026-10-15T23:59:59.000Z"
}
```
**Resultado esperado:**
- Card dorada con icono 👑
- Badge "Premium"
- Fecha de expiración visible
- Contador de días

---

#### Caso 4: Premium por Vencer (≤7 días)
```json
{
  "membershipType": "PAID",
  "membershipActive": true,
  "membershipExpiresAt": "2025-10-20T23:59:59.000Z"
}
```
**Resultado esperado:**
- Card dorada con icono 👑
- Badge "Premium"
- **Alerta roja** "⚠️ Vence pronto"
- Fecha en rojo
- Contador de días en rojo

---

### 5. **Verificación de Consola**

Abre la consola del navegador (F12) y busca:

```
[DEBUG] MembershipCard datos recibidos {
  membershipType: "PAID",
  membershipActive: true,
  membershipExpiresAt: "2025-12-31T23:59:59.000Z"
}
```

**Si no ves estos logs:**
- Los datos no están llegando al componente
- Verifica la estructura de `technician.technician` en el contexto

---

### 6. **Checklist de Funcionalidad**

- [ ] El card de membresía aparece en el dashboard
- [ ] Los colores cambian según el tipo (gris/azul/dorado)
- [ ] El badge muestra el estado correcto
- [ ] La fecha se muestra en español (ej: "15 de octubre de 2025")
- [ ] El contador de días funciona correctamente
- [ ] Aparece alerta roja cuando quedan ≤7 días
- [ ] El debugger muestra los datos correctos (solo en dev)
- [ ] No hay errores en la consola del navegador
- [ ] El componente no rompe si faltan datos opcionales

---

### 7. **Troubleshooting**

#### Problema: El card no aparece
**Posibles causas:**
1. El usuario no es un técnico (`user.technician` es undefined)
2. Error de compilación - revisa la consola
3. El componente no está importado en DashboardUI

**Solución:**
```bash
# Reinicia el servidor de desarrollo
npm run dev
```

---

#### Problema: Muestra "undefined" en todos los campos
**Posibles causas:**
1. Backend no retorna los campos de membresía
2. La estructura del objeto técnico es diferente

**Solución:**
1. Verifica la respuesta del API en Network tab
2. Revisa que el endpoint retorne `technician.membershipType`, etc.

---

#### Problema: La fecha no se formatea correctamente
**Posibles causas:**
1. El formato de fecha del backend no es ISO 8601
2. La fecha es null o undefined

**Solución:**
- El backend debe enviar formato ISO 8601: `"2025-12-31T23:59:59.000Z"`
- NO usar: `"2025-12-31"` o timestamps numéricos

---

#### Problema: Los colores no se ven
**Posibles causas:**
1. Tailwind no está compilando las clases
2. Conflicto con otros estilos

**Solución:**
```bash
# Limpia la caché y reinicia
rm -rf node_modules/.vite
npm run dev
```

---

### 8. **Verificación Final**

Ejecuta esta secuencia:

1. ✓ Inicia sesión como técnico
2. ✓ Ve al dashboard (`/panel/tecnico`)
3. ✓ Verifica que aparezca el card de membresía
4. ✓ Abre la consola (F12) y busca logs de debug
5. ✓ Verifica el panel de debug flotante (solo en dev)
6. ✓ Confirma que los datos coincidan con el backend

---

### 9. **Producción**

Antes de pasar a producción:

1. **Remover el debugger:**
   ```tsx
   // En DashboardUI.tsx, comentar o eliminar:
   // <MembershipDebugger />
   ```

2. **Verificar logs:**
   - Los logs solo deben aparecer en desarrollo
   - `logger.debug()` no mostrará nada en producción

3. **Testing en diferentes navegadores:**
   - Chrome
   - Firefox
   - Safari (si aplica)
   - Mobile (responsive)

---

## 🎯 Resultado Esperado Final

Cuando todo funcione correctamente:

1. ✅ Card visible en el dashboard
2. ✅ Datos correctos del backend
3. ✅ UI responsive y funcional
4. ✅ Sin errores en consola
5. ✅ Debugger solo en desarrollo
6. ✅ Fechas en español
7. ✅ Alertas de vencimiento funcionando

---

## 📞 Soporte

Si algo no funciona:

1. Revisa la consola del navegador (F12)
2. Verifica el Network tab para ver la respuesta del API
3. Revisa los logs del debugger flotante
4. Compara con los ejemplos de mock data en `membershipMockData.ts`

---

**Última actualización:** Octubre 2025
