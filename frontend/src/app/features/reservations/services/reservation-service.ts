import { inject, Injectable } from '@angular/core';
import { ReservationRequest, ReservationResponse } from '../../../core/models/reservation.model';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface UpdateReservationRequest {
  checkInDate: string;
  checkOutDate: string;
}

export enum ReservationStatus {
  CREATED = 'CREATED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface ReservationFilter {
  userId?: number;
  roomId?: number;
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
}

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

  getMyReservations(page: number = 0, size: number = 5, filter: ReservationFilter = {}) {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.apiUrl}/my`, { params });
  }

  updateReservation(id: number, request: UpdateReservationRequest) {
    return this.http.put<ReservationResponse>(`${this.apiUrl}/${id}`, request);
  }

  cancelReservation(id: number) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
