# Configuración de Fotos de Perfil con Cloudinary

## Descripción

Los usuarios y técnicos pueden subir fotos de perfil que se almacenan en Cloudinary. Las fotos se muestran en:
- Dashboard del técnico
- Cards de técnicos en el mapa
- Modal de detalles del técnico
- Perfil de usuario
- Lista de favoritos

## Configuración

### 1. Crear cuenta en Cloudinary

1. Ve a [Cloudinary](https://cloudinary.com/) y crea una cuenta gratuita
2. En el dashboard, copia tu **Cloud Name**

### 2. Crear Upload Preset

1. Ve a Settings > Upload
2. Scroll hasta "Upload presets"
3. Haz clic en "Add upload preset"
4. Configura:
   - **Preset name**: `techfinder_profiles` (o el nombre que prefieras)
   - **Signing Mode**: **Unsigned** (importante para uploads desde el frontend)
   - **Folder**: `techfinder/profiles`
   - **Format**: Auto
   - **Resource type**: Image
   - **Access mode**: Public
5. Guarda el preset

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (basándote en `.env.example`):

```env
VITE_API_URL=http://localhost:4000/api/
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=techfinder_profiles
```

## Estructura de Archivos

### Componentes Principales

```
src/
├── components/
│   └── ui/
│       ├── UserAvatar.tsx          # Avatar reutilizable con foto/iniciales
│       └── ProfilePhotoUpload.tsx  # Componente de upload con preview
├── api/
│   └── usersApi.ts                 # API calls para actualizar foto
├── context/
│   └── UsersContext.tsx            # Context con funciones de foto
└── types/
    └── index.ts                    # Tipos actualizados con profilePhotoUrl
```

### Componentes Actualizados

Los siguientes componentes fueron actualizados para mostrar fotos de perfil:

- `DashboardUI.tsx` - Dashboard del técnico
- `MapTechCard.tsx` - Cards en el mapa
- `TechCard.tsx` - Cards de favoritos
- `TechnicianModal.tsx` - Modal de detalles
- `BasicInformation.tsx` - Perfil de usuario

## Uso

### Upload desde Dashboard (Técnico)

```tsx
import ProfilePhotoUpload from '@/components/ui/ProfilePhotoUpload';
import { useUsers } from '@/context/UsersContext';

const { updateProfilePhoto, removeProfilePhoto } = useUsers();

<ProfilePhotoUpload
  currentPhotoUrl={user.profilePhotoUrl}
  firstName={user.firstName}
  lastName={user.lastName}
  onUpload={updateProfilePhoto}
  onRemove={removeProfilePhoto}
/>
```

### Mostrar Avatar

```tsx
import UserAvatar from '@/components/ui/UserAvatar';

<UserAvatar
  photoUrl={user.profilePhotoUrl}
  firstName={user.firstName}
  lastName={user.lastName}
  size="md" // 'sm' | 'md' | 'lg' | 'xl'
  fallbackBgColor="bg-blue-600"
/>
```

## Validaciones

El componente `ProfilePhotoUpload` valida:

- ✅ Tipo de archivo (solo imágenes)
- ✅ Tamaño máximo: 5MB
- ✅ Formatos soportados: JPG, PNG, GIF

## Flujo de Upload

1. Usuario selecciona imagen
2. Validación en frontend
3. Upload directo a Cloudinary (sin pasar por backend)
4. Cloudinary retorna URL segura
5. URL se guarda en base de datos vía API
6. Actualización del contexto de usuario
7. Re-render automático en todos los componentes

## API Endpoints

### Actualizar Foto de Perfil

```typescript
PATCH /users/:userId
Body: { profilePhotoUrl: string }
```

### Eliminar Foto de Perfil

```typescript
PATCH /users/:userId
Body: { profilePhotoUrl: null }
```

## Optimizaciones de Cloudinary

Puedes usar transformaciones en las URLs:

```typescript
// Imagen optimizada para avatar pequeño
const smallAvatar = photoUrl.replace('/upload/', '/upload/w_100,h_100,c_fill,g_face/');

// Imagen optimizada para card
const cardImage = photoUrl.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto/');
```

## Troubleshooting

### Error: "Upload preset not found"

- Verifica que el preset esté configurado como **Unsigned**
- Confirma que el nombre del preset en `.env` coincida con Cloudinary

### Error: "Invalid cloud name"

- Verifica que `VITE_CLOUDINARY_CLOUD_NAME` esté correctamente configurado
- No incluyas espacios ni caracteres especiales

### La imagen no se muestra

- Verifica que la URL esté guardada correctamente en la base de datos
- Comprueba la consola del navegador para errores de CORS
- Asegúrate de que el Access Mode del preset sea "Public"

## Seguridad

- ✅ Upload directo a Cloudinary (no consume ancho de banda del servidor)
- ✅ Validaciones en frontend
- ✅ Preset unsigned solo para carpeta específica
- ⚠️ **Recomendación**: Implementar límites de rate limiting en el backend para prevenir abuso

## Mejoras Futuras

- [ ] Crop/resize de imágenes antes de subir
- [ ] Comprimir imágenes automáticamente
- [ ] Múltiples fotos (galería)
- [ ] Integración con cámara en móviles
- [ ] Moderación de contenido
