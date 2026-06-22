import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { RoutineService } from '../../services/routine.service';
import type { Routine } from '../../models/routine.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-routine-list',
  standalone: true,
  imports: [
    RouterLink, FormsModule, CardComponent, LoadingSpinnerComponent,
    EmptyStateComponent, PaginationComponent, ErrorMessageComponent, SafeHtmlPipe,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <div class="w-4 h-4 text-accent [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
          </div>
          <h2 class="text-xl font-bold font-display text-text">Routines</h2>
        </div>
        <a routerLink="/routines/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New Routine
        </a>
      </div>

      <app-card [accentColor]="'accent'">
        <div class="p-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none w-4 h-full [&>svg]:w-4 [&>svg]:h-4 text-text-muted" [innerHTML]="icons.search | safeHtml"></div>
              <input
                [(ngModel)]="nameFilter" (input)="onFilterChange()"
                placeholder="Search routines..." class="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
              />
            </div>
            <select
              [(ngModel)]="typeFilter" (change)="onFilterChange()"
              class="px-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
            >
              <option value="">All types</option>
              <option value="default">Default</option>
              <option value="customized">Customized</option>
            </select>
          </div>

          @if (loading()) { <app-loading-spinner /> }
          @else if (error()) { <app-error-message [message]="error()" /> }
          @else if (routines().length === 0) {
            <app-empty-state [icon]="icons.emptyBox" title="No routines yet" message="Create your first routine to get started." />
          } @else {
            <div class="overflow-x-auto -mx-5">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Name</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Type</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Frequency</th>
                    <th class="text-right py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of routines(); track r.id) {
                    <tr class="border-b border-border/50 hover:bg-surface-light transition-colors">
                      <td class="py-3 px-5 font-medium text-text">{{ r.name }}</td>
                      <td class="py-3 px-5">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                          [class.bg-teal/10]="r.type === 'default'" [class.text-teal]="r.type === 'default'"
                          [class.bg-accent/10]="r.type === 'customized'" [class.text-accent]="r.type === 'customized'"
                        >{{ r.type }}</span>
                      </td>
                      <td class="py-3 px-5 text-text-muted">{{ r.frequency }}x / week</td>
                      <td class="py-3 px-5 text-right">
                        <a [routerLink]="['/routines', r.id]" class="btn-ghost text-sm px-3 py-1.5 rounded-lg" aria-label="View {{ r.name }}">
                          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.chevronRight | safeHtml"></span>
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <app-pagination [meta]="pagination()" (pageChange)="onPageChange($event)" />
          }
        </div>
      </app-card>
    </div>
  `,
})
export class RoutineListPage implements OnInit {
  private readonly routineService = inject(RoutineService);
  protected readonly icons = ICONS;
  protected readonly routines = signal<Routine[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });
  protected nameFilter = '';
  protected typeFilter = '';
  private currentPage = 1;

  ngOnInit() { this.load(); }
  private load() {
    this.loading.set(true); this.error.set(null);
    this.routineService.getAll({ name: this.nameFilter || undefined, type: this.typeFilter || undefined, page: this.currentPage }).subscribe({
      next: (res) => { this.routines.set(res.data); if (res.meta) this.pagination.set(res.meta); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.loading.set(false); },
    });
  }
  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(p: number) { this.currentPage = p; this.load(); }
}
