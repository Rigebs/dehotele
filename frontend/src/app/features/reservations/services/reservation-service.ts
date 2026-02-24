import { inject, Injectable } from '@angular/core';
import { ReservationRequest, ReservationResponse } from '../../../core/models/reservation.model';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PageResponse } from '../../../core/models/hotel.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly http = inject(HttpClient);

  createReservation(request: ReservationRequest) {
    return this.http.post<ReservationResponse>(`${environment.apiUrl}/reservations`, request);
  }

  getMyReservations(page = 0, size = 10) {
    return this.http.get<PageResponse<ReservationResponse>>(`${environment.apiUrl}/reservations`, {
      params: { page, size },
    });
  }

  cancelReservation(id: number) {
    return this.http.patch<void>(`${environment.apiUrl}/reservations/${id}/cancel`, {});
  }
}
