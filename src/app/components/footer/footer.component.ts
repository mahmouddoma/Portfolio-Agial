import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  companyName = 'أجيال القرآن';
  
  socialLinks = [
    { icon: 'facebook', url: '#', ariaLabel: 'Visit our Facebook page' },
    { icon: 'twitter', url: '#', ariaLabel: 'Follow us on Twitter' },
    { icon: 'instagram', url: '#', ariaLabel: 'Follow us on Instagram' },
    { icon: 'linkedin', url: '#', ariaLabel: 'Connect with us on LinkedIn' }
  ];

  quickLinks = [
    { path: '/about', text: 'من نحن' },
    { path: '/features', text: 'الميزات' },
    { path: '/our-services', text: 'خدماتنا' },
    { path: '/contact', text: 'اتصل بنا' }
  ];

  contactInfo = {
    email: 'info@ajyalalquran.com',
    phone: '+1 (123) 456-7890',
    address: '123 شارع الأعمال، المدينة، البلد'
  };

  /**
   * Scroll to a section when clicking a navigation link.
   * @param event - The click event from the navigation link.
   */
  scrollTo(event: Event): void {
    event.preventDefault();
    const element = event.target as HTMLAnchorElement;
    const targetId = element.getAttribute('routerLink')?.replace('/', '');
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
