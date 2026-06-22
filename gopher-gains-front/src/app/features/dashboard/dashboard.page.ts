import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { ExerciseService } from '../../services/exercise.service';
import { RoutineService } from '../../services/routine.service';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { UserRoutineService } from '../../services/user-routine.service';
import { AuthService } from '../../core/services/auth.service';
import { catchError, of, forkJoin } from 'rxjs';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ICONS } from '../../shared/icons';
import type { WorkoutSession } from '../../models/session.model';
import type { UserRoutine } from '../../models/user-routine.model';
import type { Routine } from '../../models/routine.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, CardComponent, SafeHtmlPipe, EmptyStateComponent],
  template: `
    @if (auth.currentRole() === 'admin') {
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (stat of stats(); track stat.label) {
            <app-card>
              <a [routerLink]="stat.link" class="block p-5 group">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">{{ stat.label }}</span>
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                    [class.bg-accent/10]="stat.color === 'accent'"
                    [class.text-accent]="stat.color === 'accent'"
                    [class.bg-teal/10]="stat.color === 'teal'"
                    [class.text-teal]="stat.color === 'teal'"
                    [class.bg-success/10]="stat.color === 'success'"
                    [class.text-success]="stat.color === 'success'"
                  >
                    <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:transition-transform [&>svg]:duration-200 group-hover:[&>svg]:scale-110" [innerHTML]="stat.icon | safeHtml"></div>
                  </div>
                </div>
                <p class="text-2xl font-bold font-display text-text">{{ stat.count }}</p>
              </a>
            </app-card>
          }
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-card>
            <div class="p-5">
              <h2 class="text-base font-semibold text-text font-display mb-4">Quick Actions</h2>
              <div class="grid grid-cols-2 gap-3">
                <a routerLink="/exercises/new" class="flex flex-col items-start gap-2 p-4 rounded-lg border border-border/50 hover:border-accent/20 hover:bg-surface-light transition-all duration-150 group">
                  <span class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></div>
                  </span>
                  <span class="text-sm font-medium text-text group-hover:text-accent transition-colors">New Exercise</span>
                  <span class="text-xs text-text-muted">Add exercises to the catalog</span>
                </a>
                <a routerLink="/routines/new" class="flex flex-col items-start gap-2 p-4 rounded-lg border border-border/50 hover:border-teal/20 hover:bg-surface-light transition-all duration-150 group">
                  <span class="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                    <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></div>
                  </span>
                  <span class="text-sm font-medium text-text group-hover:text-teal transition-colors">New Routine</span>
                  <span class="text-xs text-text-muted">Build or customize a routine</span>
                </a>
                <a routerLink="/users/new" class="flex flex-col items-start gap-2 p-4 rounded-lg border border-border/50 hover:border-success/20 hover:bg-surface-light transition-all duration-150 group">
                  <span class="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
                    <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></div>
                  </span>
                  <span class="text-sm font-medium text-text group-hover:text-success transition-colors">New User</span>
                  <span class="text-xs text-text-muted">Register a new user account</span>
                </a>
                <a routerLink="/sessions/new" class="flex flex-col items-start gap-2 p-4 rounded-lg border border-border/50 hover:border-accent/20 hover:bg-surface-light transition-all duration-150 group">
                  <span class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></div>
                  </span>
                  <span class="text-sm font-medium text-text group-hover:text-accent transition-colors">New Session</span>
                  <span class="text-xs text-text-muted">Start tracking a workout</span>
                </a>
              </div>
            </div>
          </app-card>

          <app-card>
            <div class="p-5">
              <h2 class="text-base font-semibold text-text font-display mb-4">Overview</h2>
              <div class="space-y-3">
                @for (stat of stats(); track stat.label) {
                  <div class="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full"
                        [class.bg-teal]="stat.color === 'teal'"
                        [class.bg-accent]="stat.color === 'accent'"
                        [class.bg-success]="stat.color === 'success'"
                      ></div>
                      <span class="text-sm text-text-muted">{{ stat.label }}</span>
                    </div>
                    <span class="text-sm font-semibold text-text">{{ stat.count }}</span>
                  </div>
                }
                <a routerLink="/assignments" class="flex items-center justify-between pt-3 text-sm font-medium text-accent hover:text-accent-dark transition-colors">
                  <span>View all assignments</span>
                  <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.chevronRight | safeHtml"></span>
                </a>
              </div>
            </div>
          </app-card>
        </div>
      </div>
    } @else {
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <app-card>
            <div class="p-5">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">My Sessions</span>
                <div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.sessions | safeHtml"></div>
                </div>
              </div>
              <p class="text-2xl font-bold font-display text-text">{{ userSessionCount() }}</p>
            </div>
          </app-card>
          <app-card>
            <div class="p-5">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Assigned Routines</span>
                <div class="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                  <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.routines | safeHtml"></div>
                </div>
              </div>
              <p class="text-2xl font-bold font-display text-text">{{ assignedRoutines().length }}</p>
            </div>
          </app-card>
          <app-card>
            <div class="p-5">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-semibold uppercase tracking-wider text-text-muted">Exercises Available</span>
                <div class="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
                  <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.exercises | safeHtml"></div>
                </div>
              </div>
              <p class="text-2xl font-bold font-display text-text">{{ userExerciseCount() }}</p>
            </div>
          </app-card>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-card>
            <div class="p-5">
              <h2 class="text-base font-semibold text-text font-display mb-4">Recent Sessions</h2>
              @if (recentSessions().length === 0) {
                <app-empty-state [icon]="icons.sessions" title="No sessions yet" message="Start your first workout session to track your progress." />
              } @else {
                <div class="space-y-2">
                  @for (s of recentSessions(); track s.id) {
                    <a [routerLink]="'/sessions/' + s.id" class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-light transition-colors group">
                      <div>
                        <p class="text-sm font-medium text-text">{{ s.observations || 'Workout session' }}</p>
                        <p class="text-xs text-text-muted mt-0.5">{{ s.startTime | date:'MMM d, yyyy' }}</p>
                      </div>
                      <span class="w-4 h-4 text-text-muted group-hover:text-accent transition-colors [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.chevronRight | safeHtml"></span>
                    </a>
                  }
                </div>
                <a routerLink="/sessions" class="block mt-4 text-sm font-medium text-accent hover:text-accent-dark transition-colors">View all sessions</a>
              }
            </div>
          </app-card>

          <app-card>
            <div class="p-5">
              <h2 class="text-base font-semibold text-text font-display mb-4">My Routines</h2>
              @if (assignedRoutines().length === 0) {
                <app-empty-state [icon]="icons.routines" title="No routines assigned" message="Ask your admin to assign routines to get started." />
              } @else {
                <div class="space-y-2">
                  @for (a of assignedRoutines(); track a.routineId) {
                    <a [routerLink]="'/routines/' + a.routineId" class="flex items-center justify-between p-3 rounded-lg hover:bg-surface-light transition-colors group">
                      <div>
                        <p class="text-sm font-medium text-text">{{ routineNames()[a.routineId] ?? 'Routine #' + a.routineId }}</p>
                        <p class="text-xs text-text-muted mt-0.5">Assigned {{ a.assignedAt | date:'MMM d, yyyy' }}</p>
                      </div>
                      <span class="w-4 h-4 text-text-muted group-hover:text-accent transition-colors [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.chevronRight | safeHtml"></span>
                    </a>
                  }
                </div>
              }
            </div>
          </app-card>
        </div>

        <app-card>
          <div class="p-5">
            <h2 class="text-base font-semibold text-text font-display mb-4">Quick Actions</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a routerLink="/sessions/new" class="flex flex-col items-start gap-2 p-4 rounded-lg border border-border/50 hover:border-accent/20 hover:bg-surface-light transition-all duration-150 group">
                <span class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                  <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.plus | safeHtml"></div>
                </span>
                <span class="text-sm font-medium text-text group-hover:text-accent transition-colors">Start a Session</span>
                <span class="text-xs text-text-muted">Begin tracking your workout</span>
              </a>
              <a routerLink="/exercises" class="flex flex-col items-start gap-2 p-4 rounded-lg border border-border/50 hover:border-teal/20 hover:bg-surface-light transition-all duration-150 group">
                <span class="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal">
                  <div class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.exercises | safeHtml"></div>
                </span>
                <span class="text-sm font-medium text-text group-hover:text-teal transition-colors">Browse Exercises</span>
                <span class="text-xs text-text-muted">View the exercise catalog</span>
              </a>
            </div>
          </div>
        </app-card>
      </div>
    }
  `,
})
export class DashboardPage implements OnInit {
  private readonly exerciseService = inject(ExerciseService);
  private readonly routineService = inject(RoutineService);
  private readonly userService = inject(UserService);
  private readonly sessionService = inject(SessionService);
  private readonly userRoutineService = inject(UserRoutineService);
  protected readonly auth = inject(AuthService);

