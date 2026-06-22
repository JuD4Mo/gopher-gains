import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PaginationComponent } from '../../shared/components/pagination.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { MuscleGroupBadgeComponent } from '../../shared/components/muscle-group-badge.component';
import { ExerciseService } from '../../services/exercise.service';
import type { Exercise } from '../../models/exercise.model';
import type { PaginationMeta } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [
    RouterLink, CardComponent, LoadingSpinnerComponent, EmptyStateComponent,
    PaginationComponent, ErrorMessageComponent, MuscleGroupBadgeComponent, FormsModule, SafeHtmlPipe,
  ],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
            <div class="w-4 h-4 text-teal [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.exercises | safeHtml"></div>
          </div>
          <h2 class="text-xl font-bold font-display text-text">Exercises</h2>
        </div>
        <a routerLink="/exercises/new" class="btn-primary">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
          New Exercise
        </a>
      </div>

      <app-card [accentColor]="'teal'">
        <div class="p-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="relative flex-1">
              <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none w-4 h-full [&>svg]:w-4 [&>svg]:h-4 text-text-muted" [innerHTML]="icons.search | safeHtml"></div>
              <input
                [(ngModel)]="nameFilter"
                (input)="onFilterChange()"
                placeholder="Search exercises..."
                class="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
              />
            </div>
            <select
              [(ngModel)]="muscleFilter"
              (change)="onFilterChange()"
              class="px-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
            >
              <option value="">All muscles</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="arms">Arms</option>
              <option value="delts">Delts</option>
              <option value="abs">Abs</option>
            </select>
          </div>

          @if (loading()) {
            <app-loading-spinner />
          } @else if (error()) {
            <app-error-message [message]="error()" />
          } @else if (exercises().length === 0) {
            <app-empty-state
              [icon]="icons.emptyBox"
              title="No exercises yet"
              message="Create your first exercise to get started."
            />
          } @else {
            <div class="overflow-x-auto -mx-5">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Name</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Muscle Group</th>
                    <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Description</th>
                    <th class="text-right py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (ex of exercises(); track ex.id) {
                    <tr class="border-b border-border/50 hover:bg-surface-light transition-colors">
                      <td class="py-3 px-5 font-medium text-text">{{ ex.name }}</td>
                      <td class="py-3 px-5">
                        <app-muscle-group-badge [group]="ex.muscleGroup" />
                      </td>
                      <td class="py-3 px-5 text-text-muted max-w-xs truncate">{{ ex.description }}</td>
                      <td class="py-3 px-5 text-right">
                        <a [routerLink]="['/exercises', ex.id]" class="btn-ghost text-sm px-3 py-1.5 rounded-lg" aria-label="Edit {{ ex.name }}">
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
export class ExerciseListPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);

  protected readonly icons = ICONS;
  protected readonly exercises = signal<Exercise[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly pagination = signal<PaginationMeta>({ page: 1, perPage: 10, pageCount: 0, totalCount: 0 });

  protected nameFilter = '';
  protected muscleFilter = '';
  private currentPage = 1;

  ngOnInit() { this.load(); }

  private load() {
    this.loading.set(true);
    this.error.set(null);
    this.exerciseService.getAll({
      name: this.nameFilter || undefined,
      muscleGroup: this.muscleFilter || undefined,
      page: this.currentPage,
    }).subscribe({
      next: (res) => {
        this.exercises.set(res.data);
        if (res.meta) this.pagination.set(res.meta);
        this.loading.set(false);
      },
      error: (err) => { this.error.set(err.error?.message ?? err.message ?? 'Failed to load exercises'); this.loading.set(false); },
    });
  }

  protected onFilterChange() { this.currentPage = 1; this.load(); }
  protected onPageChange(page: number) { this.currentPage = page; this.load(); }
}
