import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HotelResponse, RoomResponse } from '../../../core/models/hotel.models';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { ApiService } from '../../../core/services/api-service';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private readonly api = inject(ApiService);

  getHotels(
    page: number,
    size: number,
    checkIn?: string,
    checkOut?: string,
  ): Observable<PaginatedResponse<HotelResponse>> {
    return this.api.get<PaginatedResponse<HotelResponse>>('hotels', {
      page,
      size,
      ...(checkIn ? { checkIn } : {}),
      ...(checkOut ? { checkOut } : {}),
    });
  }

  getHotelById(id: number) {
    return this.api.get<HotelResponse>(`hotels/${id}`);
  }

  getAvailableRooms(id: number, checkIn: string, checkOut: string) {
    return this.api.get<readonly RoomResponse[]>(`hotels/${id}/rooms`, { checkIn, checkOut });
  }
}
