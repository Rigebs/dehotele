import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap, map } from 'rxjs';
import { ReservationService } from '../../services/reservation-service';
import { AuthService } from '../../../../core/services/auth-service';
import { ToastService } from '../../../../core/services/toast-service';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';

@Component({
  selector: 'app-my-reservations-page',
  imports: [DatePipe, ReactiveFormsModule, DatePicker],
  templateUrl: './my-reservations-page.html',
  styleUrl: './my-reservations-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyReservationsPage {
  private readonly reservationService = inject(ReservationService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  private readonly refreshTrigger = signal<number>(0);
  readonly userId = computed(() => this.authService.currentUser()?.id);

  // Estado para la edición
  readonly editingReservationId = signal<number | null>(null);

  // Formulario Reactivo para modificación
  readonly editForm = new FormGroup({
    checkInDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    checkOutDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  readonly reservations = toSignal(
    toObservable(computed(() => ({ id: this.userId(), refresh: this.refreshTrigger() }))).pipe(
      filter((data) => !!data.id),
      switchMap((data) => this.reservationService.getReservationsByUserId(data.id!)),
      map((res) => res || []),
    ),
    { initialValue: [] },
  );

  readonly isLoading = computed(() => this.reservations() === undefined);

  // --- Acciones ---

  onEdit(res: any) {
    this.editingReservationId.set(res.id);
    this.editForm.patchValue({
      checkInDate: res.checkInDate,
      checkOutDate: res.checkOutDate,
    });
  }

  onCancelEdit() {
    this.editingReservationId.set(null);
    this.editForm.reset();
  }

  onUpdate(id: number) {
    if (this.editForm.invalid) return;

    const updateData = this.editForm.getRawValue();
    this.reservationService.updateReservation(id, updateData).subscribe({
      next: () => {
        this.toast.show({ type: 'success', message: 'Reserva modificada con éxito' });
        this.editingReservationId.set(null);
        this.refreshTrigger.update((v) => v + 1);
      },
      error: (err) =>
        this.toast.show({ type: 'error', message: err.error?.message || 'Error al actualizar' }),
    });
  }

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
