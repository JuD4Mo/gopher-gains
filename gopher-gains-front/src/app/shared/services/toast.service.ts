import { Injectable, signal } from '@angular/core';

export interface Toast {
  text: string;
  type: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _message = signal<Toast | null>(null);
  readonly message = this._message.asReadonly();

  show(text: string, type: 'success' | 'error' = 'success') {
    this._message.set({ text, type });
    setTimeout(() => this._message.set(null), 3000);
  }
}
