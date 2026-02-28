import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  input,
  signal,
  computed,
  forwardRef,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
  ],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(window:scroll)': 'onWindowScroll()',
  },
})
export class DatePicker implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('Seleccionar fecha');
  minDate = input<Date | undefined>();
  maxDate = input<Date | undefined>();

  private readonly elementRef = inject(ElementRef);
  readonly popoverId = `datepicker-${Math.random().toString(36).substring(2, 9)}`;

  isOpen = signal(false);
  selectedDate = signal<Date | null>(null);
  currentMonth = signal(new Date());
  monthDirection = signal<'left' | 'right'>('right');

  readonly weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  readonly months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  years = computed(() => {
    const min = this.minDate()?.getFullYear() ?? new Date().getFullYear() - 5;
    const max = this.maxDate()?.getFullYear() ?? new Date().getFullYear() + 5;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  });

  calendarDays = computed(() => {
    const date = this.currentMonth();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const days: (number | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= lastDay; i++) days.push(i);
    return days;
  });

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    if (value && typeof value === 'string') {
      // value viene como "YYYY-MM-DD"
      const [year, month, day] = value.split('-').map(Number);

      // Creamos la fecha usando el constructor de números (esto siempre es LOCAL)
      // El mes es 0-indexado en JS, por eso restamos 1
      const date = new Date(year, month - 1, day);

      this.selectedDate.set(date);
      this.currentMonth.set(date);
    } else {
      this.selectedDate.set(null);
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
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

  selectDate(day: number): void {
    const month = this.currentMonth();
    const selected = new Date(month.getFullYear(), month.getMonth(), day);
    if (this.isDisabled(selected)) return;

    this.selectedDate.set(selected);
    this.onChange(this.formatDate(selected));

    const menu = document.getElementById(this.popoverId) as any;
    menu?.hidePopover();
    this.isOpen.set(false);
  }

  updateMonth(monthIndex: number): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), monthIndex, 1));
  }

  updateYear(year: number): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(year, current.getMonth(), 1));
  }

  previousMonth(): void {
    const current = this.currentMonth();
    this.monthDirection.set('left');
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const current = this.currentMonth();
    this.monthDirection.set('right');
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  isSelected(day: number): boolean {
    const selected = this.selectedDate();
    const current = this.currentMonth();
    return (
      !!selected &&
      selected.getDate() === day &&
      selected.getMonth() === current.getMonth() &&
      selected.getFullYear() === current.getFullYear()
    );
  }

  isDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    return (!!min && date < min) || (!!max && date > max);
  }

  getDateForDay(day: number): Date {
    const current = this.currentMonth();
    return new Date(current.getFullYear(), current.getMonth(), day);
  }

  onWindowScroll(): void {
    if (this.isOpen()) {
      const btn = this.elementRef.nativeElement.querySelector('.input');
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
    const cHeight = 350;
    const cWidth = 300;

    menu.style.position = 'fixed';
    menu.style.inset = 'unset';

    if (vH - rect.bottom < cHeight && rect.top > cHeight) {
      menu.style.top = 'auto';
      menu.style.bottom = `${vH - rect.top + 5}px`;
    } else {
      menu.style.bottom = 'auto';
      menu.style.top = `${rect.bottom + 5}px`;
    }

    if (rect.left + cWidth > vW) {
      menu.style.left = 'auto';
      menu.style.right = `${vW - rect.right}px`;
    } else {
      menu.style.right = 'auto';
      menu.style.left = `${rect.left}px`;
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
