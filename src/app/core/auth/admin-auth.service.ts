import { Injectable, signal } from '@angular/core';

export interface AdminOtpResult {
  success: boolean;
  message: string;
  code?: string;
}

interface AdminSession {
  email: string;
  expiresAt: number;
}

interface PendingOtp {
  email: string;
  code: string;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  readonly allowedEmail = 'devdoma2002@gmail.com';

  private readonly sessionKey = 'agial-admin-session';
  private readonly sessionDurationMs = 8 * 60 * 60 * 1000;
  private readonly otpDurationMs = 5 * 60 * 1000;
  private pendingOtp: PendingOtp | null = null;

  readonly authenticated = signal(this.readSession() !== null);
  readonly currentEmail = signal(this.readSession()?.email ?? null);

  requestOtp(email: string): AdminOtpResult {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== this.allowedEmail) {
      return {
        success: false,
        message: 'هذا البريد غير مصرح له بالدخول إلى لوحة التحكم.',
      };
    }

    const code = this.generateOtp();
    this.pendingOtp = {
      email: normalizedEmail,
      code,
      expiresAt: Date.now() + this.otpDurationMs,
    };

    return {
      success: true,
      code,
      message: 'تم إنشاء كود OTP تجريبي صالح لمدة 5 دقائق.',
    };
  }

  verifyOtp(email: string, code: string): AdminOtpResult {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    if (!this.pendingOtp || this.pendingOtp.email !== normalizedEmail) {
      return {
        success: false,
        message: 'اطلب كود OTP جديد قبل تسجيل الدخول.',
      };
    }

    if (Date.now() > this.pendingOtp.expiresAt) {
      this.pendingOtp = null;
      return {
        success: false,
        message: 'انتهت صلاحية كود OTP. اطلب كودا جديدا.',
      };
    }

    if (this.pendingOtp.code !== normalizedCode) {
      return {
        success: false,
        message: 'كود OTP غير صحيح.',
      };
    }

    this.createSession(normalizedEmail);
    this.pendingOtp = null;
    return {
      success: true,
      message: 'تم تسجيل الدخول بنجاح.',
    };
  }

  isAuthenticated(): boolean {
    const session = this.readSession();
    const isValid = !!session;
    this.authenticated.set(isValid);
    this.currentEmail.set(session?.email ?? null);
    return isValid;
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.sessionKey);
    }

    this.authenticated.set(false);
    this.currentEmail.set(null);
    this.pendingOtp = null;
  }

  private createSession(email: string): void {
    const session: AdminSession = {
      email,
      expiresAt: Date.now() + this.sessionDurationMs,
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
    }

    this.authenticated.set(true);
    this.currentEmail.set(email);
  }

  private readSession(): AdminSession | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawSession = localStorage.getItem(this.sessionKey);
    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as AdminSession;
      if (Date.now() > session.expiresAt) {
        localStorage.removeItem(this.sessionKey);
        return null;
      }

      return session;
    } catch {
      localStorage.removeItem(this.sessionKey);
      return null;
    }
  }

  private generateOtp(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
}
