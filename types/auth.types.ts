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