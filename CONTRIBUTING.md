# Contribuir a TuTécnico

¡Gracias por tu interés en contribuir! Este proyecto es open-source y cualquier ayuda es bienvenida.

## Cómo empezar

1. Hacé un fork del repo y clonalo
2. Instalá dependencias en ambas apps:

```bash
cd apps/api && npm install
cd apps/web && npm install
```

3. Configurá las variables de entorno (copiá `.env.example` a `.env` en cada app)
4. Iniciá los servidores:

```bash
# Backend
cd apps/api && npm run start:dev

# Frontend
cd apps/web && npm run dev
```

## Estructura del proyecto

```
apps/
├── api/          ← NestJS + TypeORM + PostgreSQL
│   └── src/
│       ├── auth/          ← JWT, Google OAuth
│       ├── users/         ← CRUD de usuarios
│       ├── technicians/   ← CRUD de técnicos, membresías
│       ├── bookings/      ← Reservas
│       ├── reviews/       ← Reseñas
│       ├── favorites/     ← Favoritos
│       ├── checkouts/     ← MercadoPago
│       ├── geocoding/     ← Geocodificación (IDE.uy)
│       ├── services/      ← Servicios y profesiones
│       └── database/      ← Migraciones TypeORM
│
└── web/          ← React 19 + Vite + Tailwind v4
    └── src/
        ├── api/           ← Llamadas al backend
        ├── components/    ← Componentes React
        ├── pages/         ← Páginas
        ├── hooks/         ← Custom hooks
        ├── context/       ← Auth, Users
        └── lib/           ← Utilidades
```

## Antes de enviar un PR

- [ ] TypeScript compila: `npx tsc --noEmit` en cada app
- [ ] Tests pasan:
  - Backend: `cd apps/api && npm test`
  - Frontend: `cd apps/web && npm test`
- [ ] El código sigue el estilo del proyecto (ESLint configurado)
- [ ] Si agregás un endpoint, documentalo con Swagger (`@ApiOperation`)
- [ ] Si tocás la base de datos, generá una migración: `npm run migration:generate`

## Convenciones

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`)
- **Código**: TypeScript estricto, sin `any` cuando sea evitable
- **Estilo**: Tailwind CSS para estilos, componentes shadcn/ui para UI base
- **Idioma**: Código y comentarios en inglés, UI en español

## Reportar bugs

Abrí un issue con:
- Pasos para reproducir
- Comportamiento esperado vs real
- Screenshots si aplica
- Navegador y versión

## Licencia

Al contribuir, aceptás que tu código se publique bajo la licencia MIT de este proyecto.
