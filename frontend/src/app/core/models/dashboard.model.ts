import { ReservationResponse } from './reservation.model';
import { ReviewResponse } from './review.model';

export interface DashboardResponse {
  totalRevenue: number;
  activeReservationsCount: number;
  activeHotelsCount: number;
  globalAverageRating: number;
  recentReservations: ReservationResponse[];
  criticalReviews: ReviewResponse[];
  hotelsByCity: { [key: string]: number };
}
