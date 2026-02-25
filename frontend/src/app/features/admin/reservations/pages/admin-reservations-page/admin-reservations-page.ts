import {
  Component,
  OnInit,
  signal,
  inject,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { ReservationResponse } from '../../../../../core/models/reservation.model';
import { AdminReservationService } from '../../../services/admin-reservation-service';
import { Select, SelectOption } from '../../../../../shared/ui/select/select';
import { FormsModule } from '@angular/forms';
import { AdminReservationsTable } from '../../components/admin-reservations-table/admin-reservations-table';
import { DatePicker } from '../../../../../shared/ui/date-picker/date-picker';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-admin-reservations-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Select, FormsModule, AdminReservationsTable, DatePicker],
  templateUrl: './admin-reservations-page.html',
  styleUrl: './admin-reservations-page.css',
})
export class AdminReservationsPage implements OnInit {
  private readonly adminResService = inject(AdminReservationService);
  private readonly router = inject(Router);

  reservations = signal<ReservationResponse[]>([]);
  isLoading = signal(false);

  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);

  searchTerm = signal('');
  statusFilter = signal('ALL');
  startDate = signal<string | null>(null);
  endDate = signal<string | null>(null);

  private searchSubject = new Subject<string>();

  hasActiveFilters = computed(() => {
    return (
      this.searchTerm().trim() !== '' ||
      this.statusFilter() !== 'ALL' ||
      this.startDate() !== null ||
      this.endDate() !== null
    );
  });

  statusOptions: SelectOption[] = [
    { label: 'Todos los estados', value: 'ALL' },
    { label: 'Confirmadas', value: 'CONFIRMED' },
    { label: 'Pendientes', value: 'PENDING' },
    { label: 'Canceladas', value: 'CANCELLED' },
  ];

  filteredReservations = computed(() => this.reservations());

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => {
      this.searchTerm.set(value);
      this.currentPage.set(0);
      this.loadReservations();
    });

    this.loadReservations();
  }

  loadReservations(): void {
    this.isLoading.set(true);

    const filters: any = {};

    if (this.statusFilter() !== 'ALL') {
      filters.status = this.statusFilter();
    }

    if (this.searchTerm().trim()) {
      filters.search = this.searchTerm().trim();
    }

    if (this.startDate()) {
      filters.startDate = this.startDate();
    }

    if (this.endDate()) {
      filters.endDate = this.endDate();
    }

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

  clearFilters(): void {
    this.searchTerm.set('');
    this.statusFilter.set('ALL');
    this.startDate.set(null);
    this.endDate.set(null);
    this.currentPage.set(0);

    this.loadReservations();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onStatusChange(value: any): void {
    this.statusFilter.set(value);
    this.currentPage.set(0);
    this.loadReservations();
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
    this.loadReservations();
  }

  handleCancel(res: ReservationResponse): void {
    console.log('Cancelando reserva:', res.id);
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadReservations();
  }

  onCreateReservation(): void {
    this.router.navigate(['/admin/reservations/new']);
  }
}
