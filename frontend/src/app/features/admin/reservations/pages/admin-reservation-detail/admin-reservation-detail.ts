import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminReservationService } from '../../../services/admin-reservation-service';
import { ReservationResponse } from '../../../../../core/models/reservation.model';

@Component({
  selector: 'app-admin-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-reservation-detail.html',
  styleUrls: ['./admin-reservation-detail.css'],
})
export class AdminReservationDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private adminService = inject(AdminReservationService);

  reservation = signal<ReservationResponse | null>(null);
  isLoading = signal(false);
  isProcessing = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadReservation(Number(id));
    }
  }

  loadReservation(id: number) {
    this.isLoading.set(true);
    this.adminService.getById(id).subscribe({
      next: (res) => {
        this.reservation.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/admin/reservations']);
      },
    });
  }

  handleComplete() {
    const res = this.reservation();
    if (!res || this.isProcessing()) return;

    if (
      confirm(
        '¿Estás seguro de que deseas completar esta reserva? Esta acción no se puede deshacer.',
      )
    ) {
      this.isProcessing.set(true);
      this.adminService.complete(res.id).subscribe({
        next: () => {
          this.isProcessing.set(false);
          this.loadReservation(res.id); // Recargamos para ver el cambio de estado
        },
        error: (err) => {
          this.isProcessing.set(false);
          alert(err.error?.message || 'Error al completar la reserva');
        },
      });
    }
  }

  getDaysCount(): number {
    const res = this.reservation();
    if (!res) return 0;
    const start = new Date(res.checkInDate);
    const end = new Date(res.checkOutDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
}
