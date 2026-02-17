import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HotelResponse } from '../../../core/models/hotel.models';
import { ReservationResponse } from '../../../core/models/reservation.models';
import { ApiService } from '../../../core/services/api-service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly api = inject(ApiService);

  // Hotels
  getHotels(): Observable<readonly HotelResponse[]> {
    return this.api.get<readonly HotelResponse[]>('admin/hotels');
  }

  createHotel(payload: {
    name: string;
    description: string;
    city: string;
    address: string;
    imageUrl: string;
  }) {
    return this.api.post<HotelResponse, typeof payload>('admin/hotels', payload);
  }

  updateHotel(id: number, payload: unknown) {
    return this.api.put<void, unknown>(`admin/hotels/${id}`, payload);
  }

  deleteHotel(id: number) {
    return this.api.delete<void>(`admin/hotels/${id}`);
  }

  // Reservations
  getAllReservations(): Observable<readonly ReservationResponse[]> {
    return this.api.get<readonly ReservationResponse[]>('admin/reservations');
  }

  updateReservationStatus(id: number, status: string) {
    return this.api.put<void, unknown>(`admin/reservations/${id}/status`, { status });
  }
}
