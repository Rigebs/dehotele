import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  effect,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-details-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './hotel-details-page.html',
  styleUrl: './hotel-details-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  // 🔎 Query params state
  readonly checkIn = signal<string | null>(null);
  readonly checkOut = signal<string | null>(null);
  readonly guests = signal<number>(1);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.checkIn.set(params['checkIn'] ?? null);
      this.checkOut.set(params['checkOut'] ?? null);
      this.guests.set(Number(params['guests'] ?? 1));

      if (params['checkIn'] && params['checkOut']) {
        this.reservationForm.patchValue({
          checkInDate: params['checkIn'],
          checkOutDate: params['checkOut'],
        });
      }
    });
  }

  // 🔥 MOCK HOTEL
  readonly hotel = signal({
    id: 1,
    name: 'Grand Palace Hotel',
    description:
      'Luxury hotel in the heart of the city with premium services and unforgettable experience.',
    city: 'Madrid',
    address: 'Gran Vía 123',
    rating: 4.7,
    reviews: 324,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Parking'],
  });

  readonly rooms = signal([
    { id: 1, type: 'Standard Room', capacity: 2, price: 120 },
    { id: 2, type: 'Deluxe Room', capacity: 3, price: 180 },
    { id: 3, type: 'Suite', capacity: 4, price: 250 },
  ]);

  // ✅ Filtrado automático según huéspedes
  readonly availableRooms = computed(() =>
    this.rooms().filter((room) => room.capacity >= this.guests()),
  );

  readonly reservationForm = this.fb.nonNullable.group({
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
  });

  reserve(roomId: number) {
    if (this.reservationForm.invalid) return;

    const { checkInDate, checkOutDate } = this.reservationForm.getRawValue();

    alert(`Room ${roomId} reserved from ${checkInDate} to ${checkOutDate}`);
  }
}
