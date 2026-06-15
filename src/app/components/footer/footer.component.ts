import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FOOTER_CONTENT, NAV_ITEMS } from '../../data/site-content';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private readonly language = inject(LanguageService);

  currentYear = new Date().getFullYear();
  readonly companyName = computed(() => this.language.text(FOOTER_CONTENT.companyName));
  readonly companyLogoAlt = computed(() => this.language.text(FOOTER_CONTENT.companyLogoAlt));
  readonly content = computed(() => ({
    quickLinksTitle: this.language.text(FOOTER_CONTENT.quickLinksTitle),
    contactTitle: this.language.text(FOOTER_CONTENT.contactTitle),
    followTitle: this.language.text(FOOTER_CONTENT.followTitle),
    emailLabel: this.language.text(FOOTER_CONTENT.emailLabel),
    phoneLabel: this.language.text(FOOTER_CONTENT.phoneLabel),
    addressLabel: this.language.text(FOOTER_CONTENT.addressLabel),
    address: this.language.text(FOOTER_CONTENT.address),
    rights: this.language.text(FOOTER_CONTENT.rights),
  }));
  
  socialLinks = [
    { icon: 'facebook', url: '#', ariaLabel: 'Visit our Facebook page' },
    { icon: 'twitter', url: '#', ariaLabel: 'Follow us on Twitter' },
    { icon: 'instagram', url: '#', ariaLabel: 'Follow us on Instagram' },
    { icon: 'linkedin', url: '#', ariaLabel: 'Connect with us on LinkedIn' }
  ];

  readonly quickLinks = computed(() =>
    NAV_ITEMS.map((item) => ({
      id: item.id,
      text: this.language.text(item.label),
    })),
  );

  contactInfo = {
    email: 'info@ajyalalquran.com',
    phone: '+1 (123) 456-7890',
    address: '123 Business Street, City, Country'
  };

  /**
   * Scroll to a section when clicking a navigation link.
   * @param event - The click event from the navigation link.
   */
  scrollTo(event: Event, sectionId: string): void {
    event.preventDefault();
    const targetElement = document.getElementById(sectionId);
    targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
