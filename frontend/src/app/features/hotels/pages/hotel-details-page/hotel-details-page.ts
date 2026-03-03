import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, finalize, switchMap, tap } from 'rxjs';
import { HotelBookingFilters } from '../../components/hotel-booking-filters/hotel-booking-filters';
import { Select, SelectOption } from '../../../../shared/ui/select/select';
import { HotelService } from '../../services/hotel-service';
import { ReviewService } from '../../services/review-service';
import { HotelRoomCard } from '../../components/hotel-room-card/hotel-room-card';
import { HotelReviewsSection } from '../../components/hotel-reviews-section/hotel-reviews-section';

@Component({
  selector: 'app-hotel-details-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HotelBookingFilters,
    HotelRoomCard,
    HotelReviewsSection,
  ],
  templateUrl: './hotel-details-page.html',
  styleUrl: './hotel-details-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelDetailsPage {
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly hotelService = inject(HotelService);
  private readonly reviewService = inject(ReviewService);

  readonly isLoadingRooms = signal(false);
  readonly isSubmittingReview = signal(false);
  readonly guests = signal<number>(1);
  private readonly refreshReviews = signal<void>(undefined);

  protected readonly queryParams = toSignal(this.route.queryParams, {
    initialValue: {} as Params,
  });

  readonly hasValidDates = computed(() => {
    const params = this.queryParams();
    return !!(params['checkIn'] && params['checkOut']);
  });

  readonly hotelId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  readonly hotel = toSignal(
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
      tap(() => this.isLoadingRooms.set(true)),
      switchMap(([params, queryParams]) => {
        const id = Number(params.get('id'));
        const capacity = Number(queryParams.get('guests')) || 1;
        const checkIn = queryParams.get('checkIn') ?? '';
        const checkOut = queryParams.get('checkOut') ?? '';

        this.guests.set(capacity);

        return this.hotelService
          .getHotelAvailable(id, capacity, checkIn, checkOut)
          .pipe(finalize(() => this.isLoadingRooms.set(false)));
      }),
    ),
    { initialValue: null },
  );

  readonly reviews = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.refreshReviews();
        return this.reviewService.getHotelReviews(Number(params.get('id')));
      }),
    ),
    { initialValue: { content: [], totalElements: 0 } as any },
  );

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

  readonly availableRooms = computed(() => {
    const currentHotel = this.hotel();
    return currentHotel?.rooms?.filter((room) => room.capacity >= this.guests()) ?? [];
  });

  handleFilterChange(filters: { checkIn: string; checkOut: string }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        checkIn: filters.checkIn,
        checkOut: filters.checkOut,
        guests: this.guests(),
      },
      queryParamsHandling: 'merge',
    });
  }

  reserve(roomId: number) {
    const qp = this.route.snapshot.queryParams;

    this.router.navigate(['/reservations/create'], {
      queryParams: {
        hotelId: this.hotel()?.id,
        roomId,
        checkIn: qp['checkIn'],
        checkOut: qp['checkOut'],
        guests: this.guests(),
      },
    });
  }

  submitReview() {
    if (this.reviewForm.invalid) return;

    this.isSubmittingReview.set(true);
    this.reviewService.createReview(this.hotelId(), this.reviewForm.getRawValue()).subscribe({
      next: () => {
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.refreshReviews.set(undefined);
        this.isSubmittingReview.set(false);
      },
      error: () => this.isSubmittingReview.set(false),
    });
  }
}
