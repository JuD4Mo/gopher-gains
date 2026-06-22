import { Component, inject, signal, viewChild, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CardComponent } from '../../shared/components/card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { RoutineService } from '../../services/routine.service';
import { RoutineExerciseService } from '../../services/routine-exercise.service';
import { ExerciseService } from '../../services/exercise.service';
import type { Routine } from '../../models/routine.model';
import type { RoutineExercise } from '../../models/routine-exercise.model';
import type { Exercise } from '../../models/exercise.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-routine-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, LoadingSpinnerComponent, ErrorMessageComponent, EmptyStateComponent, ConfirmDialogComponent, SafeHtmlPipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/routines" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display text-text">{{ routine()?.name ?? 'Routine' }}</h2>
      </div>

      @if (loading()) { <app-loading-spinner size="lg" /> }
      @else if (!routine()) { <app-error-message message="Routine not found" /> }
      @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <app-card>
            <div class="p-5 space-y-4">
              <h3 class="text-base font-semibold text-text font-display">Details</h3>
              <div>
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Description</span>
                <p class="text-sm text-text mt-1">{{ routine()?.description }}</p>
              </div>
              <div class="flex gap-4">
                <div>
                  <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Frequency</span>
                  <p class="text-sm text-text mt-1 font-medium">{{ routine()?.frequency }}x / week</p>
                </div>
                <div>
                  <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Type</span>
                  <p class="text-sm text-text mt-1 capitalize font-medium">{{ routine()?.type }}</p>
                </div>
              </div>
              <a [routerLink]="['/routines', routine()?.id, 'edit']" class="btn-secondary w-full text-center">
                Edit Routine
              </a>
            </div>
          </app-card>

          <div class="lg:col-span-2">
            <app-card>
              <div class="p-5">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-base font-semibold text-text font-display">Exercises ({{ exercises().length }})</h3>
                  @if (!showAddForm()) {
                    <button (click)="showAddForm.set(true)" class="btn-primary text-xs px-3 py-1.5">
                      <span class="w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></span>
                      Add Exercise
                    </button>
                  }
                </div>

                @if (exercisesError()) { <app-error-message [message]="exercisesError()" /> }

                @if (showAddForm()) {
                  <div class="flex flex-wrap items-end gap-2 mb-4 p-4 bg-surface-light rounded-lg border border-border">
                    <div class="flex-1 min-w-40">
                      <label class="block text-xs font-medium text-text-muted mb-1">Exercise</label>
                      <select [(ngModel)]="newExerciseId" class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none">
                        <option value="0" disabled>Select exercise</option>
                        @for (ex of availableExercises(); track ex.id) {
                          <option [ngValue]="ex.id">{{ ex.name }} ({{ ex.muscleGroup }})</option>
                        }
                      </select>
                    </div>
                    <div class="w-24">
                      <label class="block text-xs font-medium text-text-muted mb-1">Step</label>
                      <input type="number" [(ngModel)]="newStepNumber" min="1" class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
                    </div>
                    <button (click)="addExercise()" class="btn-primary text-xs px-3 py-2">Add</button>
                    <button (click)="showAddForm.set(false)" class="btn-ghost text-xs px-3 py-2">Cancel</button>
                  </div>
                }

                @if (exercises().length === 0) {
                  <app-empty-state [icon]="icons.emptyBox" title="No exercises in this routine" message="Add exercises to build your routine." />
                } @else {
                  <div class="space-y-2">
                    @for (re of exercises(); track re.exerciseId) {
                      <div class="flex items-center gap-3 px-4 py-3 bg-surface-light rounded-lg border border-border/50">
                        <span class="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm font-bold font-display">{{ re.stepNumber }}</span>
                        <div class="flex-1">
                          <p class="text-sm font-medium text-text">{{ exerciseNames()[re.exerciseId] ?? 'Exercise #' + re.exerciseId }}</p>
                        </div>
                        <button (click)="confirmRemoveExercise(re.exerciseId)" class="btn-ghost text-xs text-danger hover:text-danger px-2 py-1" aria-label="Remove exercise">
                          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.trash | safeHtml"></span>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </app-card>
          </div>
        </div>
      }
    </div>

    <app-confirm-dialog />
  `,
})
export class RoutineDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly routineService = inject(RoutineService);
  private readonly routineExerciseService = inject(RoutineExerciseService);
  private readonly exerciseService = inject(ExerciseService);

  protected readonly icons = ICONS;
  protected readonly confirmDialog = viewChild(ConfirmDialogComponent);
  protected readonly routine = signal<Routine | null>(null);
  protected readonly exercises = signal<RoutineExercise[]>([]);
  protected readonly availableExercises = signal<Exercise[]>([]);
  protected readonly exerciseNames = signal<Record<number, string>>({});
  protected readonly loading = signal(true);
  protected readonly exercisesError = signal<string | null>(null);
  protected readonly showAddForm = signal(false);
  protected newExerciseId = 0;
  protected newStepNumber = 1;
  private routineId = 0;

  ngOnInit() {
    this.routineId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.routineId) return;
    forkJoin({
      routine: this.routineService.getById(this.routineId),
      routineExercises: this.routineExerciseService.getByRoutine(this.routineId).pipe(catchError(() => of(null))),
      allExercises: this.exerciseService.getAll({}).pipe(catchError(() => of(null))),
    }).subscribe({
      next: (result) => {
        this.routine.set(result.routine.data);
        if (result.routineExercises) this.exercises.set(result.routineExercises.data);
        if (result.allExercises) {
          this.availableExercises.set(result.allExercises.data);
          const names: Record<number, string> = {};
          for (const ex of result.allExercises.data) names[ex.id] = ex.name;
          this.exerciseNames.set(names);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected addExercise() {
    if (!this.newExerciseId) return;
    this.routineExerciseService.addExercise({ routineId: this.routineId, exerciseId: this.newExerciseId, stepNumber: this.newStepNumber }).subscribe({
      next: () => { this.showAddForm.set(false); this.newExerciseId = 0; this.load(); },
      error: (err) => this.exercisesError.set(err.error?.message ?? err.message),
    });
  }

  private load() {
    this.routineExerciseService.getByRoutine(this.routineId).pipe(catchError(() => of(null))).subscribe({
      next: (res) => { if (res) this.exercises.set(res.data); },
    });
  }

  protected confirmRemoveExercise(exerciseId: number) {
    this.confirmDialog()?.open({
      title: 'Remove exercise',
      message: 'Are you sure you want to remove this exercise from the routine?',
      confirmText: 'Remove',
      onConfirm: () => {
        this.routineExerciseService.remove(this.routineId, exerciseId).subscribe({ next: () => this.load(), error: (err) => this.exercisesError.set(err.error?.message ?? err.message) });
      },
    });
  }
}
