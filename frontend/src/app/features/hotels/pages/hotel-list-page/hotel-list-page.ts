import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, Params } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, switchMap, tap, debounceTime, startWith, Observable } from 'rxjs';
import { Select } from '../../../../shared/ui/select/select';
import { HotelCard } from '../../components/hotel-card/hotel-card';
import { Hero } from '../../components/hero/hero';
import { HotelService } from '../../services/hotel-service';
import { Hotel, PageResponse } from '../../../../core/models/hotel.model';

@Component({
  selector: 'app-hotel-list',
  imports: [CommonModule, ReactiveFormsModule, Select, HotelCard, Hero],
  templateUrl: './hotel-list-page.html',
  styleUrl: './hotel-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelListPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly hotelService = inject(HotelService);

  readonly loading = signal(false);
  readonly currentPage = signal(0);
  readonly perPage = signal(6);

  readonly searchCity = signal<string | undefined>(undefined);
  readonly capacity = signal<number | undefined>(undefined);
  readonly checkIn = signal<string | undefined>(undefined);
  readonly checkOut = signal<string | undefined>(undefined);

  readonly filtersForm = this.fb.group({
    sort: ['name,asc'],
    rating: [null as number | null],
  });

  readonly isAvailabilitySearch = computed(
    () => !!(this.searchCity() && this.capacity() && this.checkIn() && this.checkOut()),
  );

  readonly searchSummary = computed(() => {
    if (this.isAvailabilitySearch()) {
      return `Resultados para ${this.capacity()} personas del ${this.checkIn()} al ${this.checkOut()}`;
    }
    return this.searchCity() ? `Hoteles en ${this.searchCity()}` : 'Todos los hoteles';
  });

  private readonly hotelsResource$: Observable<PageResponse<Hotel>> = combineLatest([
    toObservable(this.currentPage),
    this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.value), debounceTime(300)),
    toObservable(this.searchCity),
    toObservable(this.capacity),
    toObservable(this.checkIn),
    toObservable(this.checkOut),
  ]).pipe(
    tap(() => this.loading.set(true)),
    switchMap(([page, filters, city, cap, start, end]) => {
      const sort = filters.sort ?? 'name,asc';
      const size = this.perPage();

      if (city && cap && start && end) {
        return this.hotelService.getAvailableHotels(city, cap, start, end, page, size, sort);
      }

      return this.hotelService.getHotels(
        page,
        { city, capacity: cap, minRating: filters.rating ?? undefined },
        sort,
        size,
      );
    }),
    tap(() => this.loading.set(false)),
  );

  readonly hotelsData = toSignal(this.hotelsResource$, {
    initialValue: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: 0,
      size: 6,
    },
  });

  readonly hotels = computed(() => this.hotelsData()?.content ?? []);
  readonly totalElements = computed(() => this.hotelsData()?.totalElements ?? 0);
  readonly totalPages = computed(() => this.hotelsData()?.totalPages ?? 0);

  onSearch(value: {
    city: string | null;
    guests?: number | null;
    checkIn?: string | null;
    checkOut?: string | null;
  }): void {
    this.searchCity.set(value.city ?? undefined);
    this.capacity.set(value.guests ?? undefined);
    this.checkIn.set(value.checkIn ?? undefined);
    this.checkOut.set(value.checkOut ?? undefined);
    this.currentPage.set(0);
  }

  clearSearch(): void {
    this.searchCity.set(undefined);
    this.capacity.set(undefined);
    this.checkIn.set(undefined);
    this.checkOut.set(undefined);
    this.filtersForm.patchValue({ sort: 'name,asc', rating: null });
    this.currentPage.set(0);
  }

  handlePageChange(step: number): void {
    this.currentPage.update((prev) => prev + step);
  }

  goToDetails(hotelId: number): void {
    const queryParams: Params = {};

    if (this.checkIn()) queryParams['checkIn'] = this.checkIn();
    if (this.checkOut()) queryParams['checkOut'] = this.checkOut();
    if (this.capacity()) queryParams['guests'] = this.capacity();

    this.router.navigate(['/hotels', hotelId], { queryParams });
  }
}
