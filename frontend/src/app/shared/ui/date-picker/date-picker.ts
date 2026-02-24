import { Component, forwardRef, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
  ],
})
export class DatePicker implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = 'Seleccionar fecha';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;

  isOpen = signal(false);
  selectedDate = signal<Date | null>(null);
  currentMonth = signal(new Date());

  weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  monthDirection = signal<'left' | 'right'>('right');

  years = computed(() => {
    const minYear = this.minDate ? this.minDate.getFullYear() : new Date().getFullYear();

    const maxYear = this.maxDate ? this.maxDate.getFullYear() : minYear + 5;

    return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
  });

  months = [
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

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string | null): void {
    if (value) {
      const date = new Date(value);
      this.selectedDate.set(date);
      this.currentMonth.set(date);
    } else {
      this.selectedDate.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  toggle() {
    this.isOpen.update((v) => !v);
    this.onTouched();
  }

  selectDate(day: number) {
    const month = this.currentMonth();
    const selected = new Date(month.getFullYear(), month.getMonth(), day);

    if (this.isDisabled(selected)) return;

    this.selectedDate.set(selected);
    this.onChange(this.formatDate(selected));
    this.isOpen.set(false);
  }

  updateMonth(monthIndex: number) {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), monthIndex, 1));
  }

  updateYear(year: number) {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(year, current.getMonth(), 1));
  }

  previousMonth() {
    const current = this.currentMonth();
    const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);

    if (this.minDate && prev < new Date(this.minDate.getFullYear(), this.minDate.getMonth(), 1)) {
      return;
    }

    this.monthDirection.set('left');
    this.currentMonth.set(prev);
  }

  nextMonth() {
    this.monthDirection.set('right');
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isSelected(day: number): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;

    const current = this.currentMonth();
    return (
      selected.getDate() === day &&
      selected.getMonth() === current.getMonth() &&
      selected.getFullYear() === current.getFullYear()
    );
  }

  isDisabled(date: Date): boolean {
    if (this.minDate && date < this.minDate) return true;
    if (this.maxDate && date > this.maxDate) return true;
    return false;
  }
  getCalendarDays(): (number | null)[] {
    const date = this.currentMonth();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Lunes como primer día

    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const days: (number | null)[] = [];

    for (let i = 0; i < offset; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay; i++) {
      days.push(i);
    }

    return days;
  }

  getDateForDay(day: number): Date {
    const current = this.currentMonth();
    return new Date(current.getFullYear(), current.getMonth(), day);
  }
}
