import { Component, inject, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Select, SelectOption } from '../../../../shared/ui/select/select';
import { ReviewService } from '../../services/review-service';

@Component({
  selector: 'app-hotel-reviews-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Select],
  templateUrl: './hotel-reviews-section.html',
  styleUrl: './hotel-reviews-section.css',
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

  // Formulario
  readonly reviewForm = this.fb.nonNullable.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]],
  });

  readonly ratingOptions: SelectOption[] = [
    { label: '5 - Excelente', value: 5 },
    { label: '4 - Muy bueno', value: 4 },
    { label: '3 - Regular', value: 3 },
    { label: '2 - Malo', value: 2 },
    { label: '1 - Pésimo', value: 1 },
  ];

  constructor() {
    // Reacciona automáticamente si el hotelId cambia (ej. navegando entre hoteles)
    effect(() => {
      this.fetchReviews();
    });
  }

  // Función reutilizable para cargar datos
  private fetchReviews() {
    const id = this.hotelId();
    if (!id || isNaN(id)) return;

    this.reviewService.getHotelReviews(id).subscribe({
      next: (data) => this.reviews.set(data),
      error: (err) => console.error('Error cargando reseñas:', err),
    });
  }

  submitReview() {
    if (this.reviewForm.invalid) return;

    this.isSubmittingReview.set(true);
    const reviewData = this.reviewForm.getRawValue();

    this.reviewService.createReview(this.hotelId(), reviewData).subscribe({
      next: () => {
        // 1. Limpiamos el formulario
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.isSubmittingReview.set(false);

        // 2. Refrescamos la lista inmediatamente
        this.fetchReviews();
      },
      error: (err) => {
        console.error('Error al enviar la reseña:', err);
        this.isSubmittingReview.set(false);
      },
    });
  }
}
