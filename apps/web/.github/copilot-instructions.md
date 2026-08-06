# TuTecnico Frontend - AI Coding Instructions

## Project Overview
React + TypeScript frontend for a technician finder platform in Uruguay. Connects users with technical service providers through geolocation, bookings, and a membership system.

## Architecture Patterns

### Context-Based State Management
Use React Context for app-wide state. Three main providers wrap the app in `src/main.tsx`:
- `AuthContext` - User authentication, login/logout, technician vs user roles
- `UsersContext` - User data management, location updates
- `BookingContext` - Booking CRUD operations

```tsx
// Always access contexts through custom hooks
const { user, isAuthenticated } = useAuth();
const { updateLocationData } = useUsers();
const { addBooking, getBookings } = useBooking();
```

### Role-Based Access Control
Two user types: `User` and `UserTechnician` (has `technician` property). Use `isTechnician()` utility for role checks:
- Routes in `src/routes/routesConfig.ts` are organized by role
- `PrivateRouteLayout` enforces role-based access
- Dashboard features differ based on `user.technician` presence

### API Layer Architecture
All API calls go through `src/api/axios.ts` configured instance:
- Auto-attached Bearer tokens via interceptor
- Automatic token refresh on 401 responses
- Centralized error handling with `logger.apiError()`
- Environment-based baseURL via `VITE_API_URL`

### Logging Strategy
Use centralized logger (`src/utils/logger.ts`) instead of console methods:
```typescript
// ❌ Avoid
console.log('User data', userData);

// ✅ Use
logger.info('User authenticated', { userId: user.id });
logger.error('API request failed', error);
logger.apiError('/api/bookings', error); // For API-specific errors
```

## Key Domain Models

### Membership System
Three membership types in `src/types/membership.ts`:
- `NONE` (gray, inactive) - No subscription
- `TRIAL` (blue, Sparkles icon) - Free trial period
- `PAID` (gold, Crown icon) - Premium subscription

Technicians have membership fields: `membershipType`, `membershipActive`, `membershipExpiresAt`

### Geolocation Integration
Maps use Leaflet (`src/components/map/LeaFlet.tsx`):
- Custom markers for technicians vs searched locations
- Address geocoding via `src/api/geo/geoLocationApi.ts`
- Location confirmation workflow before saving to user profile

### Booking Workflow
Booking states managed in `BookingContext`:
- `CreateBooking` type for new bookings (user/technician as IDs)
- `Booking` type for existing bookings (full objects)
- Status tracking through booking lifecycle

## Development Workflows

### Form Validation
Uses Zod schemas in `src/schemas/`:
- `auth-schema.ts` - Login/register validation with custom refinements
- Forms use React Hook Form with `@hookform/resolvers/zod`
- Consistent Spanish error messages

### Component Organization
- `src/components/ui/` - Reusable UI components (shadcn/ui style)
- `src/components/technician/` - Technician-specific features
- `src/components/user/` - User-specific features
- `src/hooks/` - Custom hooks, organized by domain

### Styling Conventions
- TailwindCSS v4 with custom config
- Material-UI components for complex UI (DatePicker, etc.)
- Consistent color scheme: gray for inactive, blue for trial, gold for premium memberships

## Common Patterns

### Error Handling
```typescript
try {
  await apiCall();
  enqueueSnackbar('Success message', { variant: 'success' });
} catch (error) {
  logger.error('Operation failed', error);
  enqueueSnackbar('Error message', { variant: 'error' });
}
```

### Route Protection
Use `PrivateRoute` with role requirements:
```typescript
<PrivateRoute element={<TechnicianDashboard />} requiredRole="technician" />
```

### Location Data Updates
Always use `updateLocationData()` from UsersContext when updating user coordinates:
```typescript
const locationData = { latitude, longitude, address };
await updateLocationData(user.id, locationData);
```

## Build & Deploy
- `npm run dev` - Development server
- `npm run build` - TypeScript compilation + Vite build  
- PWA-enabled with custom manifest in `vite.config.ts`
- Environment variables: `VITE_API_URL` for backend connection

## Critical Files to Reference
- `src/types/index.ts` - Core type definitions
- `src/utils/index.ts` - Utility functions and Uruguay location data
- `docs/MEMBERSHIP_SYSTEM.md` - Detailed membership business rules
- `MEJORAS_FRONTEND.md` - Security improvements and logging patterns