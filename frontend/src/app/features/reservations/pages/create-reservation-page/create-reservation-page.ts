import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { Card } from '../../../../shared/ui/card/card';
import { Input } from '../../../../shared/ui/input/input';
import { ReservationService } from '../../services/reservation-service';
import { ToastService } from '../../../../core/services/toast-service';

@Component({
  selector: 'app-create-reservation-page',
  imports: [ReactiveFormsModule, Button, Input, Card],
  templateUrl: './create-reservation-page.html',
  styleUrl: './create-reservation-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReservationPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);

  private readonly hotelId = Number(this.route.snapshot.paramMap.get('hotelId'));
  private readonly roomId = Number(this.route.snapshot.paramMap.get('roomId'));

  readonly form = this.fb.nonNullable.group({
    checkIn: ['', Validators.required],
    checkOut: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;

    const { checkIn, checkOut } = this.form.getRawValue();

    if (new Date(checkOut) <= new Date(checkIn)) {
      this.toast.show({
        type: 'error',
        message: 'Check-out must be after check-in',
      });
      return;
    }

    this.loading.set(true);

    this.reservationService
      .createReservation(this.hotelId, this.roomId, checkIn, checkOut)
      .subscribe(() => {
        this.toast.show({
          type: 'success',
          message: 'Reservation created successfully',
        });

        this.router.navigate(['/reservations']);
      });
  }
}
