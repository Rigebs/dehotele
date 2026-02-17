import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { HotelFilter } from '../../components/hotel-filter/hotel-filter';
import { HotelService } from '../../services/hotel-service';
import { HotelResponse } from '../../../../core/models/hotel.models';
import { HotelCard } from '../../components/hotel-card/hotel-card';

@Component({
  selector: 'app-hotels-page',
  imports: [HotelCard, HotelFilter],
  templateUrl: './hotels-page.html',
  styleUrl: './hotels-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsPage {
  private readonly hotelService = inject(HotelService);

  readonly page = signal(0);
  readonly size = signal(6);

  readonly hotels = signal<readonly HotelResponse[]>([]);
  readonly totalPages = signal(0);

  readonly checkIn = signal<string | null>(null);
  readonly checkOut = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.loadHotels();
    });
  }

  loadHotels() {
    this.hotelService
      .getHotels(
        this.page(),
        this.size(),
        this.checkIn() ?? undefined,
        this.checkOut() ?? undefined,
      )
      .subscribe((response) => {
        this.hotels.set(response.content);
        this.totalPages.set(response.totalPages);
      });
  }

  onFilter(event: { checkIn: string | null; checkOut: string | null }) {
    this.checkIn.set(event.checkIn);
    this.checkOut.set(event.checkOut);
    this.page.set(0);
  }

  nextPage() {
    if (this.page() + 1 < this.totalPages()) {
      this.page.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.page() > 0) {
      this.page.update((p) => p - 1);
    }
  }
}
