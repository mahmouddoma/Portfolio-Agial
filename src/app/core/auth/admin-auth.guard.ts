import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AdminAuthService } from './admin-auth.service';

export const adminAuthGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? true : router.createUrlTree(['/admin/login']);
};
