import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    @if (visible()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-card rounded-xl border border-border shadow-xl w-full max-w-md mx-4 p-6">
          <h3 class="text-base font-semibold text-text mb-2">{{ title() }}</h3>
          <p class="text-sm text-text-muted mb-6">{{ message() }}</p>
          <div class="flex items-center justify-end gap-3">
            <button (click)="cancel()" class="btn-secondary">
              Cancel
            </button>
            <button (click)="confirm()" class="btn-danger">
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ConfirmDialogComponent {
  private readonly state = signal<{
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  protected readonly visible = () => this.state() !== null;
  protected readonly title = () => this.state()?.title ?? '';
  protected readonly message = () => this.state()?.message ?? '';
  protected readonly confirmText = () => this.state()?.confirmText ?? 'Confirm';

  open(options: { title: string; message: string; confirmText?: string; onConfirm: () => void }) {
    this.state.set({ title: options.title, message: options.message, confirmText: options.confirmText ?? 'Confirm', onConfirm: options.onConfirm });
  }

  protected confirm() {
    this.state()?.onConfirm();
    this.state.set(null);
  }

  protected cancel() {
    this.state.set(null);
  }
}
