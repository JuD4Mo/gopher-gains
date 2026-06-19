import { Component, computed, input, output } from '@angular/core';
import type { PaginationMeta } from '../../models/api-response.model';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (meta(); as m) {
      <div class="flex items-center justify-between pt-4">
        <span class="text-sm text-text-muted">
          Page {{ m.page }} of {{ m.pageCount }} &middot; {{ m.totalCount }} total
        </span>
        <div class="flex items-center gap-1">
          <button
            (click)="pageChange.emit(m.page - 1)"
            [disabled]="m.page <= 1"
            class="btn-ghost px-3 py-1.5 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          @for (p of pages(); track p) {
            @if (p === -1) {
              <span class="px-2 text-text-muted text-sm">&hellip;</span>
            } @else {
              <button
                (click)="pageChange.emit(p)"
                [class.bg-accent!]="p === m.page"
                [class.text-white!]="p === m.page"
                [class.text-text]="p !== m.page"
                class="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-surface-light transition-colors min-w-9"
              >
                {{ p }}
              </button>
            }
          }
          <button
            (click)="pageChange.emit(m.page + 1)"
            [disabled]="m.page >= m.pageCount"
            class="btn-ghost px-3 py-1.5 text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    }
  `,
})
export class PaginationComponent {
  readonly meta = input.required<PaginationMeta>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const m = this.meta();
    if (!m || m.pageCount <= 1) return [1];
    const current = m.page;
    const total = m.pageCount;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    if (start > 2) pages.push(-1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push(-1);
    pages.push(total);
    return pages;
  });
}
