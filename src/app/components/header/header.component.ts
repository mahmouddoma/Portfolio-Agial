import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router) { }

  /**
   * Scroll to a section when clicking a navigation link.
   * @param event - The click event from the navigation link.
   */
  scrollTo(event: Event) {
    event.preventDefault();
    const targetPath = (event.target as HTMLAnchorElement).getAttribute('routerLink');
    if (targetPath) {
      const targetElementId = targetPath.replace('/', '');
      const targetElement = document.getElementById(targetElementId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.router.navigate([], { fragment: targetElementId });
      }
    }
  }
}
