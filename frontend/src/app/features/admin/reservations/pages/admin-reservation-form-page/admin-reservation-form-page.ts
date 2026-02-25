import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../../../reservations/services/reservation-service';

@Component({
  selector: 'app-admin-reservation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-reservation-form-page.html',
  styleUrl: './admin-reservation-form-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'admin-page-container',
  },
})
export class AdminReservationFormPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly reservationService = inject(ReservationService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    userId: [0, [Validators.required, Validators.min(1)]],
    roomId: [0, [Validators.required, Validators.min(1)]],
    checkInDate: ['', [Validators.required]],
    checkOutDate: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const rawValue = this.form.getRawValue();

    this.reservationService.createReservation(rawValue).subscribe({
      next: (res) => {
        console.log('Reserva creada:', res);
        this.isLoading.set(false);
        this.form.reset();
      },
      error: (err) => {
        this.errorMessage.set('Error al crear la reserva. Revisa los datos.');
        this.isLoading.set(false);
      },
    });
  }
}
