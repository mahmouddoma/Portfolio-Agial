import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  imports: [CommonModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})
export class BackToTopComponent {
  showButton: boolean = false;

  // Listen for the window's scroll event
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if the scroll position is greater than 100vh
    this.showButton = window.scrollY > window.innerHeight;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
