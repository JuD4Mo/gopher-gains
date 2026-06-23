import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-16">
      <div
        class="border-2 border-border border-t-accent rounded-full animate-spin"
        [class.w-8]="size() !== 'lg'"
        [class.h-8]="size() !== 'lg'"
        [class.w-12]="size() === 'lg'"
        [class.h-12]="size() === 'lg'"
        [class.border-[3px]]="size() === 'lg'"
      ></div>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  readonly size = input<'sm' | 'lg'>('sm');
}
