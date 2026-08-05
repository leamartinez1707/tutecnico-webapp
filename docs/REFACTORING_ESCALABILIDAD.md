# 🚀 Plan de Refactorización para Escalabilidad

## 📊 Situación Actual vs. Objetivo

### ❌ **PROBLEMA ACTUAL: Carga masiva inicial**

```typescript
// UsersContext/React Query carga TODO al inicio
GET /technicians/        → 500+ técnicos (200KB+)
GET /reviews/            → 1000+ reseñas (150KB+)  
GET /users/              → Todos los usuarios

// Luego se filtra en el cliente
const filtered = technicians.filter(t => 
  t.department === userDepartment && 
  t.service === userService
);
```

**Problemas:**
- ⚠️ **Carga inicial lenta** (>500KB de datos)
- ⚠️ **Memoria innecesaria** (datos que nunca se usan)
- ⚠️ **Filtros en cliente** (procesa 500+ items por cada búsqueda)
- ⚠️ **Datos obsoletos** (cache de 5 minutos puede estar desactualizado)
- ⚠️ **No escalable** (con 5000 técnicos, app colapsa)

---

### ✅ **OBJETIVO: Carga bajo demanda por vista**

```typescript
// Cada vista carga solo lo que necesita
// DashboardPage
GET /technicians?page=1&limit=20&service=plomeria&department=montevideo
→ 20 técnicos filtrados (15KB)

// TechnicianDetail  
GET /technicians/:username
GET /reviews/technician/:id?page=1&limit=10
→ 1 técnico + 10 reseñas (5KB)

// FavoritesPage
GET /favorites
→ Solo favoritos del usuario (2KB)
```

**Beneficios:**
- ✅ **Carga rápida** (10-20KB por vista)
- ✅ **Menos memoria** (solo datos visibles)
- ✅ **Filtros en servidor** (BD optimizada para búsquedas)
- ✅ **Datos frescos** (cada vista recarga sus datos)
- ✅ **Escalable infinitamente** (paginación)

---

## 📋 Estado Actual del Código

### 1️⃣ **UsersContext** (LEGACY - Parcialmente en desuso)

**Archivo:** `src/context/UsersContext.tsx`

**Qué hace:**
- ✅ Funciones helper para actualizar usuario en AuthContext
- ❌ ~~Ya NO carga datos masivos~~ (migrado a React Query)

**Funciones que SÍ se usan:**
```typescript
updateUserData()         // Actualizar perfil usuario
updateProfilePhoto()     // Subir/actualizar foto
removeProfilePhoto()     // Eliminar foto
updateProfileData()      // Actualizar datos técnico
updateTechnicalData()    // Actualizar especialización/servicios
updateLocationData()     // Actualizar ubicación
```

**Usado en:**
- `ProfilePage.tsx` → `updateUserData`
- `DashboardUI.tsx` → `updateProfilePhoto`, `removeProfilePhoto`
- `BasicInformation.tsx` → `updateProfilePhoto`, `removeProfilePhoto`
- `useTechnicianProfile.ts` → `updateProfileData`, `updateTechnicalData`
- `LeaFlet.tsx` → `updateLocationData`

**Conclusión:** ✅ **MANTENER** - Son funciones útiles para sincronizar cambios con AuthContext

---

### 2️⃣ **useTechnicians()** (PROBLEMA - Carga todo)

**Archivo:** `src/hooks/queries/useTechnicians.ts`

**Código actual:**
```typescript
export const useTechnicians = () => {
    return useQuery({
        queryKey: queryKeys.technicians.lists(),
        queryFn: async () => {
            return await getTechniciansRequest(); // ← CARGA TODO
        },
    });
};
```

**API Backend:**
```typescript
// src/api/techApi.ts
export const getTechniciansRequest = async () => {
    const { data } = await api('/technicians/');
    return data.items as Technicians[]; // ← 500+ técnicos
}
```

**Usado en:**
- `UserDashboard.tsx` → Carga todos, filtra en cliente
- `SearchFilters.tsx` → Usa todos para conteo de resultados
- `useTechnicianDetail.ts` → Busca 1 técnico en el array completo
- `useLocation.ts` → Calcula distancias de todos

**Problema:** 🔴 **CRÍTICO** - Carga 500+ técnicos aunque solo muestres 20

---

### 3️⃣ **useAllReviews()** (PROBLEMA - Carga todo)

**Archivo:** `src/hooks/queries/useReviews.ts`

**Código actual:**
```typescript
export const useAllReviews = () => {
    return useQuery({
        queryKey: queryKeys.reviews.all,
        queryFn: async () => {
            return await getReviewsRequest(); // ← CARGA TODO
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
```

