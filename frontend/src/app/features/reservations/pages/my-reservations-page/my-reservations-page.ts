import { Component, computed, inject, signal } from '@angular/core';
import { ReservationService } from '../../services/reservation-service';
import { AuthService } from '../../../../core/services/auth-service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop'; // Importar toObservable
import { filter, switchMap, map } from 'rxjs'; // Importar map
import { DatePipe } from '@angular/common';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-my-reservations-page',
  standalone: true, // Asegúrate de tener esto si usas imports
  imports: [DatePipe],
  templateUrl: './my-reservations-page.html',
  styleUrl: './my-reservations-page.css',
})
export class MyReservationsPage {
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  private readonly refreshTrigger = signal<number>(0);
  readonly userId = computed(() => this.authService.currentUser()?.id);

  // Convertimos el estado (userId + refreshTrigger) en un Observable para usar operators
  readonly reservations = toSignal(
    toObservable(computed(() => ({ id: this.userId(), refresh: this.refreshTrigger() }))).pipe(
      filter((data) => !!data.id),
      switchMap((data) => this.reservationService.getReservationsByUserId(data.id!)),
      // Aseguramos que siempre devuelva un array para evitar errores de .length en el HTML
      map((res) => res || []),
    ),
    { initialValue: [] }, // Valor inicial vacío para que .length exista desde el inicio
  );

  readonly isLoading = computed(() => this.reservations() === undefined);

  onCancel(id: number) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservationService.cancelReservation(id).subscribe({
        next: () => {
          this.toast.show({ type: 'success', message: 'Reserva cancelada correctamente' });
          this.refreshTrigger.update((v) => v + 1);
        },
        error: () => this.toast.show({ type: 'error', message: 'No se pudo cancelar la reserva' }),
      });
    }
  }
}
