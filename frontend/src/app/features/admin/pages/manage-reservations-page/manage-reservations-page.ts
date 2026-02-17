import { Component, inject, signal } from '@angular/core';
import { ReservationResponse } from '../../../../core/models/reservation.models';
import { AdminService } from '../../services/admin-service';

@Component({
  selector: 'app-manage-reservations-page',
  imports: [],
  templateUrl: './manage-reservations-page.html',
  styleUrl: './manage-reservations-page.css',
})
export class ManageReservationsPage {
  private readonly adminService = inject(AdminService);

  readonly reservations = signal<readonly ReservationResponse[]>([]);

  constructor() {
    this.load();
  }

  load() {
    this.adminService.getAllReservations().subscribe((data) => {
      this.reservations.set(data);
    });
  }

  updateStatus(id: number, status: 'CONFIRMED' | 'CANCELLED') {
    this.adminService.updateReservationStatus(id, status).subscribe(() => {
      this.load();
    });
  }
}
