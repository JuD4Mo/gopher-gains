import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../shared/services/toast.service';
import { UserService } from '../../services/user.service';
import type { User } from '../../models/user.model';
import { catchError, of } from 'rxjs';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/sessions" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display text-text">New Workout Session</h2>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">User</label>
            <select [(ngModel)]="userId" name="userId" required class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none">
              <option value="0" disabled>Select a user</option>
              @for (u of users(); track u.id) {
                <option [ngValue]="u.id">{{ u.name }} {{ u.lastName }} ({{ u.email }})</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Observations (optional)</label>
            <textarea [(ngModel)]="observations" name="observations" rows="3" class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none resize-none"></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="submitting()" class="btn-primary">{{ submitting() ? 'Starting...' : 'Start Session' }}</button>
            <a routerLink="/sessions" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
})
export class SessionFormPage implements OnInit {
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  protected readonly icons = ICONS;
  protected readonly users = signal<User[]>([]);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected userId = 0;
  protected observations = '';

  ngOnInit() {
    this.userService.getAll({ limit: 100 }).pipe(catchError(() => of(null))).subscribe({
      next: (res) => { if (res) this.users.set(res.data); },
    });
  }

  protected onSubmit() {
    if (!this.userId) { this.error.set('Please select a user'); return; }
    this.submitting.set(true); this.error.set(null);
    this.sessionService.create({ userId: this.userId, observations: this.observations || undefined }).subscribe({
      next: (res) => { this.toast.show('Session started'); this.router.navigate(['/sessions', res.data.id]); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
