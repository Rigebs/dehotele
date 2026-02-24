export interface ReservationRequest {
  readonly roomId: number;
  readonly checkInDate: string; // ISO yyyy-MM-dd
  readonly checkOutDate: string;
}

export interface ReservationResponse {
  readonly id: number;
  readonly roomId: number;
  readonly checkInDate: string;
  readonly checkOutDate: string;
  readonly status: string;
}
