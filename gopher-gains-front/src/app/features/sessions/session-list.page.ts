import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import type { WorkoutSession } from '../../models/session.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { catchError, of } from 'rxjs';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, CardComponent, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent, ErrorMessageComponent, StatusBadgeComponent, SafeHtmlPipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <div class="w-4 h-4 text-accent [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.sessions | safeHtml"></div>
          </div>
          <h2 class="text-xl font-bold font-display text-text">Workout Sessions</h2>
        </div>
        <a routerLink="/sessions/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New Session
        </a>
      </div>

      <app-card [accentColor]="'accent'">
        <div class="p-5">
          <div class="flex items-center gap-3 mb-4">
            <select [(ngModel)]="statusFilter" (change)="onFilterChange()" class="px-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none">
              <option value="">All statuses</option>
              <option value="in_progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          @if (loading()) { <app-loading-spinner /> }
          @else if (error()) { <app-error-message [message]="error()" /> }
          @else if (sessions().length === 0) { <app-empty-state [icon]="icons.emptyBox" title="No sessions yet" message="Start a workout session." /> }
          @else {
            <div class="overflow-x-auto -mx-5">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">ID</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">User</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Status</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Start Time</th>
                    <th class="text-right py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (s of sessions(); track s.id) {
                    <tr class="border-b border-border/50 hover:bg-surface-light transition-colors">
                      <td class="py-3 px-5 font-medium text-text font-mono">#{{ s.id }}</td>
                      <td class="py-3 px-5 text-text">{{ userNames()[s.userId] ?? 'User #' + s.userId }}</td>
                      <td class="py-3 px-5"><app-status-badge [status]="s.status" /></td>
                      <td class="py-3 px-5 text-text-muted">{{ s.startTime | date:'MMM d, HH:mm' }}</td>
                      <td class="py-3 px-5 text-right">
                        <a [routerLink]="['/sessions', s.id]" class="btn-ghost text-sm px-3 py-1.5 rounded-lg" aria-label="View session #{{ s.id }}">
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
export class SessionListPage implements OnInit {
  private readonly sessionService = inject(SessionService);
  private readonly userService = inject(UserService);
  protected readonly icons = ICONS;
  protected readonly sessions = signal<WorkoutSession[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });
  protected readonly userNames = signal<Record<number, string>>({});
  protected statusFilter = '';
  private currentPage = 1;

  ngOnInit() {
    this.userService.getAll({ limit: 100 }).pipe(catchError(() => of(null))).subscribe({
      next: (res) => { if (res) { const names: Record<number, string> = {}; for (const u of res.data) names[u.id] = `${u.name} ${u.lastName}`; this.userNames.set(names); } },
    });
    this.load();
  }

  private load() {
    this.loading.set(true); this.error.set(null);
    this.sessionService.getAll({ status: this.statusFilter || undefined, page: this.currentPage }).subscribe({
      next: (res) => { this.sessions.set(res.data); if (res.meta) this.pagination.set(res.meta); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.loading.set(false); },
    });
  }
  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(p: number) { this.currentPage = p; this.load(); }
}
