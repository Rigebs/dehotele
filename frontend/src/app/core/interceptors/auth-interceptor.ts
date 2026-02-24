import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

// Variables de control de estado del refresco (se mantienen fuera para persistir entre peticiones)
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(AuthService);

  // 1. LISTA BLANCA: No añadir token ni intentar refresh en rutas de login/refresh
  const skipUrls = ['/auth/login', '/auth/refresh', '/auth/register'];
  const isAuthRequest = skipUrls.some((url) => req.url.includes(url));

  if (isAuthRequest) {
    return next(req);
  }

  const token = authService.accessToken();
  let authReq = req;

  // 2. Inyectar token de acceso si existe
  if (token) {
    authReq = addToken(req, token);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      /**
       * IMPORTANTE: Tu servidor está devolviendo 403.
       * Normalmente es 401, pero si tu backend (ej. Spring Security)
       * está configurado así, debemos capturar AMBOS.
       */
      if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
        return handleAuthError(authReq, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

/**
 * Función auxiliar para clonar la petición con el nuevo token
 */
const addToken = (request: HttpRequest<unknown>, token: string) => {
  return request.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
};

/**
 * Lógica central para manejar el refresco de tokens
 */
const handleAuthError = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
) => {
  // Si ya estamos en proceso de refresco, encolamos las peticiones
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        isRefreshing = false;

        // Extraemos el nuevo token (asegúrate que tu service lo actualice internamente)
        const newToken = authService.accessToken();
        if (!newToken) {
          throw new Error('No se pudo obtener el nuevo token');
        }

        refreshTokenSubject.next(newToken);
        return next(addToken(request, newToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        // Si el propio refresh falla (401/403 en el endpoint de refresh),
        // limpiamos todo y mandamos al login.
        authService.logout();
        return throwError(() => err);
      }),
    );
  } else {
    // Si ya hay un refresco en marcha, esperamos a que el Subject emita el nuevo token
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addToken(request, token!))),
    );
  }
};
