import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Room } from '../../../../core/models/room.model';

@Component({
  selector: 'app-hotel-room-card',
  imports: [],
  templateUrl: './hotel-room-card.html',
  styleUrl: './hotel-room-card.css',
})
export class HotelRoomCard {
  @Input({ required: true }) room!: Room;
  @Input() canReserve: boolean = false;
  @Output() reserve = new EventEmitter<number>();

  onReserve() {
    this.reserve.emit(this.room.id);
  }
}
