import {
  Component,
  inject,
  computed,
  ChangeDetectionStrategy,
  input,
  output,
  effect,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hotel-booking-filters',
  imports: [ReactiveFormsModule, DatePicker],
  templateUrl: './hotel-booking-filters.html',
  styleUrl: './hotel-booking-filters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelBookingFilters {
  private readonly fb = inject(FormBuilder);

  initialCheckIn = input('');
  initialCheckOut = input('');
  filterChange = output<{ checkIn: string; checkOut: string }>();

  readonly today = new Date();

  readonly reservationForm = this.fb.nonNullable.group({
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
  });

  private readonly checkInValue = toSignal(this.reservationForm.controls.checkInDate.valueChanges);

  readonly minCheckOut = computed(() => {
    const checkIn = this.checkInValue();
    return checkIn ? new Date(checkIn) : this.today;
  });

  constructor() {
    effect(() => {
      this.reservationForm.patchValue({
        checkInDate: this.initialCheckIn(),
        checkOutDate: this.initialCheckOut(),
      });
    });
  }

  onSearch(): void {
    if (this.reservationForm.invalid) return;

    const { checkInDate, checkOutDate } = this.reservationForm.getRawValue();
    this.filterChange.emit({
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });
  }
}
