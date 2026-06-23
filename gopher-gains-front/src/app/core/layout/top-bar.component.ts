import { Component, input, inject } from '@angular/core';
import { SidebarService } from './sidebar.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  template: `
    <header class="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      <div class="flex items-center gap-3">
        <button (click)="sidebar.toggle()" class="lg:hidden p-2 -ml-1 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-colors" aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <h1 class="text-lg font-display font-bold text-text truncate">{{ title() }}</h1>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <span class="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="7" r="3.5"/>
            <path d="M4.5 20c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5"/>
          </svg>
        </span>
        <span class="text-sm text-text-muted font-medium hidden sm:inline">{{ auth.currentRole() === 'admin' ? 'Admin' : 'User' }}</span>
      </div>
    </header>
  `,
})
export class TopBarComponent {
  readonly title = input<string>('');
  protected readonly sidebar = inject(SidebarService);
  protected readonly auth = inject(AuthService);
}
