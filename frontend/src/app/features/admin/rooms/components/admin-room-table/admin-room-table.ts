import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Room } from '../../../../../core/models/room.model';

@Component({
  selector: 'app-admin-rooms-table',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './admin-room-table.html',
  styleUrl: './admin-room-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminRoomTable {
  rooms = input.required<Room[]>();
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  totalElements = input.required<number>();
  isLoading = input<boolean>(false);

  pageChange = output<number>();
  editRoom = output<Room>();
  deleteRoom = output<Room>();

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.pageChange.emit(newPage);
    }
  }
}
