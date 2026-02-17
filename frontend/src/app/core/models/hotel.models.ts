export interface HotelResponse {
  id: number;
  name: string;
  description: string;
  city: string;
  address: string;
  imageUrl: string;
}

export interface RoomResponse {
  id: number;
  hotelId: number;
  type: string;
  pricePerNight: number;
  available: boolean;
}
