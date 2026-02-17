import { Component, inject, signal } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { HotelResponse } from '../../../../core/models/hotel.models';

@Component({
  selector: 'app-manage-hotels-page',
  imports: [],
  templateUrl: './manage-hotels-page.html',
  styleUrl: './manage-hotels-page.css',
})
export class ManageHotelsPage {
  private readonly adminService = inject(AdminService);

  readonly hotels = signal<readonly HotelResponse[]>([]);

  constructor() {
    this.load();
  }

  load() {
    this.adminService.getHotels().subscribe((data) => {
      this.hotels.set(data);
    });
  }

  delete(id: number) {
    if (!confirm('Are you sure you want to delete this hotel?')) return;

    this.adminService.deleteHotel(id).subscribe(() => {
      this.load();
    });
  }
}
