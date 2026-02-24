import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hotel } from '../../../../../core/models/hotel.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-hotel-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-hotel-card.html',
  styleUrl: './admin-hotel-card.css',
})
export class AdminHotelCard {
  @Input({ required: true }) hotel!: Hotel;

  @Output() edit = new EventEmitter<Hotel>();
  @Output() delete = new EventEmitter<Hotel>();

  onEdit(): void {
    this.edit.emit(this.hotel);
  }

  onDelete(): void {
    this.delete.emit(this.hotel);
  }
}
