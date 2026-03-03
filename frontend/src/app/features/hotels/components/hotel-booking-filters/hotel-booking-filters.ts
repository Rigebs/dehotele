import { Component, EventEmitter, Input, Output, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';

@Component({
  selector: 'app-hotel-booking-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePicker],
  templateUrl: './hotel-booking-filters.html',
  styleUrl: './hotel-booking-filters.css',
})
export class HotelBookingFilters implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Recibimos los valores iniciales para sincronizar con la URL
  @Input() initialCheckIn = '';
  @Input() initialCheckOut = '';

  // Evento para avisar al padre que debe navegar o actualizar
  @Output() filterChange = new EventEmitter<{ checkIn: string; checkOut: string }>();

  readonly today = new Date();

  readonly reservationForm = this.fb.nonNullable.group({
    checkInDate: ['', Validators.required],
    checkOutDate: ['', Validators.required],
  });

  // Lógica de fecha mínima para el Check-out
  readonly minCheckOut = computed(() => {
    const checkIn = this.reservationForm.get('checkInDate')?.value;
    return checkIn ? new Date(checkIn) : new Date();
  });

  ngOnInit() {
    if (this.initialCheckIn || this.initialCheckOut) {
      this.reservationForm.patchValue({
        checkInDate: this.initialCheckIn,
        checkOutDate: this.initialCheckOut,
      });
    }
  }

  onSearch() {
    if (this.reservationForm.invalid) return;

    const { checkInDate, checkOutDate } = this.reservationForm.getRawValue();
    this.filterChange.emit({
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });
  }
}
