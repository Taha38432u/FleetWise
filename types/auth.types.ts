export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DISPATCHER" | "DRIVER" | "MECHANIC";

export interface signUpTypes {
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    role: UserRole,
}

export interface loginTypes {
    email: string,
    password: string,
}

export interface RequestPasswordResetType {
    email: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    user?: MeUser;
}

export interface RefreshRequestType {
    refreshToken: string;
}

// Me (current user) types
export interface MeUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: string;
    emailVerified: boolean;
    phone?: string;
}

export interface GetMeResponse {
    ok?: boolean;
    data: MeUser;
}

export interface UpdateMeDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
}
