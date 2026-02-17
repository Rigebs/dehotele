import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button';
import { Input } from '../../../../shared/ui/input/input';

@Component({
  selector: 'app-hotel-filter',
  imports: [ReactiveFormsModule, Button, Input],
  templateUrl: './hotel-filter.html',
  styleUrl: './hotel-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelFilter {
  private readonly fb = inject(FormBuilder);

  readonly filterChanged = output<{
    checkIn: string | null;
    checkOut: string | null;
  }>();

  readonly form = this.fb.group({
    checkIn: [''],
    checkOut: [''],
  });

  apply() {
    this.filterChanged.emit(this.form.getRawValue());
  }
}
