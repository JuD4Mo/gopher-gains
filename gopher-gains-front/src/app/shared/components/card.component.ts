import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div
      class="bg-card rounded-xl border border-border shadow-card"
      [class.border-t-2]="accentColor()"
      [class.border-t-teal]="accentColor() === 'teal'"
      [class.border-t-accent]="accentColor() === 'accent'"
      [class.border-t-success]="accentColor() === 'success'"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  readonly accentColor = input<string>();
}
