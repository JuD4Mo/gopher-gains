import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/components/card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { UserRoutineService } from '../../services/user-routine.service';
import { UserService } from '../../services/user.service';
import { RoutineService } from '../../services/routine.service';
import { ToastService } from '../../shared/services/toast.service';
import type { User } from '../../models/user.model';
import type { Routine } from '../../models/routine.model';
import type { UserRoutine } from '../../models/user-routine.model';
import { catchError, of } from 'rxjs';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-assignment',
  standalone: true,
  imports: [FormsModule, DatePipe, CardComponent, EmptyStateComponent, ErrorMessageComponent],
  template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <app-card>
          <div class="p-5">
            <h3 class="text-base font-semibold text-text font-display mb-4">Assign Routine</h3>
            <app-error-message [message]="error()" />

            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-text mb-1">User</label>
                <select
                  [(ngModel)]="selectedUserId"
                  class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
                >
                  <option value="0" disabled>Select user</option>
                  @for (u of users(); track u.id) {
                    <option [ngValue]="u.id">{{ u.name }} {{ u.lastName }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-text mb-1">Routine</label>
                <select
                  [(ngModel)]="selectedRoutineId"
                  class="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
                >
                  <option value="0" disabled>Select routine</option>
                  @for (r of routines(); track r.id) {
                    <option [ngValue]="r.id">{{ r.name }}</option>
                  }
                </select>
              </div>
              <button
                (click)="assign()"
                [disabled]="submitting()"
                class="btn-primary w-full"
              >
                {{ submitting() ? 'Assigning...' : 'Assign' }}
              </button>
            </div>
          </div>
        </app-card>

        <div class="lg:col-span-2">
          <app-card>
            <div class="p-5">
              <h3 class="text-base font-semibold text-text font-display mb-4">Current Assignments</h3>

              @if (assignments().length === 0) {
                <app-empty-state [icon]="icons.emptyBox" title="No assignments yet" message="Assign a routine to a user to get started." />
              } @else {
                <div class="overflow-x-auto -mx-5">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-border">
                        <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">User</th>
                        <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Routine</th>
                        <th class="text-left py-3 px-5 font-semibold text-text-muted text-xs uppercase tracking-wider">Assigned At</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (a of assignments(); track a.userId + '-' + a.routineId) {
                        <tr class="border-b border-border/50 hover:bg-surface-light transition-colors">
                          <td class="py-3 px-5 text-text">{{ userNames()[a.userId] ?? 'User #' + a.userId }}</td>
                          <td class="py-3 px-5 text-text">{{ routineNames()[a.routineId] ?? 'Routine #' + a.routineId }}</td>
                          <td class="py-3 px-5 text-text-muted">{{ a.assignedAt | date:'medium' }}</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </app-card>
        </div>
      </div>
    </div>
  `,
})
export class AssignmentPage implements OnInit {
  private readonly userRoutineService = inject(UserRoutineService);
  private readonly userService = inject(UserService);
  private readonly routineService = inject(RoutineService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;
  protected readonly users = signal<User[]>([]);
  protected readonly routines = signal<Routine[]>([]);
  protected readonly assignments = signal<UserRoutine[]>([]);
  protected readonly userNames = signal<Record<number, string>>({});
  protected readonly routineNames = signal<Record<number, string>>({});
  protected readonly error = signal<string | null>(null);
  protected readonly submitting = signal(false);

  protected selectedUserId = 0;
  protected selectedRoutineId = 0;

  ngOnInit() {
    this.loadUsers();
    this.loadRoutines();
  }

  private loadUsers() {
    this.userService.getAll({ limit: 100 }).pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res) {
          this.users.set(res.data);
          const names: Record<number, string> = {};
          for (const u of res.data) names[u.id] = `${u.name} ${u.lastName}`;
          this.userNames.set(names);
        }
      },
    });
  }

  private loadRoutines() {
    this.routineService.getAll({ limit: 100 }).pipe(catchError(() => of(null))).subscribe({
      next: (res) => {
        if (res) {
          this.routines.set(res.data);
          const names: Record<number, string> = {};
          for (const r of res.data) names[r.id] = r.name;
          this.routineNames.set(names);
        }
      },
    });
  }

  private loadAssignments(userId?: number) {
    this.userRoutineService.getByUser(userId ?? this.selectedUserId).subscribe({
      next: (res) => this.assignments.set(res.data),
      error: () => {},
    });
  }

  protected assign() {
    if (!this.selectedUserId || !this.selectedRoutineId) {
      this.error.set('Please select both a user and a routine');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    this.userRoutineService.assign({ userId: this.selectedUserId, routineId: this.selectedRoutineId }).subscribe({
      next: () => {
        this.toast.show('Routine assigned');
        this.loadAssignments(this.selectedUserId);
        this.submitting.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? err.message);
        this.submitting.set(false);
      },
    });
  }
}
