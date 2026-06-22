import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { UserService } from '../../services/user.service';
import type { User } from '../../models/user.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, LoadingSpinnerComponent, EmptyStateComponent, PaginationComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <div class="w-4 h-4 text-success [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.users | safeHtml"></div>
          </div>
          <h2 class="text-xl font-bold font-display text-text">Users</h2>
        </div>
        <a routerLink="/users/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New User
        </a>
      </div>

      <app-card [accentColor]="'success'">
        <div class="p-5">
          <div class="relative mb-4">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none w-4 h-full [&>svg]:w-4 [&>svg]:h-4 text-text-muted" [innerHTML]="icons.search | safeHtml"></div>
            <input [(ngModel)]="nameFilter" (input)="onFilterChange()" placeholder="Search users..." class="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
          </div>

          @if (loading()) { <app-loading-spinner /> }
          @else if (error()) { <app-error-message [message]="error()" /> }
          @else if (users().length === 0) { <app-empty-state [icon]="icons.emptyBox" title="No users yet" message="Register your first user." /> }
          @else {
            <div class="overflow-x-auto -mx-5">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Name</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Email</th>
                    <th class="text-right py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (u of users(); track u.id) {
                    <tr class="border-b border-border/50 hover:bg-surface-light transition-colors">
                      <td class="py-3 px-5 font-medium text-text">{{ u.name }} {{ u.lastName }}</td>
                      <td class="py-3 px-5 text-text-muted">{{ u.email }}</td>
                      <td class="py-3 px-5 text-right">
                        <a [routerLink]="['/users', u.id]" class="btn-ghost text-sm px-3 py-1.5 rounded-lg" aria-label="Edit {{ u.name }} {{ u.lastName }}">
                          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.edit | safeHtml"></span>
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
export class UserListPage implements OnInit {
  private readonly userService = inject(UserService);
  protected readonly icons = ICONS;
  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });
  protected nameFilter = '';
  private currentPage = 1;

  ngOnInit() { this.load(); }
  private load() {
    this.loading.set(true); this.error.set(null);
    this.userService.getAll({ name: this.nameFilter || undefined, page: this.currentPage }).subscribe({
      next: (res) => { this.users.set(res.data); if (res.meta) this.pagination.set(res.meta); this.loading.set(false); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.loading.set(false); },
    });
  }
  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(p: number) { this.currentPage = p; this.load(); }
}
