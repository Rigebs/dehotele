import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelResponse, RoomResponse } from '../../../../core/models/hotel.models';
import { HotelService } from '../../services/hotel-service';

@Component({
  selector: 'app-hotel-details-page',
  templateUrl: './hotel-details-page.html',
  styleUrl: './hotel-details-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly hotelService = inject(HotelService);

  readonly hotel = signal<HotelResponse | null>(null);
  readonly rooms = signal<readonly RoomResponse[]>([]);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.hotelService.getHotelById(id).subscribe((h) => {
      this.hotel.set(h);
    });
  }
}
