import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReservationResponse } from '../../../../core/models/reservation.model';
import { ReservationService } from '../../services/reservation-service';

@Component({
  selector: 'app-my-reservations-page',
  imports: [],
  templateUrl: './my-reservations-page.html',
  styleUrl: './my-reservations-page.css',
})
export class MyReservationsPage {
  private readonly reservationsService = inject(ReservationService);

  private readonly _reservations = signal<readonly ReservationResponse[]>([]);
  private readonly _isLoading = signal(true);
  private readonly _page = signal(0);
  private readonly _totalPages = signal(0);

  readonly reservations = computed(() => this._reservations());
  readonly isLoading = computed(() => this._isLoading());
  readonly page = computed(() => this._page());
  readonly totalPages = computed(() => this._totalPages());

  constructor() {
    effect(() => {
      this.loadReservations(this._page());
    });
  }

  private loadReservations(page: number): void {
    this._isLoading.set(true);

    this.reservationsService.getMyReservations(page).subscribe({
      next: (response) => {
        this._reservations.set(response.content);
        this._totalPages.set(response.totalPages);
        this._isLoading.set(false);
      },
      error: () => {
        this._isLoading.set(false);
      },
    });
  }

  cancel(id: number): void {
    this.reservationsService.cancelReservation(id).subscribe({
      next: () => {
        // Recargar lista
        this.loadReservations(this._page());
      },
    });
  }

  nextPage(): void {
    this._page.update((p) => p + 1);
  }

  previousPage(): void {
    this._page.update((p) => p - 1);
  }
}