**Usado en:**
- `SearchFilters.tsx` → Calcula rating promedio de cada técnico
- `DashboardCard.tsx` → Muestra reviews de UN técnico
- `TechCard.tsx` → Igual

**Problema:** 🔴 **CRÍTICO** - Carga 1000+ reseñas para mostrar 5

---

## 🎯 Plan de Migración

### **FASE 1: Backend - Endpoints paginados**

#### 1. Modificar `/technicians/` para soportar filtros y paginación

**Antes:**
```typescript
GET /technicians/
→ Retorna TODO { items: [...500 técnicos] }
```

**Después:**
```typescript
GET /technicians?page=1&limit=20&service=plomeria&department=montevideo&sort=rating
→ Retorna solo lo necesario
{
  "items": [...20 técnicos],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Parámetros query:**
- `page` (número de página, default: 1)
- `limit` (técnicos por página, default: 20)
- `service` (filtro por servicio)
- `department` (filtro por departamento)
- `search` (búsqueda por nombre)
- `sort` (ordenar: rating, name, recent)
- `latitude`, `longitude`, `radius` (búsqueda geográfica)

---

#### 2. Endpoint específico para reviews de un técnico

**Crear:**
```typescript
GET /reviews/technician/:technicianId?page=1&limit=10
→ Solo reviews de ESE técnico
{
  "items": [...10 reviews],
  "pagination": { page: 1, limit: 10, total: 45 },
  "stats": {
    "average": 4.5,
    "total": 45
  }
}
```

---

#### 3. Endpoint para estadísticas rápidas (conteo)

**Crear:**
```typescript
GET /technicians/stats?service=plomeria&department=montevideo
→ Solo números, sin datos completos
{
  "totalTechnicians": 45,
  "averageRating": 4.3,
  "topServices": ["Plomería", "Electricidad"],
  "byDepartment": {
    "Montevideo": 120,
    "Canelones": 80
  }
}
```

---

### **FASE 2: Frontend - Hooks adaptados**

#### 1. Actualizar `useTechnicians()` con parámetros

**Antes:**
```typescript
export const useTechnicians = () => {
    return useQuery({
        queryKey: queryKeys.technicians.lists(),
        queryFn: async () => {
            return await getTechniciansRequest();
        },
    });
};
```

**Después:**
```typescript
interface TechniciansFilters {
    page?: number;
    limit?: number;
    service?: string;
    department?: string;
    search?: string;
    sort?: 'rating' | 'name' | 'recent';
    latitude?: number;
    longitude?: number;
    radius?: number;
}

export const useTechnicians = (filters: TechniciansFilters = {}) => {
    return useQuery({
        queryKey: queryKeys.technicians.filtered(filters),
        queryFn: async () => {
            return await getTechniciansRequest(filters);
        },
        staleTime: 1000 * 60 * 2, // 2 minutos
        keepPreviousData: true, // Mantener datos mientras carga nueva página
    });
};
```

**API actualizada:**
```typescript
export const getTechniciansRequest = async (filters: TechniciansFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.service) params.append('service', filters.service);
    if (filters.department) params.append('department', filters.department);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    
    const { data } = await api(`/technicians?${params.toString()}`);
    return data; // { items: [...], pagination: {...} }
}
```

---

#### 2. Crear `useReviewsByTechnician()` específico

**Nuevo hook:**
```typescript
export const useReviewsByTechnician = (
    technicianId: number, 
    options: { page?: number; limit?: number } = {}
) => {
    return useQuery({
        queryKey: queryKeys.reviews.byTechnician(technicianId, options),
        queryFn: async () => {
            return await getReviewsByTechnicianRequest(technicianId, options);
        },
        enabled: !!technicianId,
    });
};
```

**Nueva API:**
```typescript
export const getReviewsByTechnicianRequest = async (
    technicianId: number,
    { page = 1, limit = 10 } = {}
) => {
    const { data } = await api(`/reviews/technician/${technicianId}?page=${page}&limit=${limit}`);
    return data; // { items: [...], pagination: {...}, stats: {...} }
}
```

---

#### 3. Hook para estadísticas (reemplaza conteos manuales)

**Nuevo hook:**
```typescript
export const useTechniciansStats = (filters: { service?: string; department?: string } = {}) => {
    return useQuery({
        queryKey: queryKeys.technicians.stats(filters),
        queryFn: async () => {
            return await getTechniciansStatsRequest(filters);
        },
        staleTime: 1000 * 60 * 5, // 5 minutos (datos menos críticos)
    });
};
```

---

### **FASE 3: Componentes - Usar nuevos hooks**

#### UserDashboard.tsx

**Antes:**
```typescript
const { data: technicians = [] } = useTechnicians(); // ← Carga TODO
const { data: allReviews = [] } = useAllReviews();   // ← Carga TODO

