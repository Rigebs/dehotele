import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          console.error('Bad request', error.error);
          break;

        case 403:
          console.error('Access denied');
          break;

        case 404:
          console.error('Resource not found');
          break;

        case 500:
          console.error('Internal server error');
          break;

        case 0:
          console.error('Network error or CORS issue');
          break;

        default:
          console.error('Unexpected error', error);
      }

      return throwError(() => error);
    }),
  );
};
