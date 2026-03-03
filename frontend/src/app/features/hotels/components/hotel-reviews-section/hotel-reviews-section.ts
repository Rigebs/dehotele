import { Component, ChangeDetectionStrategy, inject, signal, input, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Select } from '../../../../shared/ui/select/select';
import { ReviewService } from '../../services/review-service';

@Component({
  selector: 'app-hotel-reviews-section',
  imports: [ReactiveFormsModule, Select, DatePipe],
  templateUrl: './hotel-reviews-section.html',
  styleUrl: './hotel-reviews-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelReviewsSection {
  private readonly reviewService = inject(ReviewService);
  private readonly fb = inject(FormBuilder);

  hotelId = input.required<number>();

  readonly isSubmittingReview = signal(false);
  readonly reviews = signal<{ content: any[]; totalElements: number }>({
    content: [],
    totalElements: 0,
  });

  readonly reviewForm = this.fb.nonNullable.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly ratingOptions = [
    { label: '5 - Excelente', value: 5 },
    { label: '4 - Muy bueno', value: 4 },
    { label: '3 - Regular', value: 3 },
    { label: '2 - Malo', value: 2 },
    { label: '1 - Pésimo', value: 1 },
  ];

  constructor() {
    effect(() => {
      const id = this.hotelId();
      if (id && !isNaN(id)) {
        this.fetchReviews(id);
      }
    });
  }

  private fetchReviews(id: number): void {
    this.reviewService.getHotelReviews(id).subscribe({
      next: (data) => this.reviews.set(data),
      error: (err) => console.error('Error cargando reseñas:', err),
    });
  }

  submitReview(): void {
    if (this.reviewForm.invalid || this.isSubmittingReview()) return;

    this.isSubmittingReview.set(true);

    this.reviewService.createReview(this.hotelId(), this.reviewForm.getRawValue()).subscribe({
      next: () => {
        this.reviewForm.reset();
        this.fetchReviews(this.hotelId());
        this.isSubmittingReview.set(false);
      },
      error: (err) => {
        console.error('Error al enviar la reseña:', err);
        this.isSubmittingReview.set(false);
      },
    });
  }
}
