import { Room } from './room.model';

export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  rooms: Room[];
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
