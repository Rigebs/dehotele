import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Select } from '../../../../shared/ui/select/select';
import { HotelCard } from '../../components/hotel-card/hotel-card';
import { Hero } from '../../components/hero/hero';
import { HotelFilter, HotelService } from '../../services/hotel-service';
import { Hotel } from '../../../../core/models/hotel.model';

@Component({
  selector: 'app-hotel-list',
  imports: [CommonModule, ReactiveFormsModule, Select, HotelCard, Hero],
  templateUrl: './hotel-list-page.html',
  styleUrl: './hotel-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelListPage implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly hotelService = inject(HotelService);

  readonly hotels = signal<Hotel[]>([]);
  readonly loading = signal(false);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly perPage = signal(6);
  readonly searchCity = signal<string | undefined>(undefined);

  readonly filtersForm = this.fb.group({
    sort: ['name,asc'],
    rating: [null as number | null],
    guests: [null as number | null],
  });

  private readonly formValues = toSignal(this.filtersForm.valueChanges, {
    initialValue: this.filtersForm.value,
  });

  ngOnInit(): void {
    this.loadHotels();

    this.filtersForm.valueChanges.subscribe(() => {
      this.loadHotels(0);
    });
  }

  loadHotels(page: number = 0): void {
    this.loading.set(true);
    this.currentPage.set(page);

    const filters: HotelFilter = {
      city: this.searchCity(),
      minRating: this.filtersForm.value.rating ?? undefined,
    };

    const sort = this.filtersForm.value.sort ?? 'name,asc';

    this.hotelService.getHotels(page, filters, sort, this.perPage()).subscribe({
      next: (res) => {
        this.hotels.set(res.content);
        this.totalElements.set(res.totalElements);
        this.totalPages.set(res.totalPages);
        this.currentPage.set(res.number);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading hotels', err);
        this.loading.set(false);
      },
    });
  }

  onSearch(value: { city: string }): void {
    this.searchCity.set(value.city);
    this.loadHotels(0);
  }

  handlePageChange(step: number): void {
    const nextStep = this.currentPage() + step;
    if (nextStep >= 0 && nextStep < this.totalPages()) {
      this.loadHotels(nextStep);
    }
  }

  goToDetails(hotelId: number): void {
    this.router.navigate(['/hotels', hotelId]);
  }
}
