import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { RoutineService } from '../../services/routine.service';
import { ToastService } from '../../shared/services/toast.service';
import type { UpdateRoutineDto } from '../../models/routine.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-routine-edit',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a [routerLink]="['/routines', routineId]" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display text-text">Edit Routine</h2>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />
          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Name</label>
            <input [(ngModel)]="form.name" name="name" class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="3" class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none resize-none"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1.5">Frequency</label>
              <input type="number" [(ngModel)]="form.frequency" name="frequency" min="1" max="7" class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text mb-1.5">Type</label>
              <select [(ngModel)]="form.type" name="type" class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none">
                <option value="default">Default</option>
                <option value="customized">Customized</option>
              </select>
            </div>
          </div>
          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="submitting()" class="btn-primary">{{ submitting() ? 'Saving...' : 'Update Routine' }}</button>
            <a [routerLink]="['/routines', routineId]" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
})
export class RoutineEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routineService = inject(RoutineService);
  private readonly toast = inject(ToastService);
  protected readonly icons = ICONS;
  protected routineId = 0;
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: UpdateRoutineDto = {};

  ngOnInit() {
    this.routineId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.routineId) {
      this.routineService.getById(this.routineId).subscribe({
        next: (res) => { this.form = { name: res.data.name, description: res.data.description, frequency: res.data.frequency, type: res.data.type }; },
        error: (err) => this.error.set(err.error?.message ?? err.message),
      });
    }
  }

  protected onSubmit() {
    this.submitting.set(true); this.error.set(null);
    this.routineService.update(this.routineId, this.form).subscribe({
      next: () => { this.toast.show('Routine updated'); this.router.navigate(['/routines']); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
