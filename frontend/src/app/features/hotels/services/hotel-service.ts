import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Hotel, PageResponse } from '../../../core/models/hotel.model';
import { Room } from '../../../core/models/room.model';

export interface HotelFilter {
  name?: string;
  city?: string;
  minRating?: number;
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/hotels`;

  /**
   * Obtiene hoteles paginados, filtrados y ordenados
   * @param page Número de página
   * @param filter Objeto con criterios de búsqueda
   * @param sort String en formato "campo,direccion" (ej: "name,asc")
   * @param size Cantidad de elementos por página
   */
  getHotels(
    page: number = 0,
    filter: HotelFilter = {},
    sort: string = 'name,asc',
    size: number = 10,
  ) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    // Mapeamos dinámicamente el objeto filter a HttpParams
    // Solo añadimos los valores que no sean null, undefined o vacíos
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PageResponse<Hotel>>(this.apiUrl, { params });
  }

  getAllLightweight() {
    return this.http.get<readonly Hotel[]>(`${this.apiUrl}/lightweight`);
  }

  getHotelById(id: number) {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  getRoomsByHotel(id: number) {
    return this.http.get<readonly Room[]>(`${this.apiUrl}/${id}/rooms`);
  }
}
