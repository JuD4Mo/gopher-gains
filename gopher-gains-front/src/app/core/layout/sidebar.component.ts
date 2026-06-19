import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SafeHtmlPipe } from '../../shared/safe-html.pipe';
import { ICONS } from '../../shared/icons';
import { SidebarService } from './sidebar.service';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SafeHtmlPipe],
  template: `
    @if (sidebar.open()) {
      <div
        class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
        (click)="sidebar.close()"
      ></div>
    }

    <aside
      class="fixed top-0 left-0 z-40 h-dvh w-sidebar bg-sidebar flex flex-col select-none transition-transform duration-200 -translate-x-full lg:translate-x-0"
      [class.translate-x-0]="sidebar.open()"
    >
      <div class="relative flex items-center gap-3 px-5 h-20 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-sidebar to-accent/20"></div>
        <div class="relative flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center" aria-hidden="true">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-accent" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <span class="text-base font-bold tracking-tight text-white font-display">Gopher</span>
              <span class="text-base font-light text-accent font-display">Gains</span>
            </div>
          </div>
          <button (click)="sidebar.close()" class="lg:hidden p-1 text-sidebar-muted hover:text-white transition-colors" aria-label="Close sidebar">
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      <nav class="flex-1 py-4 space-y-0.5 px-3">
        @for (item of navItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-sidebar-hover text-white"
            [routerLinkActiveOptions]="{ exact: isExactRoute(item.route) }"
            class="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-muted hover:text-white hover:bg-sidebar-hover transition-all duration-150"
            [class.border-l-2!]="isActive(item.route)"
            [class.border-accent!]="isActive(item.route)"
            [class.pl-[10px]!]="isActive(item.route)"
            [class.bg-sidebar-hover!]="isActive(item.route)"
            [class.text-white!]="isActive(item.route)"
            [class.shadow-accent-glow]="isActive(item.route)"
            (click)="sidebar.close()"
          >
            <span class="w-5 h-5 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full" [innerHTML]="item.icon | safeHtml"></span>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="px-5 py-4 border-t border-white/5">
        <p class="text-xs text-sidebar-muted/80">Gopher Gains &mdash; v1.0</p>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly router = inject(Router);
  protected readonly sidebar = inject(SidebarService);
  private readonly auth = inject(AuthService);

  private readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: ICONS.dashboard },
    { label: 'Exercises', route: '/exercises', icon: ICONS.exercises },
    { label: 'Routines', route: '/routines', icon: ICONS.routines },
    { label: 'Users', route: '/users', icon: ICONS.users, adminOnly: true },
    { label: 'Sessions', route: '/sessions', icon: ICONS.sessions },
    { label: 'Assignments', route: '/assignments', icon: ICONS.assignments, adminOnly: true },
  ];

  protected readonly navItems = computed(() => {
    const role = this.auth.currentRole();
    const dashboardRoute = role === 'admin' ? '/admin' : '/my';
    return this.allNavItems
      .filter(item => !item.adminOnly || role === 'admin')
      .map(item => item.label === 'Dashboard' ? { ...item, route: dashboardRoute } : item);
  });

  protected readonly exactRoutes = new Set(['/admin', '/my']);

  protected isExactRoute(route: string): boolean {
    return this.exactRoutes.has(route);
  }

  protected isActive(route: string): boolean {
    if (this.isExactRoute(route)) return this.router.url === route;
    return this.router.url.startsWith(route);
  }
}
