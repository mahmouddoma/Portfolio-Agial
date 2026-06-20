import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AdminAuthService } from './admin-auth.service';
import { adminAuthGuard } from './admin-auth.guard';

describe('adminAuthGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('redirects anonymous users to admin login', () => {
    const result = TestBed.runInInjectionContext(() => adminAuthGuard({} as any, {} as any));
    const router = TestBed.inject(Router);

    expect(result).toEqual(router.createUrlTree(['/admin/login']));
  });

  it('allows authenticated admins', () => {
    const auth = TestBed.inject(AdminAuthService);
    const otp = auth.requestOtp('devdoma2002@gmail.com');
    auth.verifyOtp('devdoma2002@gmail.com', otp.code ?? '');

    const result = TestBed.runInInjectionContext(() => adminAuthGuard({} as any, {} as any));

    expect(result).toBeTrue();
  });
});
