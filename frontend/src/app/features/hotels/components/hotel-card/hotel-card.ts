import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { HotelResponse } from '../../../../core/models/hotel.models';
import { Card } from '../../../../shared/ui/card/card';

@Component({
  selector: 'app-hotel-card',
  imports: [RouterLink, NgOptimizedImage, Card],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelCard {
  readonly hotel = input.required<HotelResponse>();
}
