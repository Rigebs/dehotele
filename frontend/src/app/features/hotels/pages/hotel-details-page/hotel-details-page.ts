import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HotelService } from '../../services/hotel-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
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

  readonly today = new Date();

  readonly guests = signal<number>(1);

  readonly hotel = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        return this.hotelService.getHotelById(id);
      }),
    ),
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
    const checkIn = this.route.snapshot.queryParamMap.get('checkIn');
    const checkOut = this.route.snapshot.queryParamMap.get('checkOut');
  }

  reserve(roomId: number) {
    if (this.reservationForm.invalid) return;
    const { checkInDate, checkOutDate } = this.reservationForm.getRawValue();
    alert(`Habitación ${roomId} reservada del ${checkInDate} al ${checkOutDate}`);
  }
}
