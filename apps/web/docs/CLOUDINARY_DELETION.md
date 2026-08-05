# Eliminación de Imágenes de Cloudinary - Implementación Backend

## Problema
Actualmente, cuando un usuario cambia o elimina su foto de perfil, la imagen anterior queda almacenada en Cloudinary ocupando espacio innecesario.

## Solución Implementada en Frontend

### Archivos Creados/Modificados:
1. `src/utils/cloudinary.ts` - Utilidades para manejar URLs y eliminación de Cloudinary
2. `src/api/cloudinaryApi.ts` - API para comunicarse con el backend
3. `src/components/ui/ProfilePhotoUpload.tsx` - Actualizado para eliminar fotos antiguas

### Flujo Implementado:
1. Usuario sube nueva foto → Se elimina la foto anterior → Se sube la nueva
2. Usuario elimina foto → Se elimina de Cloudinary → Se elimina de BD

## Endpoint Requerido en Backend

### `DELETE /cloudinary/images`

**Request Body:**
```json
{
  "publicId": "techfinder/profiles/abc123xyz"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Imagen eliminada exitosamente",
  "publicId": "techfinder/profiles/abc123xyz"
}
```

### Implementación de Ejemplo (Node.js/Express)

#### 1. Instalar Cloudinary SDK
```bash
npm install cloudinary
```

#### 2. Configurar Cloudinary
```javascript
// config/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

#### 3. Crear Controlador
```javascript
// controllers/cloudinaryController.js
const cloudinary = require('../config/cloudinary');

exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'publicId es requerido'
      });
    }

    // Eliminar la imagen de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image'
    });

    if (result.result === 'ok' || result.result === 'not found') {
      return res.json({
        success: true,
        message: 'Imagen eliminada exitosamente',
        publicId,
        cloudinaryResult: result
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la imagen de Cloudinary',
      result
    });
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al eliminar la imagen',
      error: error.message
    });
  }
};
```

#### 4. Crear Ruta
```javascript
// routes/cloudinary.routes.js
const express = require('express');
const router = express.Router();
const { deleteImage } = require('../controllers/cloudinaryController');
const { protect } = require('../middleware/auth'); // Tu middleware de autenticación

// Proteger la ruta para que solo usuarios autenticados puedan eliminar
router.delete('/images', protect, deleteImage);

module.exports = router;
```

#### 5. Registrar Ruta en App
```javascript
// app.js o server.js
const cloudinaryRoutes = require('./routes/cloudinary.routes');

app.use('/api/cloudinary', cloudinaryRoutes);
```

### Variables de Entorno Necesarias

Agregar a `.env`:
```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Seguridad

**Importante:** 
- ✅ Siempre proteger el endpoint con autenticación
- ✅ Validar que el usuario solo pueda eliminar sus propias imágenes
- ✅ No exponer el API Secret en el frontend
- ✅ Implementar rate limiting para evitar abuso

### Validación Adicional (Opcional pero Recomendado)

```javascript
exports.deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    const userId = req.user.id; // De tu middleware de autenticación

    // Verificar que la imagen pertenece al usuario
    const user = await User.findById(userId);
    
    if (!user.profilePhotoUrl || !user.profilePhotoUrl.includes(publicId)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta imagen'
      });
    }

    // Continuar con la eliminación...
    const result = await cloudinary.uploader.destroy(publicId);
    
    // ... resto del código
  } catch (error) {
    // ... manejo de errores
  }
};
```

## Testing

### Probar el Endpoint
```bash
# Con curl
curl -X DELETE http://localhost:3000/api/cloudinary/images \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"publicId": "techfinder/profiles/test123"}'

# Respuesta esperada
{
  "success": true,
  "message": "Imagen eliminada exitosamente",
  "publicId": "techfinder/profiles/test123"
}
```

## Notas Importantes

1. **Eliminación es permanente**: Una vez eliminada de Cloudinary, no se puede recuperar
2. **Rate Limits**: Cloudinary tiene límites según tu plan
3. **Resultado "not found"**: Si la imagen ya no existe, Cloudinary devuelve "not found" pero no es un error
4. **Transformaciones**: Si la imagen tiene transformaciones, también se eliminan automáticamente
5. **Folder**: No es necesario eliminar folders vacíos, Cloudinary los maneja automáticamente

## Beneficios

✅ **Ahorro de almacenamiento**: No acumulas imágenes viejas
✅ **Costos reducidos**: Menos almacenamiento = menos costos en Cloudinary
✅ **Mejor organización**: Solo imágenes activas en el cloud
✅ **Cumplimiento GDPR**: Eliminar datos cuando el usuario lo solicita

## Estado Actual

- ✅ Frontend implementado y listo
- ⏳ Backend pendiente de implementación
- ⏳ Testing pendiente

Una vez implementado el endpoint en el backend, la eliminación automática de fotos antiguas funcionará completamente.
