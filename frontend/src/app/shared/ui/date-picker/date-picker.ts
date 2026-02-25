import {
  Component,
  forwardRef,
  Input,
  signal,
  computed,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
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

  private elementRef = inject(ElementRef);

  isOpen = signal(false);
  alignRight = signal(false); // Nueva señal para control de colisión
  selectedDate = signal<Date | null>(null);
  currentMonth = signal(new Date());

  weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  monthDirection = signal<'left' | 'right'>('right');

  years = computed(() => {
    const minYear = this.minDate ? this.minDate.getFullYear() : new Date().getFullYear() - 5;
    const maxYear = this.maxDate ? this.maxDate.getFullYear() : new Date().getFullYear() + 5;
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
    if (!this.isOpen()) {
      this.checkPosition();
    }
    this.isOpen.update((v) => !v);
    this.onTouched();
  }

  private checkPosition() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const calendarWidth = 300; // Ancho aproximado del calendario

    // Si el calendario se sale por la derecha, alineamos a la derecha del input
    if (rect.left + calendarWidth > viewportWidth) {
      this.alignRight.set(true);
    } else {
      this.alignRight.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isOpen()) return;
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isOpen.set(false);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isOpen()) this.checkPosition();
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
    this.monthDirection.set('left');
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentMonth();
    this.monthDirection.set('right');
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
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= lastDay; i++) days.push(i);
    return days;
  }

  getDateForDay(day: number): Date {
    const current = this.currentMonth();
    return new Date(current.getFullYear(), current.getMonth(), day);
  }
}
