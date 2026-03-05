import { Component, inject, signal, input, output, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';
import { ReservationService } from '../../services/reservation-service';
import { ToastService } from '../../../../core/services/toast-service';
import { ReservationResponse } from '../../../../core/models/reservation.model';

@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule, DatePicker],
  templateUrl: './reservation-card.html',
  styleUrl: './reservation-card.css',
})
export class ReservationCard {
  res = input.required<ReservationResponse>();
  refresh = output<void>();

  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  readonly isEditing = signal(false);

  readonly editForm = new FormGroup({
    checkInDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    checkOutDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected readonly statusConfig = computed(() => {
    const status = this.res().status;
    switch (status) {
      case 'COMPLETED' as any:
        return { label: 'Completada', class: 'status-completed' };
      case 'CANCELLED' as any:
        return { label: 'Cancelada', class: 'status-cancelled' };
      default:
        return { label: 'Confirmada', class: 'status-confirmed' };
    }
  });

  onEdit() {
    this.editForm.patchValue({
      checkInDate: this.res().checkInDate,
      checkOutDate: this.res().checkOutDate,
    });
    this.isEditing.set(true);
  }

  onCancelEdit() {
    this.isEditing.set(false);
    this.editForm.reset();
  }

  onUpdate() {
    if (this.editForm.invalid) return;

    this.reservationService
      .updateReservation(this.res().id, this.editForm.getRawValue())
      .subscribe({
        next: () => {
          this.toast.show({ type: 'success', message: 'Reserva modificada con éxito' });
          this.isEditing.set(false);
          this.refresh.emit();
        },
        error: (err) =>
          this.toast.show({ type: 'error', message: err.error?.message || 'Error al actualizar' }),
      });
  }

  onCancelReservation() {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservationService.cancelReservation(this.res().id).subscribe({
        next: () => {
          this.toast.show({ type: 'success', message: 'Reserva cancelada correctamente' });
          this.refresh.emit();
        },
        error: () => this.toast.show({ type: 'error', message: 'No se pudo cancelar la reserva' }),
      });
    }
  }
}
