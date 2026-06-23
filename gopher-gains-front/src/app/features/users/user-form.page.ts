import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/components/card.component';
import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../shared/services/toast.service';
import type { CreateUserDto } from '../../models/user.model';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [RouterLink, FormsModule, CardComponent, ErrorMessageComponent, SafeHtmlPipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <div class="flex items-center gap-3">
        <a routerLink="/users" class="btn-ghost px-0 text-sm gap-1.5">
          <span class="w-4 h-4 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="icons.arrowLeft | safeHtml"></span>
          Back
        </a>
        <h2 class="text-xl font-bold font-display text-text">{{ isEdit() ? 'Edit User' : 'New User' }}</h2>
      </div>

      <app-card>
        <form (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <app-error-message [message]="error()" />

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-text mb-1.5">Name</label>
              <input [(ngModel)]="form.name" name="name" required class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-text mb-1.5">Last Name</label>
              <input [(ngModel)]="form.lastName" name="lastName" required class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-text mb-1.5">Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" required class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
          </div>

          @if (!isEdit()) {
            <div>
              <label class="block text-sm font-medium text-text mb-1.5">Password</label>
              <input type="password" [(ngModel)]="form.password" name="password" required class="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-surface-light focus:bg-card focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all outline-none" />
            </div>
          }

          <div class="flex items-center gap-3 pt-2">
            <button type="submit" [disabled]="submitting()" class="btn-primary">{{ submitting() ? 'Saving...' : isEdit() ? 'Update User' : 'Create User' }}</button>
            <a routerLink="/users" class="btn-secondary">Cancel</a>
          </div>
        </form>
      </app-card>
    </div>
  `,
})
export class UserFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);
  protected readonly icons = ICONS;
  protected readonly isEdit = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected form: CreateUserDto = { name: '', lastName: '', email: '', password: '' };
  private editId?: number;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id); this.isEdit.set(true);
      this.userService.getById(this.editId).subscribe({
        next: (res) => { this.form = { name: res.data.name, lastName: res.data.lastName, email: res.data.email, password: '' }; },
        error: (err) => this.error.set(err.error?.message ?? err.message),
      });
    }
  }

  protected onSubmit() {
    if (!this.form.name || !this.form.lastName || !this.form.email) { this.error.set('Name, last name, and email are required'); return; }
    if (!this.isEdit() && !this.form.password) { this.error.set('Password is required'); return; }
    this.submitting.set(true); this.error.set(null);
    const request = this.isEdit()
      ? this.userService.update(this.editId!, { name: this.form.name, lastName: this.form.lastName, email: this.form.email })
      : this.userService.create(this.form);
    request.subscribe({
      next: () => { this.toast.show(this.isEdit() ? 'User updated' : 'User created'); this.router.navigate(['/users']); },
      error: (err) => { this.error.set(err.error?.message ?? err.message); this.submitting.set(false); },
    });
  }
}
