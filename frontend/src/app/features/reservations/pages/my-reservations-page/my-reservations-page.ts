import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap, map, catchError, of } from 'rxjs';
import { ReservationCard } from '../../components/reservation-card/reservation-card';
import {
  ReservationFilter,
  ReservationService,
  ReservationStatus,
} from '../../services/reservation-service';
import { ToastService } from '../../../../core/services/toast-service';
import { ReservationResponse } from '../../../../core/models/reservation.model';

@Component({
  selector: 'app-my-reservations-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReservationCard, RouterLink],
  templateUrl: './my-reservations-page.html',
  styleUrl: './my-reservations-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block-container',
  },
})
export class MyReservationsPage {
  private readonly reservationService = inject(ReservationService);
  private readonly toast = inject(ToastService);

  protected readonly currentTab = signal<'upcoming' | 'past'>('upcoming');
  protected readonly currentPage = signal<number>(0);
  protected readonly refreshTrigger = signal<number>(0);
  protected readonly errorOccurred = signal<boolean>(false);
  protected readonly totalPages = signal<number>(0);

  protected readonly activeFilter = computed<ReservationFilter>(() => {
    return {
      status:
        this.currentTab() === 'upcoming' ? ReservationStatus.CREATED : ReservationStatus.COMPLETED,
    };
  });

  private readonly reservationsResource$ = toObservable(
    computed(() => ({
      page: this.currentPage(),
      filter: this.activeFilter(),
      refresh: this.refreshTrigger(),
    })),
  ).pipe(
    tap(() => this.errorOccurred.set(false)),
    switchMap(({ page, filter }) =>
      this.reservationService.getMyReservations(page, 6, filter).pipe(
        tap((res) => this.totalPages.set(res.totalPages)),
        map((res) => res.content),
        catchError(() => {
          this.errorOccurred.set(true);
          this.toast.show({ type: 'error', message: 'No se pudieron cargar las reservas' });
          return of([] as ReservationResponse[]);
        }),
      ),
    ),
  );

  protected readonly reservations = toSignal(this.reservationsResource$, {
    initialValue: [] as ReservationResponse[],
  });

  protected readonly isLoading = computed(() => this.reservations() === undefined);

  protected readonly editingReservationId = signal<number | null>(null);
  protected readonly editForm = new FormGroup({
    checkInDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    checkOutDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  setTab(tab: 'upcoming' | 'past'): void {
    this.currentTab.set(tab);
    this.currentPage.set(0);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  refreshData(): void {
    this.refreshTrigger.update((v) => v + 1);
  }

  onUpdate(id: number): void {
    if (this.editForm.invalid) return;

    this.reservationService.updateReservation(id, this.editForm.getRawValue()).subscribe({
      next: () => {
        this.toast.show({ type: 'success', message: 'Reserva modificada con éxito' });
        this.editingReservationId.set(null);
        this.refreshData();
      },
      error: (err) =>
        this.toast.show({
          type: 'error',
          message: err.error?.message || 'Error al actualizar',
        }),
    });
  }
}
