import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
   submitContactForm(formData: ContactFormData): Observable<{ success: boolean; message: string }> {
     return of({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
    }).pipe(delay(1000));  
  }
}