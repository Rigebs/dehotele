export interface ReviewRequest {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  authorName: string;
  authorId: number;
}
