import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { RoutineService } from '../../services/routine.service';
import { ToastService } from '../../shared/services/toast.service';
import type { CreateRoutineDto, UpdateRoutineDto } from '../../models/routine.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/routines" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display text-text">{{ isEdit() ? 'Edit Routine' : 'New Routine' }}</h2>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Name</label>
            <input [(ngModel)]="form.name" name="name" required placeholder="Push Day" class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Description</label>
            <textarea [(ngModel)]="form.description" name="description" required rows="3" placeholder="Describe the routine..." class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none resize-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1.5">Frequency (times/week)</label>
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
            <button type="submit" [disabled]="submitting()" class="btn-primary">{{ submitting() ? 'Saving...' : isEdit() ? 'Update Routine' : 'Create Routine' }}</button>
            <a routerLink="/routines" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
})
export class RoutineFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routineService = inject(RoutineService);
  private readonly toast = inject(ToastService);

  protected readonly icons = ICONS;
  protected readonly isEdit = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: CreateRoutineDto = { name: '', description: '', frequency: 3, type: 'customized' };
  private editId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id); this.isEdit.set(true);
      this.routineService.getById(this.editId).subscribe({
        next: (res) => { this.form = { name: res.data.name, description: res.data.description, frequency: res.data.frequency, type: res.data.type }; },
        error: (err) => this.error.set(err.error?.message ?? err.message),
      });
    }
  }

  protected onSubmit() {
    if (!this.form.name || !this.form.description || !this.form.frequency) { this.error.set('Name, description, and frequency are required'); return; }
    this.submitting.set(true); this.error.set(null);
    const request = this.isEdit() ? this.routineService.update(this.editId!, this.form as UpdateRoutineDto) : this.routineService.create(this.form);
    request.subscribe({
      next: (res) => { this.toast.show(this.isEdit() ? 'Routine updated' : 'Routine created'); this.router.navigate(this.isEdit() ? ['/routines'] : ['/routines', res.data.id]); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
