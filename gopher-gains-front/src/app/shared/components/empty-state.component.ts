import { Component, input } from '@angular/core';
import { SafeHtmlPipe } from '../safe-html.pipe';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [SafeHtmlPipe],
  template: `
    <div class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-12 h-12 mb-4 text-border [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icon() | safeHtml"></div>
      <h3 class="text-base font-semibold text-text mb-1">{{ title() }}</h3>
      <p class="text-sm text-text-muted max-w-sm">{{ message() }}</p>
    </div>
  `,
})
export class EmptyStateComponent {
  readonly icon = input<string>('');
  readonly title = input<string>('Nothing here yet');
  readonly message = input<string>('');
}
