import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap } from 'rxjs';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';

@Component({
  selector: 'app-hotel-details-page',
  imports: [ReactiveFormsModule, CommonModule, DatePicker],
  templateUrl: './hotel-details-page.html',
  styleUrl: './hotel-details-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly hotelService = inject(HotelService);

  private readonly router = inject(Router);

  readonly today = new Date();

  readonly guests = signal<number>(1);

  readonly hotel = toSignal(
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
      switchMap(([params, queryParams]) => {
        const id = Number(params.get('id'));

        // Extraemos los query params de la URL
        const capacity = Number(queryParams.get('guests')) || 1; // Usamos 'guests' según tu URL
        const checkIn = queryParams.get('checkIn') ?? '';
        const checkOut = queryParams.get('checkOut') ?? '';

        return this.hotelService.getHotelAvailable(id, capacity, checkIn, checkOut);
      }),
    ),
    { initialValue: null },
  );

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
