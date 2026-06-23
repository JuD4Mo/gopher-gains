import { Component, input } from '@angular/core';
import type { MuscleGroup } from '../../models/api-response.model';

const MUSCLE_COLORS: Record<MuscleGroup, string> = {
  chest: 'bg-red-50 text-red-600',
  back: 'bg-purple-50 text-purple-600',
  legs: 'bg-blue-50 text-blue-600',
  arms: 'bg-orange-50 text-orange-600',
  delts: 'bg-cyan-50 text-cyan-600',
  abs: 'bg-emerald-50 text-emerald-600',
};

@Component({
  selector: 'app-muscle-group-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize" [class]="colorClass()">
      {{ group() }}
    </span>
  `,
})
export class MuscleGroupBadgeComponent {
  readonly group = input.required<MuscleGroup>();
  protected readonly colorClass = () => MUSCLE_COLORS[this.group()] ?? 'bg-slate-50 text-slate-600';
}
