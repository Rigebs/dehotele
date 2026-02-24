import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Select } from '../../../../shared/ui/select/select';
import { Hero, SearchFormValue } from '../../components/hero/hero';
import { HotelCard } from '../../components/hotel-card/hotel-card';

interface HotelMock {
  id: number;
  name: string;
  city: string;
  address: string;
  imageUrl: string;
  price: number;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  maxGuests: number;
}

type SortOption = 'price-low' | 'price-high' | 'rating' | null;

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [Hero, Select, ReactiveFormsModule, HotelCard],
  templateUrl: './hotel-list-page.html',
  styleUrl: './hotel-list-page.css',
})
export class HotelListPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly filtersForm = this.fb.group({
    sort: [null as SortOption],
    rating: [null as number | null],
    guests: [null as number | null],
  });

  private readonly _page = signal(0);
  private readonly _perPage = 6;

  readonly page = computed(() => this._page());
  readonly isFirstPage = computed(() => this._page() === 0);

  private readonly _allHotels = signal<HotelMock[]>([
    {
      id: 1,
      name: 'Grand Palace Hotel',
      city: 'Madrid',
      address: 'Gran Vía 123',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      price: 180,
      rating: 4.7,
      reviewsCount: 324,
      amenities: ['WiFi', 'Pool', 'Parking'],
      maxGuests: 3,
    },
    {
      id: 2,
      name: 'Sea View Resort',
      city: 'Barcelona',
      address: 'Passeig Marítim 45',
      imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
      price: 220,
      rating: 4.5,
      reviewsCount: 198,
      amenities: ['WiFi', 'Spa', 'Breakfast'],
      maxGuests: 4,
    },
    {
      id: 3,
      name: 'Mountain Escape Lodge',
      city: 'Granada',
      address: 'Sierra Nevada 22',
      imageUrl: 'https://images.unsplash.com/photo-1501117716987-c8e1ecb2106e',
      price: 140,
      rating: 4.3,
      reviewsCount: 89,
      amenities: ['WiFi', 'Parking'],
      maxGuests: 2,
    },
  ]);

  readonly searchState = signal<SearchFormValue | null>(null);

  readonly sortOption = computed(() => this.filtersForm.controls.sort.value);

  readonly ratingFilter = computed(() => this.filtersForm.controls.rating.value);

  readonly guestFilter = computed(() => this.filtersForm.controls.guests.value);

  readonly filteredHotels = computed(() => {
    let hotels = this._allHotels();
    const search = this.searchState();
    const rating = this.ratingFilter();
    const guests = this.guestFilter();

    if (search?.city) {
      hotels = hotels.filter((h) => h.city.toLowerCase().includes(search.city.toLowerCase()));
    }

    if (rating !== null) {
      hotels = hotels.filter((h) => h.rating >= rating);
    }

    if (guests !== null) {
      hotels = hotels.filter((h) => h.maxGuests >= guests);
    }

    return hotels;
  });

  readonly sortedHotels = computed(() => {
    const hotels = [...this.filteredHotels()];
    const sort = this.sortOption();

    if (sort === 'price-low') hotels.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') hotels.sort((a, b) => b.price - a.price);
    if (sort === 'rating') hotels.sort((a, b) => b.rating - a.rating);

    return hotels;
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.sortedHotels().length / this._perPage)),
  );

  readonly isLastPage = computed(() => this._page() + 1 >= this.totalPages());

  readonly paginatedHotels = computed(() => {
    const start = this._page() * this._perPage;
    return this.sortedHotels().slice(start, start + this._perPage);
  });

  onSearch(value: SearchFormValue) {
    this.searchState.set(value);
    this._page.set(0);
  }

  nextPage() {
    if (!this.isLastPage()) this._page.update((p) => p + 1);
  }

  previousPage() {
    if (!this.isFirstPage()) this._page.update((p) => p - 1);
  }

  goToDetails(hotelId: number) {
    const search = this.searchState();

    this.router.navigate([hotelId], {
      queryParams: search ?? {},
    });
  }
}
