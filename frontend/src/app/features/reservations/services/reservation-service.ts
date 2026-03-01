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
  private readonly apiUrl = `${environment.apiUrl}/reservations`;

  createReservation(request: ReservationRequest) {
    return this.http.post<ReservationResponse>(this.apiUrl, request);
  }

  getReservationsByUserId(userId: number) {
    return this.http.get<ReservationResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  cancelReservation(id: number) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
