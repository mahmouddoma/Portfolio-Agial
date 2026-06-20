import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminAuthService } from '../../core/auth/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.component.html',
  styleUrl: '../admin-shared.css',
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  readonly emailForm = this.fb.group({
    email: [this.auth.allowedEmail, [Validators.required, Validators.email]],
  });
  readonly otpForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]],
  });

  otpCode: string | null = null;
  message = '';
  error = '';
  isOtpStep = false;

  requestOtp(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const result = this.auth.requestOtp(this.emailForm.controls.email.value ?? '');
    this.message = result.success ? result.message : '';
    this.error = result.success ? '' : result.message;
    this.otpCode = result.code ?? null;
    this.isOtpStep = result.success;
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const result = this.auth.verifyOtp(
      this.emailForm.controls.email.value ?? '',
      this.otpForm.controls.code.value ?? '',
    );
    this.message = result.success ? result.message : '';
    this.error = result.success ? '' : result.message;

    if (result.success) {
      void this.router.navigate(['/admin/dashboard']);
    }
  }
}
