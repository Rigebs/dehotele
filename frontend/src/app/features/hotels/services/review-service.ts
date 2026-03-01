import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api-service';
import { ReviewRequest, ReviewResponse } from '../../../core/models/review.model';
import { PaginatedResponse } from '../../../core/models/paginated-response.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly apiService = inject(ApiService);

  getHotelReviews(
    hotelId: number,
    page: number = 0,
    size: number = 10,
  ): Observable<PaginatedResponse<ReviewResponse>> {
    return this.apiService.get<PaginatedResponse<ReviewResponse>>(`hotels/${hotelId}/reviews`, {
      page,
      size,
    });
  }

  createReview(hotelId: number, review: ReviewRequest): Observable<void> {
    return this.apiService.post<void, ReviewRequest>(`hotels/${hotelId}/reviews`, review);
  }
}
