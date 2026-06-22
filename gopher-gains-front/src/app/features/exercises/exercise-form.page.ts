import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { ExerciseService } from '../../services/exercise.service';
import { ToastService } from '../../shared/services/toast.service';
import type { CreateExerciseDto, UpdateExerciseDto } from '../../models/exercise.model';
import type { MuscleGroup } from '../../models/api-response.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-exercise-form',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/exercises" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display text-text">{{ isEdit() ? 'Edit Exercise' : 'New Exercise' }}</h2>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Name</label>
            <input
              [(ngModel)]="form.name" name="name" required
              placeholder="Bench Press"
              class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Muscle Group</label>
            <select
              [(ngModel)]="form.muscleGroup" name="muscleGroup" required
              class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none"
            >
              <option value="" disabled>Select a muscle group</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="arms">Arms</option>
              <option value="delts">Delts</option>
              <option value="abs">Abs</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Description</label>
            <textarea
              [(ngModel)]="form.description" name="description" required rows="3"
              placeholder="Describe the exercise..."
              class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Execution Tip</label>
            <textarea
              [(ngModel)]="form.executionTip" name="executionTip" required rows="2"
              placeholder="How to perform this exercise correctly..."
              class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="submitting()" class="btn-primary">
              {{ submitting() ? 'Saving...' : isEdit() ? 'Update Exercise' : 'Create Exercise' }}
            </button>
            <a routerLink="/exercises" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
})
export class ExerciseFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exerciseService = inject(ExerciseService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;
  protected readonly isEdit = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected form: CreateExerciseDto = { name: '', description: '', executionTip: '', muscleGroup: '' as MuscleGroup };
  private editId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.isEdit.set(true);
      this.exerciseService.getById(this.editId).subscribe({
        next: (res) => { this.form = { name: res.data.name, description: res.data.description, executionTip: res.data.executionTip, muscleGroup: res.data.muscleGroup }; },
        error: (err) => this.error.set(err.error?.message ?? err.message ?? 'Failed to load exercise'),
      });
    }
  }

  protected onSubmit() {
    if (!this.form.name || !this.form.description || !this.form.executionTip || !this.form.muscleGroup) {
      this.error.set('All fields are required');
      return;
    }
    this.submitting.set(true);
    this.error.set(null);
    const request = this.isEdit()
      ? this.exerciseService.update(this.editId!, this.form as UpdateExerciseDto)
      : this.exerciseService.create(this.form);
    request.subscribe({
      next: () => { this.toast.show(this.isEdit() ? 'Exercise updated' : 'Exercise created'); this.router.navigate(['/exercises']); },
      error: (err) => { this.error.set(err.error?.message ?? err.message ?? 'Failed to save exercise'); this.submitting.set(false); },
    });
  }
}
