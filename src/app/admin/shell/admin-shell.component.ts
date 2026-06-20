import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AdminAuthService } from '../../core/auth/admin-auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: false,
  templateUrl: './admin-shell.component.html',
  styleUrl: '../admin-shared.css',
})
export class AdminShellComponent {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  readonly adminEmail = this.auth.currentEmail;

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/']);
  }
}
