import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ReservationResponse } from '../../../../../core/models/reservation.model';

@Component({
  selector: 'app-admin-reservations-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './admin-reservations-table.html',
  styleUrl: './admin-reservations-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReservationsTable {
  reservations = input.required<ReservationResponse[]>();
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  totalElements = input.required<number>();
  isLoading = input<boolean>(false);

  pageChange = output<number>();
  viewDetail = output<ReservationResponse>();
  cancelReservation = output<ReservationResponse>();

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.pageChange.emit(newPage);
    }
  }
}
