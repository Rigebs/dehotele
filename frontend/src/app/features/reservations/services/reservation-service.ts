import { inject, Injectable } from '@angular/core';
import { ReservationRequest, ReservationResponse } from '../../../core/models/reservation.model';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/reservations`;

  createReservation(request: ReservationRequest) {
    return this.http.post<ReservationResponse>(this.apiUrl, request);
  }

  checkAvailability(roomId: number, checkIn: string, checkOut: string) {
    const params = new HttpParams()
      .set('roomId', roomId.toString())
      .set('checkIn', checkIn)
      .set('checkOut', checkOut);

    return this.http.get<boolean>(`${this.apiUrl}/check-availability`, { params });
  }

  getReservationsByUserId(userId: number) {
    return this.http.get<ReservationResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  cancelReservation(id: number) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
