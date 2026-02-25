import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationResponse } from '../../../core/models/reservation.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin/reservations`;

  getAll(
    page: number = 0,
    size: number = 10,
    filters?: any,
  ): Observable<PaginatedResponse<ReservationResponse>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== 'ALL') {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<PaginatedResponse<ReservationResponse>>(this.apiUrl, { params });
  }
}
