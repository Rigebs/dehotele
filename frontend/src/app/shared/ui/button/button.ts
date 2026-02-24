import { ChangeDetectionStrategy, Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrls: ['./button.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Button),
      multi: true,
    },
  ],
})
export class Button implements ControlValueAccessor {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() loading = false;

  // 🔥 usamos signal para disabled interno
  private _disabled = signal(false);

  @Input()
  set disabled(value: boolean) {
    this._disabled.set(value);
  }

  get disabled(): boolean {
    return this._disabled();
  }

  // ControlValueAccessor
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }
}
