import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: {
    class: 'ui-button-host',
  },
})
export class Button {
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
}
