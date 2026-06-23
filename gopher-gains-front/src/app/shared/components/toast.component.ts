import { Component, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toastService.message(); as m) {
      <div
        class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-white text-sm shadow-lg transition-all duration-300"
        [class.bg-success]="m.type === 'success'"
        [class.bg-danger]="m.type === 'error'"
      >
        <div class="flex items-center gap-2">
          @if (m.type === 'success') {
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
          @if (m.type === 'error') {
            <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          }
          <span>{{ m.text }}</span>
        </div>
      </div>
    }
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
