import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { UserRole } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentRole = signal<UserRole>('admin');

  constructor() {
    this.syncFromUrl(this.router.url);
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(e => this.syncFromUrl(e.urlAfterRedirects));
  }

  private syncFromUrl(url: string) {
    if (url.startsWith('/my')) {
      this.currentRole.set('user');
    } else if (url.startsWith('/admin')) {
      this.currentRole.set('admin');
    }
  }
}
