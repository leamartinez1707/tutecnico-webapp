# Sistema de Internacionalización (i18n)

## 🌍 Descripción
TechFinderUY implementa **react-i18next** para soporte multiidioma, permitiendo traducir automáticamente todos los mensajes de la aplicación entre Español e Inglés.

## 📦 Instalación
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

## 🚀 Configuración
La configuración se encuentra en [`src/config/i18n.ts`](../src/config/i18n.ts) y se importa automáticamente en [`src/main.tsx`](../src/main.tsx).

### Características:
- ✅ **Detección automática** del idioma del navegador
- ✅ **Persistencia** de la preferencia del usuario en localStorage
- ✅ **Idioma por defecto**: Español (es)
- ✅ **Idiomas soportados**: Español (es), Inglés (en)

## 📁 Estructura de Archivos de Traducción
```
public/locales/
  ├── es/
  │   └── translation.json   # Traducciones en español
  └── en/
      └── translation.json   # Traducciones en inglés
```

## 🔧 Uso en Componentes

### Hook useTranslation
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.loading')}</h1>
      <button>{t('common.save')}</button>
    </div>
  );
}
```

### Con interpolación de variables
```tsx
const { t } = useTranslation();

// En translation.json: "rateLimitWait": "Espera {{seconds}} segundos"
<p>{t('errors.rateLimitWait', { seconds: 30 })}</p>
// Resultado: "Espera 30 segundos"
```

### Cambiar idioma dinámicamente
```tsx
import { useTranslation } from 'react-i18next';

function LanguageButton() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <button onClick={() => changeLanguage('en')}>
      Switch to English
    </button>
  );
}
```

## 🎨 Componente Selector de Idioma
Se proporciona un componente [`LanguageSelector`](../src/components/LanguageSelector.tsx) listo para usar:

```tsx
import LanguageSelector from './components/LanguageSelector';

function Header() {
  return (
    <nav>
      <LanguageSelector />
    </nav>
  );
}
```

## 📝 Uso en Utilidades (sin hooks)
Para usar traducciones fuera de componentes React (utilidades, helpers):

```typescript
import i18n from '../config/i18n';

// Usar i18n.t() directamente
const errorMessage = i18n.t('errors.networkError');
```

**Ejemplo real**: [`src/utils/errorHandler.ts`](../src/utils/errorHandler.ts)

## 🔑 Claves de Traducción Disponibles

### Errores (`errors.*`)
```typescript
t('errors.invalidData')
t('errors.unauthorized')
t('errors.forbidden')
t('errors.notFound')
t('errors.conflict')
t('errors.serverError')
t('errors.networkError')
t('errors.unexpectedError')
t('errors.rateLimitWait', { seconds: 30 })
```

### Comunes (`common.*`)
```typescript
t('common.loading')
t('common.save')
t('common.cancel')
t('common.delete')
t('common.edit')
t('common.search')
t('common.filter')
```

### Autenticación (`auth.*`)
```typescript
t('auth.login')
t('auth.logout')
t('auth.register')
t('auth.email')
t('auth.password')
```

## ➕ Agregar Nuevas Traducciones

1. Añadir la clave en ambos archivos JSON:

**`public/locales/es/translation.json`:**
```json
{
  "booking": {
    "confirm": "Confirmar reserva",
    "cancel": "Cancelar reserva"
  }
}
```

**`public/locales/en/translation.json`:**
```json
{
  "booking": {
    "confirm": "Confirm booking",
    "cancel": "Cancel booking"
  }
}
```

2. Usar en el código:
```tsx
<button>{t('booking.confirm')}</button>
```

## 🌐 Idioma del Usuario
El idioma se detecta en este orden:
1. **Preferencia guardada** en localStorage
2. **Idioma del navegador**
3. **Fallback**: Español (es)

## 🧪 Testing
Para pruebas, puedes mockear i18n:

```typescript
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: jest.fn() }
  })
}));
```

## 📚 Recursos
- [react-i18next docs](https://react.i18next.com/)
- [i18next docs](https://www.i18next.com/)

## ✅ Migrando Código Existente

Para migrar strings hardcodeados:

**Antes:**
```tsx
<button>Guardar cambios</button>
```

**Después:**
```tsx
const { t } = useTranslation();
<button>{t('common.save')}</button>
```

**Nota**: Los mensajes del **backend** (NestJS) se mantienen en español por ahora. Para traducir mensajes del backend, habría que implementar i18n en NestJS también.