// Filtrar en cliente (procesamiento pesado)
const filtered = technicians.filter(t => 
    t.service === filters.service && 
    t.department === filters.department
);

// Calcular rating manualmente
const techWithRatings = filtered.map(tech => {
    const reviews = allReviews.filter(r => r.technician.id === tech.id);
    const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return { ...tech, rating };
});
```

**Después:**
```typescript
const { filters } = useUrlFilters(); // Desde URL params
const { 
    data, 
    isLoading 
} = useTechnicians({ 
    page: filters.page,
    limit: 20,
    service: filters.service,
    department: filters.department,
    search: filters.search,
    sort: 'rating'
});

const technicians = data?.items || [];
const pagination = data?.pagination;

// ¡Backend ya envía todo filtrado y con ratings!
// No hay procesamiento en cliente
```

---

#### TechnicianDetail.tsx

**Antes:**
```typescript
const { data: technicians = [] } = useTechnicians(); // ← Carga 500+ para usar 1
const { data: allReviews = [] } = useAllReviews();   // ← Carga 1000+ para usar 5

const technician = technicians.find(t => t.username === username);
const reviews = allReviews.filter(r => r.technician.id === technician.id);
```

**Después:**
```typescript
const { data: technician } = useTechnicianDetail(username); // ← Solo 1
const { 
    data: reviewsData 
} = useReviewsByTechnician(technician.id, { limit: 10 }); // ← Solo 10

const reviews = reviewsData?.items || [];
const stats = reviewsData?.stats; // { average: 4.5, total: 45 }
```

---

#### SearchFilters.tsx

**Antes:**
```typescript
const { data: technicians = [] } = useTechnicians(); // ← Todo
const { data: allReviews = [] } = useAllReviews();   // ← Todo

// Contar en cliente (lento)
const countByService = services.map(service => {
    const count = technicians.filter(t => t.service === service).length;
    return { service, count };
});
```

**Después:**
```typescript
const { data: stats } = useTechniciansStats({
    department: filters.department
});

// Backend ya calculó todo
const countByService = stats?.byService || {};
// { "Plomería": 45, "Electricidad": 32, ... }
```

---

## 🗑️ Qué Eliminar

### ❌ **1. useAllReviews() - Reemplazar completamente**

**Eliminar:**
- `src/hooks/queries/useReviews.ts` → `useAllReviews()`
- `src/api/reviewsApi.ts` → `getReviewsRequest()` sin parámetros

**Reemplazar con:**
- `useReviewsByTechnician(technicianId)` → Específico
- `useTechniciansStats()` → Para conteos agregados

---

### ❌ **2. Lógica de filtrado en cliente**

**Eliminar de:**
- `UserDashboard.tsx`
- `SearchFilters.tsx`
- `useLocation.ts`

**Patrón a eliminar:**
```typescript
// ❌ NO HACER MÁS
const filtered = technicians.filter(t => ...);
const sorted = filtered.sort((a, b) => ...);
const paginated = sorted.slice(start, end);
```

**Reemplazar con:**
```typescript
// ✅ HACER
const { data } = useTechnicians({ filters, page, sort });
// Backend ya lo filtró, ordenó y paginó
```

---

### ❌ **3. Cálculos de rating en cliente**

**Eliminar:**
```typescript
// ❌ NO HACER MÁS
const reviews = allReviews.filter(r => r.technician.id === techId);
const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
```

**Reemplazar con:**
```typescript
// ✅ Backend incluye rating en datos de técnico
const { data: technician } = useTechnicianDetail(username);
const rating = technician.averageRating; // Ya calculado
```

---

## 📦 Nuevos Archivos a Crear

### 1. `src/hooks/queries/useTechniciansStats.ts`
```typescript
/**
 * Hook para estadísticas agregadas de técnicos
 */
import { useQuery } from '@tanstack/react-query';
import { getTechniciansStatsRequest } from '@/api/techApi';
import { queryKeys } from '@/lib/queryClient';

