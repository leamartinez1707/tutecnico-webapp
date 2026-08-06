import { z } from "zod";
import { signInSchema, signUpSchema, signUpUserSchema } from "../schemas/auth-schema";
import { TechReviewSchema } from "@/schemas/technician-schema";
import { MembershipType } from "./membership";

export type SignUp = z.infer<typeof signUpSchema>;
export type SignUpUser = z.infer<typeof signUpUserSchema>;
export type SignIn = z.infer<typeof signInSchema>;

export type AuthUser = User | UserTechnician | null;
// Usuario logueado
export type LoggedUser = User & { technician?: Technician };


// Meta data for paginated responses
export interface Meta {
    total: number;
    page: number;
    limit: number;
}

// User types
export type User = {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
    profilePhotoUrl?: string;
}

export interface PersonalFormData {
    firstName: string
    lastName: string
}

export interface ContactFormData {
    email: string
    phone: string
    address: string
}

export interface PasswordFormData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface PasswordErrors {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export type UserTechnician = User & { technician: Technician };

export type TechnicianFromFavorite = {
    id: number;
    services: string[];
    username: string;
    specialization: string;
    profilePhotoUrl?: string;
    firstName: string;
    lastName: string;
    averageRating: number;
    isActive: boolean;
    address: string;
}   
export type UserFavorites = {
    id: number;
    technician: TechnicianFromFavorite & { distance?: number };
}

// Technician

export type TechnicianReview = z.infer<typeof TechReviewSchema>;

// export type Review = z.infer<typeof ReviewSchema>;
export type Review = {
    id: number;
    date: string;
    comment: string;
    rating: number;
    user: User;
    technician: Technicians;
}

export type Coordinates = {
    lat: number;
    lng: number;
}

export type EditProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
}

export type EditTechnicalData = {
    specialization: string;
    services: string[];
}
export type EditLocationData = {
    latitude: number;
    longitude: number;
    address: string;
}

// Tecnicos en la lista de tecnicos
export type Technicians = {
    specialization: string;
    services: string[];
    id: number;
    latitude: number;
    longitude: number;
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    profilePhotoUrl: string;
    membershipType: string;
    membershipActive: boolean;
    membershipStartedAt: string;
    membershipExpiresAt: string;
    averageRating: number;
    createdAt: string;
}

export type Technician = {
    id: number;
    latitude: string;
    longitude: string;
    services: string[];
    specialization: string;
    membershipType?: MembershipType;
    membershipActive?: boolean;
    membershipExpiresAt?: string;
}
export type TechnicianWithDistance = {
    id: number;
    distance: string;
    firstName: string;
    lastName: string;
    specialization: string;
    services: string[];
    phone: string;
    address: string;
    email: string;
    profilePhotoUrl?: string;
}

// Bookings

export type CreateBooking = {
    date: string,
    status: string,
    comment: string,
    user: number,
    technician: number
}
export type Booking = {
    id: number;
    date: string;
    status: string;
    comment: string;
    user: User;
    technician: TechnicianBooking;
}

export type Bookings = {
    id: number;
    date: string;
    status: string;
    comment: string;
    user: number;
    technician: number;
}

export type TechnicianBooking = {
    id: number;
    latitude: string;
    longitude: string;
    specialization: string;
    services: string[];
    user: User;
}

export type UserBookingsResponse = {
    items: Booking[];
    meta: Meta;
}

export type TechnicianBookingsResponse = {
    bookings: Booking[];
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    specialization: string;
    latitude: string;
    longitude: string;
    services: string[];
}

// Tipos básicos para las reservas
export type BookingStatus = "Pendiente" | "Aceptado" | "Completado" | "Rechazado";

// Exportar tipo de membresía
export type { MembershipType } from "./membership";