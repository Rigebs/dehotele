import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { AdminHotelCard } from '../../components/admin-hotel-card/admin-hotel-card';
import { Hotel } from '../../../../../core/models/hotel.model';
import { AdminHotelService } from '../../../services/admin-hotel-service';
import { HotelFilter, HotelService } from '../../../../hotels/services/hotel-service';
import { Select, SelectOption } from '../../../../../shared/ui/select/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-hotels-page',
  imports: [CommonModule, AdminHotelCard, Select, FormsModule],
  templateUrl: './admin-hotels-page.html',
  styleUrl: './admin-hotels-page.css',
})
export class AdminHotelsPage implements OnInit, OnDestroy {
  hotels: Hotel[] = [];
  loading = false;
  errorMessage: string | null = null;
  searchTerm: string = '';

  totalElements = 0;
  totalPages = 0;
  currentPage = 0;

  currentSortField: string = 'name';
  currentSortDir: string = 'asc';

  sortOptions: SelectOption[] = [
    { label: 'Nombre (A-Z)', value: 'name,asc' },
    { label: 'Nombre (Z-A)', value: 'name,desc' },
    { label: 'Mejor Rating', value: 'rating,desc' },
    { label: 'Ciudad', value: 'city,asc' },
  ];

  selectedSort = 'name,asc'; // Valor inicial

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private hotelService: HotelService,
    private adminHotelService: AdminHotelService,
    private router: Router,
  ) {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm = term;
        this.loadHotels(0);
      });
  }

  ngOnInit(): void {
    this.loadHotels();
  }

  onSortChange(sortValue: string) {
    if (sortValue) {
      const [field, dir] = sortValue.split(',');
      this.currentSortField = field;
      this.currentSortDir = dir;
      this.loadHotels(0);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchSubject.next(term);
  }

  // En tu admin-hotels-page.ts
  loadHotels(page: number = 0): void {
    this.loading = true;

    const filter: HotelFilter = { name: this.searchTerm }; // searchTerm viene del input
    const sort = `${this.currentSortField},${this.currentSortDir}`;

    this.hotelService.getHotels(page, filter, sort).subscribe({
      next: (response) => {
        this.hotels = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onCreate(): void {
    this.router.navigate(['/admin/hotels/new']);
  }

  onEdit(hotel: Hotel): void {
    this.router.navigate(['/admin/hotels', hotel.id, 'edit']);
  }

  onDelete(hotel: Hotel): void {
    if (!confirm(`¿Eliminar "${hotel.name}"?`)) return;

    this.adminHotelService
      .delete(hotel.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          alert('Hotel eliminado');
          this.loadHotels(this.currentPage);
        },
        error: () => alert('Error al eliminar'),
      });
  }
}
