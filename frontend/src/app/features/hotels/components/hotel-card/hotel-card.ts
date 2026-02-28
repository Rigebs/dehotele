import { Component, input, inject, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../../../core/models/hotel.model';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelCard {
  hotel = input.required<Hotel>();

  viewDetails = output<number>();

  onCardClick(): void {
    this.viewDetails.emit(this.hotel().id);
  }
}
