import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap } from 'rxjs';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';
import { ReviewService } from '../../services/review-service';
import { Select, SelectOption } from '../../../../shared/ui/select/select';

@Component({
  selector: 'app-hotel-details-page',
  imports: [ReactiveFormsModule, CommonModule, DatePicker, Select],
  templateUrl: './hotel-details-page.html',
  styleUrl: './hotel-details-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly hotelService = inject(HotelService);
  private readonly reviewService = inject(ReviewService);

  private readonly router = inject(Router);

  readonly today = new Date();

  readonly guests = signal<number>(1);

  readonly hotelId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  readonly hotel = toSignal(
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
      switchMap(([params, queryParams]) => {
        const id = Number(params.get('id'));
        const capacity = Number(queryParams.get('guests')) || 1;
        const checkIn = queryParams.get('checkIn') ?? '';
        const checkOut = queryParams.get('checkOut') ?? '';
        return this.hotelService.getHotelAvailable(id, capacity, checkIn, checkOut);
      }),
    ),
    { initialValue: null },
  );

  private readonly refreshReviews = signal<void>(undefined);

  readonly reviews = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.refreshReviews(); // Dependencia para recargar
        return this.reviewService.getHotelReviews(Number(params.get('id')));
      }),
    ),
    { initialValue: { content: [], totalElements: 0 } as any },
  );

  readonly reviewForm = this.fb.nonNullable.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', [Validators.required, Validators.minLength(10)]],
  });

  isSubmittingReview = signal(false);

  submitReview() {
    if (this.reviewForm.invalid) return;

    this.isSubmittingReview.set(true);
    const request = this.reviewForm.getRawValue();

    this.reviewService.createReview(this.hotelId(), request).subscribe({
      next: () => {
        this.reviewForm.reset({ rating: 5, comment: '' });
        this.refreshReviews.set(undefined);
        this.isSubmittingReview.set(false);
      },
      error: () => this.isSubmittingReview.set(false),
    });
  }

  readonly minCheckOut = computed(() => {
    const checkIn = this.reservationForm.get('checkInDate')?.value;
    return checkIn ? new Date(checkIn) : new Date();
  });

  readonly availableRooms = computed(() => {
    const currentHotel = this.hotel();
    const currentGuests = this.guests();

    if (!currentHotel || !currentHotel.rooms) return [];

    return currentHotel.rooms.filter((room) => room.capacity >= currentGuests);
  });

  readonly reservationForm = this.fb.nonNullable.group({
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
  });

  readonly ratingOptions: SelectOption[] = [
    { label: '5 - Excelente', value: 5 },
    { label: '4 - Muy bueno', value: 4 },
    { label: '3 - Regular', value: 3 },
    { label: '2 - Malo', value: 2 },
    { label: '1 - Pésimo', value: 1 },
  ];

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.guests.set(Number(params['guests'] ?? 1));

      if (params['checkIn'] && params['checkOut']) {
        this.reservationForm.patchValue({
          checkInDate: params['checkIn'],
          checkOutDate: params['checkOut'],
        });
      }
    });
  }

  reserve(roomId: number) {
    if (this.reservationForm.invalid) return;

    const { checkInDate, checkOutDate } = this.reservationForm.getRawValue();

    this.router.navigate(['/reservations/create'], {
      queryParams: {
        hotelId: this.hotel()?.id,
        roomId: roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: this.guests(),
      },
    });
  }
}
