import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, finalize, Observable, switchMap, tap } from 'rxjs';
import { HotelBookingFilters } from '../../components/hotel-booking-filters/hotel-booking-filters';
import { HotelService } from '../../services/hotel-service';
import { HotelRoomCard } from '../../components/hotel-room-card/hotel-room-card';
import { HotelReviewsSection } from '../../components/hotel-reviews-section/hotel-reviews-section';

interface BookingParams extends Params {
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}

@Component({
  selector: 'app-hotel-details-page',
  standalone: true,
  imports: [ReactiveFormsModule, HotelBookingFilters, HotelRoomCard, HotelReviewsSection],
  templateUrl: './hotel-details-page.html',
  styleUrl: './hotel-details-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelDetailsPage {
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hotelService = inject(HotelService);

  readonly isLoadingRooms = signal(false);
  readonly guests = signal<number>(1);

  protected readonly queryParams = toSignal(this.route.queryParams as Observable<BookingParams>, {
    initialValue: {} as BookingParams,
  });

  readonly hasValidDates = computed(() => {
    const params = this.queryParams();
    return !!(params.checkIn && params.checkOut);
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

  readonly availableRooms = computed(() => {
    const currentHotel = this.hotel();
    return currentHotel?.rooms?.filter((room) => room.capacity >= this.guests()) ?? [];
  });

  handleFilterChange(filters: { checkIn: string; checkOut: string }) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...filters,
        guests: this.guests(),
      },
      queryParamsHandling: 'merge',
    });
  }

  reserve(roomId: number) {
    const qp = this.queryParams();

    this.router.navigate(['/reservations/create'], {
      queryParams: {
        hotelId: this.hotel()?.id,
        roomId,
        checkIn: qp.checkIn,
        checkOut: qp.checkOut,
        guests: this.guests(),
      },
    });
  }
}
