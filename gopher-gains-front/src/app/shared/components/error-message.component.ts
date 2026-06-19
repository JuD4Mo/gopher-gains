import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  template: `
    @if (message()) {
      <div class="bg-danger/5 border border-danger/20 text-danger px-4 py-3 rounded-lg text-sm">
        {{ message() }}
      </div>
    }
  `,
})
export class ErrorMessageComponent {
  readonly message = input<string | null>(null);
}
