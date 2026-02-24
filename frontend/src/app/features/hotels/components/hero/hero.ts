import { Component, inject, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from '../../../../shared/ui/button/button';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';
import { Select } from '../../../../shared/ui/select/select';

export interface SearchFormValue {
  city: string;
  guests: number;
  checkIn: string | null;
  checkOut: string | null;
}

interface SearchFormGroup {
  city: FormControl<string>;
  guests: FormControl<number>;
  checkIn: FormControl<string | null>;
  checkOut: FormControl<string | null>;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ReactiveFormsModule, Button, DatePicker, Select],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private readonly fb = inject(FormBuilder);

  today = new Date();

  readonly search = output<SearchFormValue>();

  readonly form: FormGroup<SearchFormGroup> = this.fb.group({
    city: this.fb.nonNullable.control('', Validators.required),
    guests: this.fb.nonNullable.control(1, Validators.required),
    checkIn: this.fb.control<string | null>(null),
    checkOut: this.fb.control<string | null>(null),
  });

  // Opciones para tu componente Select
  readonly guestOptions = [
    { label: '1 Guest', value: 1 },
    { label: '2 Guests', value: 2 },
    { label: '3 Guests', value: 3 },
    { label: '4+ Guests', value: 4 },
  ];

  constructor() {
    this.form.controls.checkIn.valueChanges.pipe(takeUntilDestroyed()).subscribe((newCheckIn) => {
      const currentCheckOut = this.form.controls.checkOut.value;

      if (!newCheckIn || !currentCheckOut) return;

      const inDate = new Date(newCheckIn);
      const outDate = new Date(currentCheckOut);

      if (outDate <= inDate) {
        this.form.controls.checkOut.setValue(null);
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const value: SearchFormValue = this.form.getRawValue();
    this.search.emit(value);
  }

  get checkOutMinDate(): Date {
    const checkIn = this.form.controls.checkIn.value;

    if (checkIn) {
      const date = new Date(checkIn);
      date.setDate(date.getDate() + 1);
      return date;
    }

    return this.today;
  }
}
