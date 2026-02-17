import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '../models/auth.models';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly accessTokenSignal = signal<string | null>(null);

  readonly currentUser = signal<UserResponse | null>(null);

  readonly isAuthenticated = computed(() => !!this.accessTokenSignal());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  get accessToken(): string | null {
    return this.accessTokenSignal();
  }

  login(payload: LoginRequest) {
    return this.api.post<LoginResponse, LoginRequest>('auth/login', payload).pipe(
      tap((response) => {
        this.setSession(response);
      }),
    );
  }

  register(payload: RegisterRequest) {
    return this.api.post<void, RegisterRequest>('auth/register', payload);
  }

  logout() {
    this.accessTokenSignal.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  refreshToken() {
    return this.api
      .post<LoginResponse, unknown>('auth/refresh', {})
      .pipe(tap((response) => this.setSession(response)));
  }

  private setSession(response: LoginResponse) {
    this.accessTokenSignal.set(response.accessToken);
    this.currentUser.set(response.user);
  }
}
