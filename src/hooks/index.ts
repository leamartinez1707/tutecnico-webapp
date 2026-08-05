/**
 * Exportaciones centralizadas de React Query hooks
 */

// Queries
export { useTechnicians } from './queries/useTechnicians';
export { useTechnicianByUsername } from './queries/useTechnicianProfile';
export { useReviewsByTechnician, useAllReviews, useUserReviews } from './queries/useReviews';
export { useFavorites } from './queries/useFavorites';
export { useUserBookings, useTechnicianBookings } from './queries/useBookings';

// Mutations
export { useAddFavorite, useRemoveFavorite } from './mutations/useFavoriteMutations';
export { useAddBooking, useUpdateBooking, useDeleteBooking } from './mutations/useBookingMutations';
export { useUpdateUser, useUpdateProfilePhoto } from './mutations/useUserMutations';

// Legacy hooks (mantener mientras se migra)
export { useRecentTechnicians } from './useRecentTechnicians';
