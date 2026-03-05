import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  computed,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Select, SelectOption } from '../../../../../shared/ui/select/select';
import { DatePicker } from '../../../../../shared/ui/date-picker/date-picker';
import { SelectSearchable } from '../../../../../shared/ui/select-searchable/select-searchable';

export interface ReservationFilters {
  searchTerm: string;
  status: string;
  hotelId: string;
  startDate: string | null;
  endDate: string | null;
}

@Component({
  selector: 'app-admin-reservations-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, Select, DatePicker, DatePipe, SelectSearchable],
  templateUrl: './admin-reservations-filters.html',
  styleUrl: './admin-reservations-filters.css',
})
export class AdminReservationsFilters implements OnInit, OnDestroy {
  @Input({ required: true }) hotels: SelectOption[] = [];
  @Input({ required: true }) statusOptions: SelectOption[] = [];

  @Input() initialFilters: Partial<ReservationFilters> = {};

  @Output() filtersChanged = new EventEmitter<ReservationFilters>();

  @ViewChild('filterDialog') filterDialog!: ElementRef<HTMLDialogElement>;

  @Input() loadingHotels = false;
  @Input() hasMoreHotels = false;

  @Output() hotelSearch = new EventEmitter<string>();
  @Output() hotelLoadMore = new EventEmitter<void>();

  searchTerm = signal('');
  statusFilter = signal('ALL');
  hotelFilter = signal('ALL');
  startDate = signal<string | null>(null);
  endDate = signal<string | null>(null);

  tempFilters = {
    hotel: 'ALL',
    status: 'ALL',
    startDate: null as string | null,
    endDate: null as string | null,
  };

  private searchSubject = new Subject<string>();

  hasActiveFilters = computed(() => {
    return (
      this.searchTerm().trim() !== '' ||
      this.statusFilter() !== 'ALL' ||
      this.hotelFilter() !== 'ALL' ||
      this.startDate() !== null ||
      this.endDate() !== null
    );
  });

  getHotelLabel(id: string): string {
    if (id === 'ALL') return 'Todos';
    return this.hotels.find((h) => h.value === id)?.label || id;
  }

  onHotelSearch(query: string) {
    this.hotelSearch.emit(query);
  }

  onHotelLoadMore() {
    this.hotelLoadMore.emit();
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm.set(value);
      this.emitFilters();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  openFilters() {
    this.tempFilters = {
      hotel: this.hotelFilter(),
      status: this.statusFilter(),
      startDate: this.startDate(),
      endDate: this.endDate(),
    };
    this.filterDialog.nativeElement.showModal();
  }

  closeFilters() {
    this.filterDialog.nativeElement.close();
  }

  applyFilters() {
    this.hotelFilter.set(this.tempFilters.hotel);
    this.statusFilter.set(this.tempFilters.status);
    this.startDate.set(this.tempFilters.startDate);
    this.endDate.set(this.tempFilters.endDate);
    this.emitFilters();
    this.closeFilters();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('ALL');
    this.hotelFilter.set('ALL');
    this.startDate.set(null);
    this.endDate.set(null);
    this.tempFilters = { hotel: 'ALL', status: 'ALL', startDate: null, endDate: null };
    this.emitFilters();
  }

  removeSingleFilter(type: keyof ReservationFilters) {
    if (type === 'searchTerm') this.searchTerm.set('');
    if (type === 'status') this.statusFilter.set('ALL');
    if (type === 'hotelId') this.hotelFilter.set('ALL');
    if (type === 'startDate' || type === 'endDate') {
      this.startDate.set(null);
      this.endDate.set(null);
    }
    this.emitFilters();
  }

  private emitFilters() {
    this.filtersChanged.emit({
      searchTerm: this.searchTerm(),
      status: this.statusFilter(),
      hotelId: this.hotelFilter(),
      startDate: this.startDate(),
      endDate: this.endDate(),
    });
  }
}
