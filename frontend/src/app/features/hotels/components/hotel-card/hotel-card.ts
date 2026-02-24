import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  rating: number;
  reviewsCount: number;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-card.html',
  styleUrls: ['./hotel-card.css'],
})
export class HotelCard {
  @Input({ required: true }) hotel!: Hotel;

  constructor(private router: Router) {}

  goToDetails() {
    this.router.navigate(['/hotels', this.hotel.id]);
  }
}
