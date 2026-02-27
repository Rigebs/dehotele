import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { environment } from '../../../../environments/environment';
import { Room } from '../../../core/models/room.model';

@Injectable({ providedIn: 'root' })
export class AdminRoomService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rooms`;

  getAll(
    hotelId: number,
    page: number = 0,
    size: number = 10,
    filters?: any,
  ): Observable<PaginatedResponse<Room>> {
    let params = new HttpParams()
      .set('hotelId', hotelId.toString())
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value !== null && value !== undefined && value !== 'ALL' && value !== '') {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<PaginatedResponse<Room>>(this.apiUrl, { params });
  }

  create(room: any): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  getById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  update(id: number, room: any): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
