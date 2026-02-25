export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface User {
  readonly id: number;
  readonly fullName: string;
  readonly email: string;
  readonly role: 'USER' | 'ADMIN';
}
