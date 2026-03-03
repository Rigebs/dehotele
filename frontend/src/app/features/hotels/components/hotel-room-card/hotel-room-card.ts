import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Room } from '../../../../core/models/room.model';

@Component({
  selector: 'app-hotel-room-card',
  imports: [],
  templateUrl: './hotel-room-card.html',
  styleUrl: './hotel-room-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelRoomCard {
  room = input.required<Room>();
  canReserve = input(false);

  reserve = output<number>();

  onReserve(): void {
    this.reserve.emit(this.room().id);
  }
}
