import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap, throwError } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.model';
import { TokenStorageService } from '../utils/token-storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);
  private readonly _currentUser = signal<User | null>(null);

  readonly accessToken = computed(() => this._accessToken());
  readonly currentUser = computed(() => this._currentUser());

  readonly isAuthenticated = computed(() => !!this._accessToken());
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');

  constructor() {
    this.restoreSession();
  }

  login(request: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  register(request: RegisterRequest) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(tap((response) => this.setSession(response)));
  }

  refreshToken() {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._currentUser.set(null);
    this.tokenStorage.clear();
  }

  private setSession(response: AuthResponse): void {
    this._accessToken.set(response.accessToken);
    this._refreshToken.set(response.refreshToken);

    this.tokenStorage.saveAccessToken(response.accessToken);
    this.tokenStorage.saveRefreshToken(response.refreshToken);

    this.decodeAndSetUser(response.accessToken);
  }

  private restoreSession(): void {
    const accessToken = this.tokenStorage.getAccessToken();
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return;
    }

    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);
    this.decodeAndSetUser(accessToken);
  }

  private decodeAndSetUser(token: string): void {
    const payload = this.decodeToken(token);

    if (!payload) {
      this.logout();
      return;
    }

    this._currentUser.set({
      id: 0,
      name: payload.sub,
      email: payload.sub,
      role: payload.role as 'USER' | 'ADMIN',
    });
  }

  private decodeToken(token: string): { sub: string; role: string } | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
