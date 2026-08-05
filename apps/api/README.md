# TechFinderUY Backend

Backend desarrollado en NestJS para la plataforma TechFinderUY, que conecta usuarios con técnicos de servicios en Uruguay. Permite registro, autenticación, reservas, reseñas y gestión de favoritos, con control de acceso y roles.

## Características principales

- **Registro y autenticación de usuarios y técnicos** (JWT)
- **Búsqueda y listado de técnicos** por especialidad y ubicación
- **Reservas de servicios** entre usuarios y técnicos
- **Sistema de reseñas** para técnicos
- **Gestión de favoritos** (usuarios pueden marcar técnicos favoritos)
- **Control de acceso**: Guards de autenticación, roles y ownership
- **Validación de datos** mediante DTOs y pipes
- **Geocodificación** de direcciones para técnicos

## Estructura del Proyecto

```
src/
├── app.module.ts
├── main.ts
├── bookings/
│   ├── bookings.controller.ts
│   ├── bookings.module.ts
│   ├── bookings.service.ts
│   └── dto/
├── favorites/
│   ├── favorites.controller.ts
│   ├── favorites.module.ts
│   ├── favorites.service.ts
│   └── favorite.entity.ts
├── geocoding/
│   ├── geocoding.module.ts
│   └── geocoding.service.ts
├── guards/
│   ├── auth.guard.ts
│   ├── check-ownership.decorator.ts
│   ├── guards.module.ts
│   ├── owner.guard.ts
│   ├── roles.decorator.ts
│   └── roles.guard.ts
├── reviews/
│   ├── dto/
│   ├── entities/
│   ├── reviews.controller.ts
│   ├── reviews.module.ts
│   └── reviews.service.ts
├── technicians/
│   ├── dto/
│   ├── technician.entity.ts
│   ├── technicians.controller.ts
│   ├── technicians.module.ts
│   └── technicians.service.ts
├── users/
│   ├── dto/
│   ├── user.entity.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.validation.ts
└── utils/
    └── valida-unique-fields.ts
```

## Módulos y Funcionalidades

- **users**: Registro, login, actualización y eliminación de usuarios. Validación de unicidad de username/email/teléfono.
- **technicians**: Registro y gestión de técnicos, incluyendo especialización, servicios y geolocalización.
- **bookings**: Reservas entre usuarios y técnicos, con control de ownership.
- **reviews**: Sistema de reseñas para técnicos, con control de acceso.
- **favorites**: Gestión de técnicos favoritos por usuario.
- **guards**: Autenticación JWT, control de roles y ownership.
- **geocoding**: Servicio para obtener coordenadas a partir de direcciones.
- **utils**: Utilidades para validaciones.

## Autenticación y Autorización

- **JWT**: Los endpoints protegidos requieren el header `Authorization: Bearer <token>`.
- **Guards**:
  - `AuthGuard`: Valida JWT y adjunta el usuario al request.
  - `RolesGuard`: Restringe acceso según el rol (`user`, `technician`, etc).
  - `OwnerGuard` y `CheckOwnership`: Solo el dueño puede modificar/eliminar sus recursos.

## Instalación

1. Clona el repositorio:
   ```
   git clone <repository-url>
   ```
2. Instala dependencias:
   ```
   npm install
   ```
3. Copia `.env.example` a `.env` y configura variables:
   ```
   # Servidor
   PORT=3000
   NODE_ENV=development
   CORS_ORIGINS=http://localhost:3000

   # Base de datos
   DATABASE_TYPE=postgres
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=techfinder

   # JWT
   JWT_ACCESS_TOKEN_SECRET=replace-with-strong-secret
   JWT_ACCESS_TOKEN_EXPIRES_IN=10m
   JWT_REFRESH_TOKEN_SECRET=replace-with-strong-refresh-secret
   JWT_REFRESH_TOKEN_EXPIRES_IN=7d
   ```
4. Ejecuta migraciones:
   ```
   npm run migration:run
   ```

## Uso

Inicia el servidor:
```
npm run start
```
La API estará disponible en `http://localhost:3000`.

### Swagger
- UI: `http://localhost:${PORT}/api`
- Autenticación: habilitada con Bearer (JWT). Click en Authorize y pega tu access token.

### Paginación
- Parámetros estándar en listados: `page` (default 1), `limit` (default 20, máx 100), `sort`, `order` (`ASC|DESC`).
- Respuesta:
   ```json
   {
      "items": [ /* ... */ ],
      "meta": { "total": 123, "page": 1, "limit": 20 }
   }
   ```

## Seguridad


### Security / Network

Add strict origin and IP controls to reduce unsolicited traffic:

```
CORS_ORIGINS=https://app.example.com,https://admin.example.com,*.example.org
ALLOWED_IPS=203.0.113.10,198.51.100.0/24,2001:db8::/32
TRUST_PROXY=1
```

Notes:
- Avoid using `*` in `CORS_ORIGINS` for production; the bootstrap will terminate if detected.
- Wildcard subdomains supported via `*.example.org` syntax.
- `ALLOWED_IPS` accepts individual IPv4/IPv6 addresses or CIDR ranges; if empty no IP filtering occurs.
- Set `TRUST_PROXY=1` when running behind a reverse proxy (NGINX / ELB) so `x-forwarded-for` is honored for IP allowlist matching.
- Requests from disallowed IPs receive HTTP 403 with a JSON body `{ statusCode: 403, message: 'IP not allowed', ip }`.
## Licencia

MIT License.