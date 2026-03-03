import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Hotel } from '../../../../core/models/hotel.model';

@Component({
  selector: 'app-hotel-card',
  imports: [NgOptimizedImage],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'hotel-card shadow-md',
    '(click)': 'onCardClick()',
    role: 'article',
    tabindex: '0',
  },
})
export class HotelCard {
  hotel = input.required<Hotel>();
  viewDetails = output<number>();

  onCardClick(): void {
    this.viewDetails.emit(this.hotel().id);
  }
}