  protected readonly icons = ICONS;
  protected readonly stats = signal<{ label: string; count: number; icon: string; link: string; color: string }[]>([]);

  protected readonly userSessionCount = signal(0);
  protected readonly userExerciseCount = signal(0);
  protected readonly recentSessions = signal<WorkoutSession[]>([]);
  protected readonly assignedRoutines = signal<UserRoutine[]>([]);
  protected readonly routineNames = signal<Record<number, string>>({});

  ngOnInit() {
    this.loadAdminStats();
    this.loadUserData();
  }

  private loadAdminStats() {
    forkJoin({
      exercises: this.exerciseService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      routines: this.routineService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      users: this.userService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      sessions: this.sessionService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
    }).subscribe({
      next: (result) => {
        this.stats.set([
          { label: 'Exercises', count: result.exercises?.meta?.totalCount ?? 0, icon: ICONS.exercises, link: '/exercises', color: 'teal' },
          { label: 'Routines', count: result.routines?.meta?.totalCount ?? 0, icon: ICONS.routines, link: '/routines', color: 'accent' },
          { label: 'Users', count: result.users?.meta?.totalCount ?? 0, icon: ICONS.users, link: '/users', color: 'success' },
          { label: 'Sessions', count: result.sessions?.meta?.totalCount ?? 0, icon: ICONS.sessions, link: '/sessions', color: 'accent' },
        ]);
      },
    });
  }

  private loadUserData() {
    const userId = 1; // hardcoded until auth is added
    forkJoin({
      sessions: this.sessionService.getAll({ userId, limit: 5 }).pipe(catchError(() => of(null))),
      exercises: this.exerciseService.getAll({ limit: 1 }).pipe(catchError(() => of(null))),
      routines: this.userRoutineService.getByUser(userId).pipe(catchError(() => of(null))),
      allRoutines: this.routineService.getAll({ limit: 100 }).pipe(catchError(() => of(null))),
    }).subscribe({
      next: (result) => {
        this.recentSessions.set(result.sessions?.data ?? []);
        this.userSessionCount.set(result.sessions?.meta?.totalCount ?? 0);
        this.userExerciseCount.set(result.exercises?.meta?.totalCount ?? 0);

        const assignments = result.routines?.data ?? [];
        this.assignedRoutines.set(assignments);

        if (result.allRoutines?.data) {
          const names: Record<number, string> = {};
          for (const r of result.allRoutines.data) names[r.id] = r.name;
          this.routineNames.set(names);
        }
      },
    });
  }
}
