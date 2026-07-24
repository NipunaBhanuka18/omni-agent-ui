// src/types/index.ts

// Define the exact roles based on the Azure AD architecture
export type UserRole =
    | 'Customer'
    | 'Billing Staff'
    | 'Customer Support'
    | 'Network Operations'
    | 'HR'
    | 'Administrator';

// The shared User object Pubuduni needs for her Dashboard and Settings
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    avatarUrl?: string;
}

// The Auth State you will manage, and she will read
export interface AuthState {
    isAuthenticated: boolean;
    user: UserProfile | null;
    jwtToken: string | null;
}

// A standard Notification shape for her slide-out panels
export interface AppNotification {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string; // ISO Date string
}