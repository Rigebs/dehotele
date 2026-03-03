import {
  Component,
  ChangeDetectionStrategy,
  inject,
  output,
  computed,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Button } from '../../../../shared/ui/button/button';
import { DatePicker } from '../../../../shared/ui/date-picker/date-picker';
import { Select } from '../../../../shared/ui/select/select';

export interface SearchFormValue {
  city: string | null;
  guests: number;
  checkIn: string | null;
  checkOut: string | null;
}

interface SearchFormGroup {
  city: FormControl<string | null>;
  guests: FormControl<number>;
  checkIn: FormControl<string | null>;
  checkOut: FormControl<string | null>;
}

@Component({
  selector: 'app-hero',
  imports: [ReactiveFormsModule, Button, DatePicker, Select],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly fb = inject(FormBuilder);

  readonly today = new Date();
  readonly search = output<SearchFormValue>();

  readonly form: FormGroup<SearchFormGroup> = this.fb.group({
    city: this.fb.control<string | null>(''),
    guests: this.fb.nonNullable.control(1, Validators.required),
    checkIn: this.fb.control<string | null>(null),
    checkOut: this.fb.control<string | null>(null),
  });

  readonly guestOptions = [
    { label: '1 Guest', value: 1 },
    { label: '2 Guests', value: 2 },
    { label: '3 Guests', value: 3 },
    { label: '4+ Guests', value: 4 },
  ];

  private readonly checkInValue = toSignal(this.form.controls.checkIn.valueChanges);

  readonly checkOutMinDate = computed(() => {
    const checkIn = this.checkInValue();
    if (!checkIn) return this.today;

    const date = new Date(checkIn);
    date.setDate(date.getDate() + 1);
    return date;
  });

  constructor() {
    this.form.controls.checkIn.valueChanges.pipe(takeUntilDestroyed()).subscribe((newCheckIn) => {
      const currentCheckOut = this.form.controls.checkOut.value;
      if (newCheckIn && currentCheckOut && new Date(currentCheckOut) <= new Date(newCheckIn)) {
        this.form.controls.checkOut.setValue(null);
      }
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.search.emit(this.form.getRawValue());
  }
}
