import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api-service';
import { Hotel } from '../../../core/models/hotel.model';

export interface HotelRequest {
  name: string;
  city: string;
  address: string;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewsCount?: number;
  amenities?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AdminHotelService {
  private readonly endpoint = 'admin/hotels';

  constructor(private api: ApiService) {}

  create(data: HotelRequest): Observable<Hotel> {
    return this.api.post<Hotel, HotelRequest>(this.endpoint, data);
  }

  update(id: number, data: HotelRequest): Observable<Hotel> {
    return this.api.put<Hotel, HotelRequest>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
