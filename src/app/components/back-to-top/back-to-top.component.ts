import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { BACK_TO_TOP_CONTENT } from '../../data/site-content';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})
export class BackToTopComponent {
  private readonly language = inject(LanguageService);

  readonly showButton = signal(false);
  readonly backToTopAria = computed(() => this.language.text(BACK_TO_TOP_CONTENT.backToTopAria));
  readonly whatsappAria = computed(() => this.language.text(BACK_TO_TOP_CONTENT.whatsappAria));

  // Listen for the window's scroll event
  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Check if the scroll position is greater than 100vh
    this.showButton.set(window.scrollY > window.innerHeight);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
