import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService, ContactFormData } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  submitResult: { success: boolean; message: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  getErrorMessage(field: string): string {
    const control = this.contactForm.get(field);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;
    const errorMessages: { [key: string]: string } = {
      required: 'هذا الحقل مطلوب',
      email: 'يرجى إدخال بريد إلكتروني صحيح',
      minlength: `يجب أن يكون الحد الأدنى ${control.errors['minlength']?.requiredLength} حروف`,
      pattern: 'يرجى إدخال رقم هاتف صحيح'
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || 'خطأ في الإدخال';
  }

  hasError(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.errors && control.touched);
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitResult = null;

      const formData: ContactFormData = this.contactForm.value;
      
      this.contactService.submitContactForm(formData).subscribe({
        next: (result) => {
          this.submitResult = result;
          if (result.success) {
            this.contactForm.reset();
            Object.keys(this.contactForm.controls).forEach(key => {
              this.contactForm.get(key)?.setErrors(null);
            });
          }
        },
        error: (error) => {
          this.submitResult = {
            success: false,
            message: 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.'
          };
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
