import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Hotel } from '../../../../../core/models/hotel.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-hotel-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-hotel-card.html',
  styleUrl: './admin-hotel-card.css',
})
export class AdminHotelCard {
  private readonly router = inject(Router);

  @Input({ required: true }) hotel!: Hotel;

  @Output() edit = new EventEmitter<Hotel>();
  @Output() delete = new EventEmitter<Hotel>();

  // Esta es la función clave para la Opción B
  onManage(): void {
    // Te redirige a /admin/hotels/5/rooms
    this.router.navigate(['/admin/hotels', this.hotel.id, 'rooms']);
  }

  onEdit(): void {
    this.edit.emit(this.hotel);
  }

  onDelete(): void {
    this.delete.emit(this.hotel);
  }
}
