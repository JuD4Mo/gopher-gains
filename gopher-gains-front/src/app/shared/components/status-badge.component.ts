import { Component, input } from '@angular/core';
import type { SessionStatus } from '../../models/api-response.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      [class.bg-success/10]="status() === 'finished'"
      [class.text-success]="status() === 'finished'"
      [class.bg-accent/10]="status() === 'in_progress'"
      [class.text-accent]="status() === 'in_progress'"
    >
      <span
        class="w-1.5 h-1.5 rounded-full"
        [class.bg-success]="status() === 'finished'"
        [class.bg-accent]="status() === 'in_progress'"
      ></span>
      {{ status() === 'in_progress' ? 'In Progress' : 'Finished' }}
    </span>
  `,
})
export class StatusBadgeComponent {
  readonly status = input.required<SessionStatus>();
}
