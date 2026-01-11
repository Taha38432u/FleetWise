export interface signUpTypes {
    email: string,
    name: string,
    password: string,
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
    user?: any;
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
    role: string;
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