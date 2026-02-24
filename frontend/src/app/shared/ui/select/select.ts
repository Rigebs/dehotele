import {
  Component,
  Input,
  ElementRef,
  HostListener,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.html',
  styleUrls: ['./select.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
})
export class Select implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Select option';
  @Input() label?: string;

  // 🔥 SIGNALS
  isOpen = signal(false);
  selectedValue = signal<any>(null);

  selectedOption = computed(() => this.options.find((o) => o.value === this.selectedValue()));

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  toggle() {
    this.isOpen.update((v) => !v);
  }

  select(option: SelectOption) {
    this.selectedValue.set(option.value);
    this.isOpen.set(false);

    this.onChange(option.value);
    this.onTouched();
  }

  // 🔥 CONTROL VALUE ACCESSOR METHODS

  writeValue(value: any): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // opcional si quieres manejar disabled visualmente
  }

  // ✅ CLICK OUTSIDE
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
