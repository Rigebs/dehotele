import {
  Component,
  Input,
  ElementRef,
  HostListener,
  signal,
  computed,
  forwardRef,
  ChangeDetectionStrategy,
  input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: unknown;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true,
    },
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class Select implements ControlValueAccessor {
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Select option');
  label = input<string | undefined>();

  private readonly elementRef = inject(ElementRef);
  readonly popoverId = `select-${Math.random().toString(36).substring(2, 9)}`;

  isOpen = signal(false);
  selectedValue = signal<unknown>(null);
  selectedOption = computed(() => this.options().find((o) => o.value === this.selectedValue()));

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: unknown): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  toggle(btn: HTMLElement): void {
    const menu = document.getElementById(this.popoverId) as any;
    if (!this.isOpen()) {
      this.checkPosition(btn);
      menu?.showPopover();
    } else {
      menu?.hidePopover();
    }
    this.isOpen.update((v) => !v);
    this.onTouched();
  }

  select(option: SelectOption): void {
    this.selectedValue.set(option.value);
    this.onChange(option.value);

    const menu = document.getElementById(this.popoverId) as any;
    menu?.hidePopover();
    this.isOpen.set(false);
  }

  onWindowScroll(): void {
    if (this.isOpen()) {
      const btn = this.elementRef.nativeElement.querySelector('.select-box');
      if (btn) this.checkPosition(btn);
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      const menu = document.getElementById(this.popoverId) as any;
      menu?.hidePopover();
      this.isOpen.set(false);
    }
  }

  private checkPosition(btn: HTMLElement): void {
    const menu = document.getElementById(this.popoverId);
    if (!menu) return;

    const rect = btn.getBoundingClientRect();
    const vH = window.innerHeight;
    const vW = window.innerWidth;
    const dropdownHeight = 250;

    menu.style.position = 'fixed';
    menu.style.inset = 'unset';
    menu.style.width = `${rect.width}px`;

    if (vH - rect.bottom < dropdownHeight && rect.top > dropdownHeight) {
      menu.style.top = 'auto';
      menu.style.bottom = `${vH - rect.top + 4}px`;
    } else {
      menu.style.bottom = 'auto';
      menu.style.top = `${rect.bottom + 4}px`;
    }

    menu.style.left = `${rect.left}px`;
  }
}
