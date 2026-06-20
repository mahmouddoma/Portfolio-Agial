import { TestBed } from '@angular/core/testing';

import { AdminAuthService } from './admin-auth.service';

describe('AdminAuthService', () => {
  let service: AdminAuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('rejects unknown admin emails', () => {
    const result = service.requestOtp('wrong@example.com');

    expect(result.success).toBeFalse();
    expect(result.code).toBeUndefined();
  });

  it('creates and verifies a mock OTP for the allowed email', () => {
    const otp = service.requestOtp('devdoma2002@gmail.com');

    expect(otp.success).toBeTrue();
    expect(otp.code).toMatch(/^\d{6}$/);

    const verification = service.verifyOtp('devdoma2002@gmail.com', otp.code ?? '');
    expect(verification.success).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('rejects incorrect OTP values', () => {
    service.requestOtp('devdoma2002@gmail.com');

    const verification = service.verifyOtp('devdoma2002@gmail.com', '000000');

    expect(verification.success).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('expires OTP values after five minutes', () => {
    const nowSpy = spyOn(Date, 'now').and.returnValue(1000);
    const otp = service.requestOtp('devdoma2002@gmail.com');

    nowSpy.and.returnValue(1000 + 5 * 60 * 1000 + 1);
    const verification = service.verifyOtp('devdoma2002@gmail.com', otp.code ?? '');

    expect(verification.success).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('logs out and clears the session', () => {
    const otp = service.requestOtp('devdoma2002@gmail.com');
    service.verifyOtp('devdoma2002@gmail.com', otp.code ?? '');

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
  });
});