export const useTechniciansStats = (filters = {}) => {
    return useQuery({
        queryKey: queryKeys.technicians.stats(filters),
        queryFn: () => getTechniciansStatsRequest(filters),
        staleTime: 1000 * 60 * 5,
    });
};
```

### 2. Actualizar `src/lib/queryClient.ts` con nuevas keys

```typescript
export const queryKeys = {
    technicians: {
        all: ['technicians'] as const,
        lists: () => [...queryKeys.technicians.all, 'list'] as const,
        filtered: (filters: any) => [...queryKeys.technicians.lists(), filters] as const,
        stats: (filters: any) => [...queryKeys.technicians.all, 'stats', filters] as const,
        detail: (username: string) => [...queryKeys.technicians.all, 'detail', username] as const,
    },
    reviews: {
        all: ['reviews'] as const,
        byTechnician: (techId: number, options: any) => 
            [...queryKeys.reviews.all, 'technician', techId, options] as const,
    },
    // ... resto
};
```

---

## 🚦 Orden de Implementación

### **Sprint 1: Backend (1-2 semanas)**
1. ✅ Endpoint paginado `/technicians?page&limit&filters`
2. ✅ Endpoint `/reviews/technician/:id?page&limit`
3. ✅ Endpoint `/technicians/stats?filters`
4. ✅ Incluir `averageRating` en respuesta de técnicos

### **Sprint 2: Frontend Core (1 semana)**
1. ✅ Actualizar `useTechnicians()` con parámetros
2. ✅ Crear `useReviewsByTechnician()`
3. ✅ Crear `useTechniciansStats()`
4. ✅ Actualizar APIs en `techApi.ts` y `reviewsApi.ts`

### **Sprint 3: Migración de Componentes (1 semana)**
1. ✅ `UserDashboard.tsx` - Usar nuevos hooks
2. ✅ `SearchFilters.tsx` - Usar stats en lugar de conteo manual
3. ✅ `TechnicianDetail.tsx` - Reviews específicas
4. ✅ `DashboardCard.tsx`, `TechCard.tsx` - Usar rating del backend

### **Sprint 4: Limpieza (3 días)**
1. ✅ Eliminar `useAllReviews()`
2. ✅ Eliminar lógica de filtrado en cliente
3. ✅ Testing completo
4. ✅ Documentación actualizada

---

## 📊 Impacto Esperado

### **Performance**

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Carga inicial | 500KB | 20KB | **96% menos** |
| Tiempo de carga | 3-5s | 0.5-1s | **80% más rápido** |
| Memoria usada | 200MB | 30MB | **85% menos** |
| Filtrado | 500ms (cliente) | 50ms (servidor) | **90% más rápido** |

### **Escalabilidad**

| Escenario | Antes | Después |
|-----------|-------|---------|
| 500 técnicos | ⚠️ Lento | ✅ Rápido |
| 5,000 técnicos | ❌ Colapsa | ✅ Rápido |
| 50,000 técnicos | ❌ Imposible | ✅ Rápido |

---

## ✅ Checklist de Migración

### Backend
- [ ] Endpoint `/technicians` con paginación y filtros
- [ ] Endpoint `/reviews/technician/:id` paginado
- [ ] Endpoint `/technicians/stats` para agregados
- [ ] Campo `averageRating` en respuesta de técnicos
- [ ] Tests de endpoints nuevos

### Frontend - Hooks
- [ ] `useTechnicians(filters)` con parámetros
- [ ] `useReviewsByTechnician(techId, options)`
- [ ] `useTechniciansStats(filters)`
- [ ] Actualizar `queryKeys` en `queryClient.ts`

### Frontend - APIs
- [ ] `getTechniciansRequest(filters)` con query params
- [ ] `getReviewsByTechnicianRequest(techId, options)`
- [ ] `getTechniciansStatsRequest(filters)`

### Frontend - Componentes
- [ ] `UserDashboard.tsx` migrado
- [ ] `SearchFilters.tsx` migrado
- [ ] `TechnicianDetail.tsx` migrado
- [ ] `DashboardCard.tsx` migrado
- [ ] `TechCard.tsx` migrado
- [ ] `useLocation.ts` migrado

### Limpieza
- [ ] Eliminar `useAllReviews()`
- [ ] Eliminar `getReviewsRequest()` sin parámetros
- [ ] Eliminar lógica de filtrado en cliente
- [ ] Eliminar cálculos de rating manuales
- [ ] Actualizar documentación
- [ ] Testing completo

---

## 🎓 Aprendizajes Clave

### ✅ **Hacer:**
- Cargar solo datos que se van a mostrar
- Filtros, ordenamiento y paginación en servidor
- Hooks específicos por caso de uso
- Cache inteligente con React Query
- Estadísticas pre-calculadas en backend

### ❌ **No hacer:**
- Cargar "todo por las dudas"
- Filtrar/ordenar grandes datasets en cliente
- Hooks genéricos que sirven para "todo"
- Cache de 30 minutos para datos que cambian
- Calcular agregados en cada render

---

## 📞 Soporte

**Dudas sobre implementación:** Ver ejemplos en:
- `docs/TANSTACK_QUERY_MIGRATION.md`
- `src/hooks/queries/useTechnicians.ts`
- `src/components/user/UserDashboard.tsx`

**Autor:** Copilot + Leandro Martínez  
**Fecha:** Noviembre 2025  
**Versión:** 1.0
