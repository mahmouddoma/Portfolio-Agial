import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SiteContentFacade } from '../../core/content/site-content.facade';
import { EditableContentDirective } from '../../core/live-edit/editable-content.directive';
import { LanguageService } from '../../services/language.service';
import { PortfolioLogoIconComponent } from '../portfolio-logo-icon/portfolio-logo-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, PortfolioLogoIconComponent, EditableContentDirective],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly siteContent = inject(SiteContentFacade);

  currentYear = new Date().getFullYear();
  readonly footerContent = computed(() => this.siteContent.content().footer);
  readonly headerContent = computed(() => this.siteContent.content().header);
  readonly logoSrc = computed(() => this.headerContent().logoSrc || '/assets/images/Logo.jpg');
  readonly companyName    = computed(() => this.language.text(this.footerContent().companyName));
  readonly companyLogoAlt = computed(() => this.language.text(this.footerContent().companyLogoAlt));
  readonly content = computed(() => ({
    quickLinksTitle: this.language.text(this.footerContent().quickLinksTitle),
    contactTitle:    this.language.text(this.footerContent().contactTitle),
    followTitle:     this.language.text(this.footerContent().followTitle),
    emailLabel:      this.language.text(this.footerContent().emailLabel),
    phoneLabel:      this.language.text(this.footerContent().phoneLabel),
    addressLabel:    this.language.text(this.footerContent().addressLabel),
    address:         this.language.text(this.footerContent().address),
    rights:          this.language.text(this.footerContent().rights),
  }));

  readonly socialLinks = computed(() => this.footerContent().socialLinks);

  readonly quickLinks = computed(() =>
    this.siteContent.content().nav.map((item: any) => ({
      id:   item.id,
      text: this.language.text(item.label),
    })),
  );

  readonly contactInfo = computed(() => this.footerContent().contactInfo);

  scrollTo(event: Event, sectionId: string): void {
    event.preventDefault();
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      void this.router.navigate([], { fragment: sectionId });
    }
  }
}
