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
  readonly capacity = signal<number | undefined>(undefined);
  readonly checkIn = signal<string | undefined>(undefined);
  readonly checkOut = signal<string | undefined>(undefined);

  readonly isAvailabilitySearch = computed(
    () => !!(this.searchCity() && this.capacity() && this.checkIn() && this.checkOut()),
  );

  readonly searchSummary = computed(() => {
    if (this.isAvailabilitySearch()) {
      return `Results for ${this.capacity()} guests from ${this.checkIn()} to ${this.checkOut()}`;
    }
    return this.searchCity() ? `Showing hotels in ${this.searchCity()}` : 'All hotels';
  });

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

  // En tu clase HotelListPage
  clearSearch(): void {
    // Reseteamos los signals de búsqueda
    this.searchCity.set(undefined);
    this.capacity.set(undefined);
    this.checkIn.set(undefined);
    this.checkOut.set(undefined);

    // Reseteamos también el formulario de filtros si lo deseas
    this.filtersForm.patchValue(
      {
        sort: 'name,asc',
        rating: null,
        guests: null,
      },
      { emitEvent: false },
    ); // Evitamos doble disparo si quieres control manual

    // Cargamos desde la página 0
    this.loadHotels(0);
  }

  loadHotels(page: number = 0): void {
    this.loading.set(true);
    this.currentPage.set(page);

    const city = this.searchCity();
    const cap = this.capacity();
    const start = this.checkIn();
    const end = this.checkOut();
    const sort = this.filtersForm.value.sort ?? 'name,asc';
    const size = this.perPage();

    // Definimos el Observable dinámicamente
    const hotels$ =
      city && cap && start && end
        ? this.hotelService.getAvailableHotels(city, cap, start, end, page, size, sort)
        : this.hotelService.getHotels(
            page,
            { city, minRating: this.filtersForm.value.rating ?? undefined },
            sort,
            size,
          );

    hotels$.subscribe({
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
        this.hotels.set([]);
      },
    });
  }

  // Update the signature to accept 'null' for the optional fields
  onSearch(value: {
    city: string;
    guests?: number | null;
    checkIn?: string | null;
    checkOut?: string | null;
  }): void {
    this.searchCity.set(value.city);
    this.capacity.set(value.guests ?? undefined);
    this.checkIn.set(value.checkIn ?? undefined);
    this.checkOut.set(value.checkOut ?? undefined);

    this.loadHotels(0);
  }

  handlePageChange(step: number): void {
    const nextStep = this.currentPage() + step;
    if (nextStep >= 0 && nextStep < this.totalPages()) {
      this.loadHotels(nextStep);
    }
  }

  goToDetails(hotelId: number): void {
    console.log(hotelId);

    const queryParams: any = {};

    if (this.checkIn()) {
      queryParams.checkIn = this.checkIn();
    }

    if (this.checkOut()) {
      queryParams.checkOut = this.checkOut();
    }

    if (this.capacity()) {
      queryParams.guests = this.capacity();
    }

    console.log('holaa');

    console.log(queryParams);

    this.router.navigate(['/hotels', hotelId], { queryParams });
  }
}
