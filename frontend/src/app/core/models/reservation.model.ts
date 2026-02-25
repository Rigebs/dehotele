import { User } from './auth.model';
import { Room } from './room.model';

export interface ReservationRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}

export interface ReservationResponse {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  roomId: number;
  customerName: string;
  customerEmail: string;
  roomType: string;
  roomNumber: string;
  user: User;
  room: Room;
}
