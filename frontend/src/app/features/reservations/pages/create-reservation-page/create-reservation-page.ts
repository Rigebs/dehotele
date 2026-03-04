import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservationService } from '../../services/reservation-service';
import { ToastService } from '../../../../core/services/toast-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HotelService } from '../../../hotels/services/hotel-service';
import { DatePipe, Location } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-create-reservation-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './create-reservation-page.html',
  styleUrl: './create-reservation-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hotelService = inject(HotelService);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);
  protected readonly authService = inject(AuthService);
  readonly location = inject(Location);

  readonly isSubmitting = signal(false);

  private readonly queryParams = toSignal(this.route.queryParams);

  readonly hotelId = computed(() => Number(this.queryParams()?.['hotelId']));
  readonly roomId = computed(() => Number(this.queryParams()?.['roomId']));
  readonly checkIn = computed(() => this.queryParams()?.['checkIn']);
  readonly checkOut = computed(() => this.queryParams()?.['checkOut']);

  private readonly isCompleted = signal(false);

  readonly hotel = toSignal(this.hotelService.getHotelById(this.hotelId()));

  readonly selectedRoom = computed(() => this.hotel()?.rooms.find((r) => r.id === this.roomId()));

  readonly nights = computed(() => {
    const start = new Date(this.checkIn());
    const end = new Date(this.checkOut());
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  });

  constructor() {
    effect(() => {
      const userId = this.authService.currentUser()?.id;
      if (userId && this.roomId() && this.checkIn()) {
        this.reservationService
          .checkAvailability(this.roomId(), this.checkIn(), this.checkOut())
          .subscribe((available) => {
            if (!available) {
              this.toast.show({
                type: 'error',
                message: 'Esta habitación ya no está disponible para estas fechas.',
              });
              this.router.navigate(['/']);
            }
          });
      }
    });
  }

  readonly totalAmount = computed(() => (this.selectedRoom()?.pricePerNight ?? 0) * this.nights());

  canExit(): boolean {
    if (this.isCompleted()) return true;

    if (this.isSubmitting()) {
      return confirm('Tu reserva se está procesando. ¿Estás seguro de que quieres salir?');
    }

    return true;
  }

  onSubmit() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) {
      this.toast.show({ type: 'error', message: 'Debes iniciar sesión' });
      return;
    }

    // 2. Activar carga
    this.isSubmitting.set(true);

    const payload = {
      roomId: this.roomId(),
      userId: userId,
      checkInDate: this.checkIn(),
      checkOutDate: this.checkOut(),
    };

    this.reservationService.createReservation(payload).subscribe({
      next: () => {
        this.isCompleted.set(true);
        this.toast.show({ type: 'success', message: '¡Reserva realizada con éxito!' });
        this.router.navigate(['/reservations/my'], { replaceUrl: true });
      },
      error: () => {
        this.toast.show({ type: 'error', message: 'Error al procesar la reserva' });
        this.isSubmitting.set(false);
      },
    });
  }
}
