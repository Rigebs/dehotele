export interface Room {
  readonly id: number;
  readonly name: string;
  readonly type: string;
  readonly price: number;
  readonly capacity: number;
  readonly available: boolean;
  readonly pricePerNight: number;
}
