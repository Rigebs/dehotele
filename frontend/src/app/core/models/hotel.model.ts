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
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
