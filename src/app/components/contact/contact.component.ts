import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ContactService, ContactFormData } from '../../services/contact.service';
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EditableContentDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly language = inject(LanguageService);
  private readonly siteContent = inject(SiteContentFacade);

  contactForm!: FormGroup;
  isSubmitting = false;
  submitResult: { success: boolean; message: string } | null = null;

  readonly contactContent = computed(() => this.siteContent.content().contact);

  readonly content = computed(() => ({
    title: this.language.text(this.contactContent().title),
    description: this.language.text(this.contactContent().description),
    fields: {
      name: this.language.text(this.contactContent().fields.name),
      email: this.language.text(this.contactContent().fields.email),
      phone: this.language.text(this.contactContent().fields.phone),
      message: this.language.text(this.contactContent().fields.message),
    },
    submit: this.language.text(this.contactContent().submit),
    submitting: this.language.text(this.contactContent().submitting),
    phone: this.language.text(this.contactContent().phone),
    email: this.language.text(this.contactContent().email),
    address: this.language.text(this.contactContent().address),
    addressValue: this.language.text(this.contactContent().addressValue),
  }));

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
    const errorMessages: Record<string, string> = {
      required: this.language.text(this.contactContent().errors.required),
      email: this.language.text(this.contactContent().errors.email),
      minlength: `${this.language.text(this.contactContent().errors.minlength)} ${control.errors['minlength']?.requiredLength} ${this.language.text(this.contactContent().errors.chars)}`,
      pattern: this.language.text(this.contactContent().errors.pattern),
    };

    const firstError = Object.keys(errors)[0];
    return errorMessages[firstError] || this.language.text(this.contactContent().errors.fallback);
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
            message: this.language.text(this.contactContent().errors.submit)
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
