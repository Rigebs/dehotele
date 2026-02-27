import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Select, SelectOption } from '../../../../../shared/ui/select/select';
import { AdminRoomService } from '../../../services/admin-room-service';
import { AdminRoomTable } from '../../components/admin-room-table/admin-room-table';
import { Room } from '../../../../../core/models/room.model';
import { Hotel } from '../../../../../core/models/hotel.model';
import { HotelService } from '../../../../hotels/services/hotel-service';

@Component({
  selector: 'app-admin-rooms-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, Select, AdminRoomTable, RouterLink],
  templateUrl: './admin-rooms-page.html',
  styleUrl: './admin-rooms-page.css',
})
export class AdminRoomsPage implements OnInit, OnDestroy {
  private readonly adminRoomService = inject(AdminRoomService);
  private readonly hotelService = inject(HotelService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  hotelId = signal<number | null>(null);

  hotelInfo = signal<Hotel | null>(null);

  // Data Signals
  rooms = signal<Room[]>([]);
  isLoading = signal(false);

  // Pagination Signals
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);

  // Filter Signals
  searchTerm = signal('');
  capacityFilter = signal<string>('ALL');

  private searchSubject = new Subject<string>();

  hasActiveFilters = computed(() => {
    return this.searchTerm().trim() !== '' || this.capacityFilter() !== 'ALL';
  });

  capacityOptions: SelectOption[] = [
    { label: 'Todas', value: 'ALL' },
    { label: 'Individual (1)', value: '1' },
    { label: 'Doble (2)', value: '2' },
    { label: 'Triple (3)', value: '3' },
    { label: 'Familiar (4+)', value: '4' },
  ];

  filteredRooms = computed(() => this.rooms());

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('hotelId');
    if (idParam) {
      const id = Number(idParam);
      this.hotelId.set(Number(idParam));
      this.loadHotel(id);
    }

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm.set(value);
      this.currentPage.set(0);
      this.loadRooms();
    });

    // 3. Carga inicial
    this.loadRooms();
  }

  loadHotel(id: number): void {
    this.hotelService.getHotelById(id).subscribe({
      next: (hotel) => this.hotelInfo.set(hotel),
      error: () => console.error('No se pudo cargar la información del hotel'),
    });
  }

  loadRooms(): void {
    const currentHotelId = this.hotelId();
    if (!currentHotelId) return; // Seguridad: Si no hay ID, no disparamos

    this.isLoading.set(true);

    const filters: any = {};
    if (this.capacityFilter() !== 'ALL') filters.capacity = this.capacityFilter();
    if (this.searchTerm().trim()) filters.search = this.searchTerm().trim();

    // Ahora pasamos el hotelId como primer parámetro al servicio
    this.adminRoomService.getAll(currentHotelId, this.currentPage(), 10, filters).subscribe({
      next: (res) => {
        this.rooms.set(res.content);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.capacityFilter.set('ALL');
    this.currentPage.set(0);
    this.loadRooms();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadRooms();
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
    this.loadRooms();
  }

  onCreateRoom(): void {
    this.router.navigate(['/admin/hotels', this.hotelId(), 'rooms', 'new']);
  }

  handleDelete(room: Room): void {
    if (confirm(`¿Estás seguro de eliminar la habitación ${room.name}?`)) {
      this.adminRoomService.delete(room.id).subscribe({
        next: () => this.loadRooms(), // Recargamos la lista
        error: (err) => console.error('Error al borrar', err),
      });
    }
  }

  handleEdit(room: Room): void {
    this.router.navigate(['/admin/hotels', this.hotelId(), 'rooms', room.id]);
  }
}
