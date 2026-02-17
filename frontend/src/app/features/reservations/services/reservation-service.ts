import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ReservationResponse } from '../../../core/models/reservation.models';
import { ApiService } from '../../../core/services/api-service';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private readonly api = inject(ApiService);

  getMyReservations(): Observable<readonly ReservationResponse[]> {
    return this.api.get<readonly ReservationResponse[]>('reservations/me');
  }

  createReservation(
    hotelId: number,
    roomId: number,
    checkIn: string,
    checkOut: string,
  ): Observable<ReservationResponse> {
    return this.api.post<ReservationResponse, unknown>('reservations', {
      hotelId,
      roomId,
      checkIn,
      checkOut,
    });
  }

  cancelReservation(id: number) {
    return this.api.put<void, unknown>(`reservations/${id}/cancel`, {});
  }
}
