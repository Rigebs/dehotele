import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Input } from '../../../../shared/ui/input/input';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  selector: 'app-hero',
  imports: [Input, Button, ReactiveFormsModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private readonly fb = inject(FormBuilder);

  readonly search = output<{
    checkIn: string | null;
    checkOut: string | null;
  }>();

  readonly form = this.fb.group({
    checkIn: [''],
    checkOut: [''],
  });

  submit() {
    this.search.emit(this.form.getRawValue());
  }
}
