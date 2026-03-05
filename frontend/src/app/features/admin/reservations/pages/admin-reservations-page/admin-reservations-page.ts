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
import { SelectOption } from '../../../../../shared/ui/select/select';
import { FormsModule } from '@angular/forms';
import { AdminReservationsTable } from '../../components/admin-reservations-table/admin-reservations-table';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { HotelFilter, HotelService } from '../../../../hotels/services/hotel-service';
import {
  AdminReservationsFilters,
  ReservationFilters,
} from '../../components/admin-reservations-filters/admin-reservations-filters';

@Component({
  selector: 'app-admin-reservations-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, AdminReservationsTable, AdminReservationsFilters],
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

  loadingHotels = signal(false);
  hasMoreHotels = signal(false);
  private hotelPage = 0;
  private currentHotelQuery = '';

  currentFilters = signal<ReservationFilters>({
    searchTerm: '',
    status: 'ALL',
    hotelId: 'ALL',
    startDate: null,
    endDate: null,
  });

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
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm.set(value);
      this.onFilterChange();
    });

    this.loadReservations();
    this.loadHotels();
  }

  loadHotels(query: string = '', append: boolean = false): void {
    this.loadingHotels.set(true);
    this.currentHotelQuery = query;

    if (!append) {
      this.hotelPage = 0;
    }

    const filter: HotelFilter = {
      name: query.trim() || undefined,
      active: true,
    };

    this.hotelService.getHotels(this.hotelPage, filter, 'name,asc', 10).subscribe({
      next: (res) => {
        const newOptions = res.content.map((h) => ({
          label: h.name,
          value: h.id.toString(),
        }));

        if (append) {
          this.hotels.update((prev) => [...prev, ...newOptions]);
        } else {
          this.hotels.set([{ label: 'Todos los Hoteles', value: 'ALL' }, ...newOptions]);
        }

        this.hasMoreHotels.set(res.number < res.totalPages - 1);
        this.loadingHotels.set(false);
      },
      error: (err) => {
        console.error('Error cargando hoteles:', err);
        this.loadingHotels.set(false);
      },
    });
  }

  handleHotelSearch(query: string): void {
    this.loadHotels(query, false);
  }

  handleHotelLoadMore(): void {
    this.hotelPage++;
    this.loadHotels(this.currentHotelQuery, true);
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

  handleFiltersChange(filters: ReservationFilters): void {
    this.currentFilters.set(filters);
    this.currentPage.set(0);
    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading.set(true);
    const f = this.currentFilters();

    // Construir el objeto de parámetros para el servicio
    const params: any = {
      ...(f.status !== 'ALL' && { status: f.status }),
      ...(f.hotelId !== 'ALL' && { hotelId: f.hotelId }),
      ...(f.searchTerm.trim() && { search: f.searchTerm.trim() }),
      ...(f.startDate && { startDate: f.startDate }),
      ...(f.endDate && { endDate: f.endDate }),
    };

    this.adminResService.getAll(this.currentPage(), 10, params).subscribe({
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
