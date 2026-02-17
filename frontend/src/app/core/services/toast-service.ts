import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  readonly type: 'success' | 'error' | 'info';
  readonly message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toast = signal<ToastMessage | null>(null);

  show(message: ToastMessage) {
    this.toast.set(message);

    setTimeout(() => {
      this.toast.set(null);
    }, 3000);
  }

  clear() {
    this.toast.set(null);
  }
}
