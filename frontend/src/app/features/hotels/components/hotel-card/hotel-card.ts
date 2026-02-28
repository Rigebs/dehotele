import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  private readonly router = inject(Router);

  // Usamos signals para las entradas
  hotel = input.required<Hotel>();

  goToDetails(): void {
    this.router.navigate(['/hotels', this.hotel().id]);
  }
}
