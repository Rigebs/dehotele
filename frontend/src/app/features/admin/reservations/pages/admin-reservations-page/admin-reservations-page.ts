import {
  Component,
  OnInit,
  signal,
  inject,
  ChangeDetectionStrategy,
  computed,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ReservationResponse } from '../../../../../core/models/reservation.model';
import { AdminReservationService } from '../../../services/admin-reservation-service';
import { Select, SelectOption } from '../../../../../shared/ui/select/select';
import { FormsModule } from '@angular/forms';
import { AdminReservationsTable } from '../../components/admin-reservations-table/admin-reservations-table';
import { DatePicker } from '../../../../../shared/ui/date-picker/date-picker';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { HotelService } from '../../../../hotels/services/hotel-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-reservations-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select, FormsModule, AdminReservationsTable, DatePicker, DatePipe],
  templateUrl: './admin-reservations-page.html',
  styleUrl: './admin-reservations-page.css',
})
export class AdminReservationsPage implements OnInit, OnDestroy {
  private readonly adminResService = inject(AdminReservationService);
  private readonly hotelService = inject(HotelService);

  menuAbierto = false;

  @ViewChild('filterDialog') filterDialog!: ElementRef<HTMLDialogElement>;

  // Estados
  reservations = signal<ReservationResponse[]>([]);
  isLoading = signal(false);
  hotels = signal<SelectOption[]>([]);

  // Paginación
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);

  // Filtros
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

  // Computados
  hasActiveFilters = computed(() => {
    return (
      this.searchTerm().trim() !== '' ||
      this.statusFilter() !== 'ALL' ||
      this.hotelFilter() !== 'ALL' ||
      this.startDate() !== null ||
      this.endDate() !== null
    );
  });

  // Opciones de Selects
  statusOptions: SelectOption[] = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Confirmadas', value: 'CONFIRMED' },
    { label: 'Pendientes', value: 'PENDING' },
    { label: 'Canceladas', value: 'CANCELLED' },
  ];

  ngOnInit(): void {
    this.loadHotels();

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm.set(value);
      this.onFilterChange();
    });

    this.loadReservations();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  actualizarPosicion(btn: HTMLButtonElement) {
    const rect = btn.getBoundingClientRect();
    const menu = document.getElementById('miMenu');
    if (menu) {
      // Coloca el menú justo debajo del botón (coordenadas globales)
      menu.style.top = `${rect.bottom + 5}px`;
      menu.style.left = `${rect.left + rect.width / 2}px`;
      menu.style.transform = 'translateX(-50%)';
    }
  }

  loadHotels(): void {
    this.hotelService.getHotels(0, {}, 'name,asc', 100).subscribe({
      next: (response) => {
        const options = response.content.map((h) => ({
          label: h.name,
          value: h.id.toString(),
        }));

        this.hotels.set([{ label: 'Todos los hoteles', value: 'ALL' }, ...options]);
      },
      error: (err) => {
        console.error('Error al cargar hoteles:', err);
      },
    });
  }

  loadReservations(): void {
    this.isLoading.set(true);

    const filters: any = {
      ...(this.statusFilter() !== 'ALL' && { status: this.statusFilter() }),
      ...(this.hotelFilter() !== 'ALL' && { hotelId: this.hotelFilter() }),
      ...(this.searchTerm().trim() && { search: this.searchTerm().trim() }),
      ...(this.startDate() && { startDate: this.startDate() }),
      ...(this.endDate() && { endDate: this.endDate() }),
    };

    this.adminResService.getAll(this.currentPage(), 10, filters).subscribe({
      next: (res) => {
        this.reservations.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadReservations();
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('ALL');
    this.hotelFilter.set('ALL');
    this.startDate.set(null);
    this.endDate.set(null);

    // Limpiar también el temporal por si acaso
    this.tempFilters = { hotel: 'ALL', status: 'ALL', startDate: null, endDate: null };

    this.onFilterChange();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
    this.loadReservations();
  }

  exportData(): void {
    console.log('Exportando datos filtrados...');
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

    this.onFilterChange(); // Ejecuta la carga
    this.closeFilters();
  }
}
