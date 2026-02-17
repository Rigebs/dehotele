import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.html',
  styleUrl: './input.css',
})
export class Input {
  readonly label = input.required<string>();
  readonly type = input<'text' | 'email' | 'password' | 'date'>('text');
  readonly control = input.required<any>();
}
