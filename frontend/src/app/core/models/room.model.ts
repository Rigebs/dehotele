export interface Room {
  readonly id: number;
  readonly type: string;
  readonly price: number;
  readonly capacity: number;
  readonly available: boolean;
}
