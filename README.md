# TuTécnico

Plataforma que conecta usuarios con técnicos de servicios en Uruguay. Buscá, reservá y calificá — los técnicos gestionan sus reservas, reciben reseñas y acceden a membresías premium.

## Estructura

```
tutecnico-webapp/
├── apps/
│   ├── web/          ← Frontend (React 19 + Vite 7 + TypeScript + Tailwind v4)
│   └── api/          ← Backend (NestJS 11 + TypeORM + PostgreSQL)
└── README.md
```

## Features

### Para usuarios
- 🔍 Buscar técnicos por especialidad y ubicación en mapa interactivo
- 📅 Reservar servicios con técnicos
- ⭐ Calificar y dejar reseñas
- ❤️ Guardar técnicos favoritos
- 📱 Contacto directo por WhatsApp post-reserva

### Para técnicos
- 📋 Dashboard con reservas entrantes
- ✅ Aceptar, rechazar o completar reservas
- 📊 Estadísticas de calificaciones
- 👑 Sistema de membresías (Trial / Pago) con MercadoPago
- 📍 Posicionamiento por geolocalización

### Stack técnico
- **Frontend**: React 19, Vite 7, TypeScript, Tailwind CSS v4, MUI, Radix UI, TanStack Query, React Router v7, Leaflet, PWA
- **Backend**: NestJS 11, TypeORM, PostgreSQL, JWT (access + refresh), Passport (Google OAuth), Swagger, Rate Limiting
- **Integraciones**: MercadoPago, Google OAuth 2.0, Cloudinary, EmailJS, OpenRoute

## Empezar

### Requisitos
- Node.js > 20
- PostgreSQL
- Cuenta de Google Cloud (para OAuth)
- Cuenta de MercadoPago (para pagos)

### Backend (API)

```bash
cd apps/api
npm install
cp .env.example .env   # editar con tus credenciales
npm run migration:run
npm run start:dev       # http://localhost:3000
# Swagger UI: http://localhost:3000/api
```

### Frontend (Web)

```bash
cd apps/web
npm install
cp .env.example .env.local   # editar VITE_API_URL=http://localhost:3000
npm run dev                   # http://localhost:5173
```

## Variables de entorno

### Backend (apps/api/.env)

| Variable | Descripción |
|---|---|
| `DATABASE_*` | Conexión PostgreSQL |
| `JWT_ACCESS_TOKEN_SECRET` | Secret para access tokens |
| `JWT_REFRESH_TOKEN_SECRET` | Secret para refresh tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret |
| `GOOGLE_CALLBACK_URL` | Callback URL (ej. `http://localhost:3000/auth/google/callback`) |
| `MERCADOPAGO_ACCESS_TOKEN` | Access token de MercadoPago |

### Frontend (apps/web/.env.local)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend (ej. `http://localhost:3000`) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset |
| `VITE_MERCADO_PAGO_PUBLIC_KEY` | MercadoPago public key |
| `VITE_OPEN_ROUTE_API` | OpenRouteService API key (geocoding) |

## Licencia

MIT
