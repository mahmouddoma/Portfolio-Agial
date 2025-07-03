import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(private router: Router) { }

  /**
   * Scroll to a section when clicking a navigation link.
   * @param event - The click event from the navigation link.
   */
  scrollTo(event: Event) {
    event.preventDefault();
    const targetPath = (event.target as HTMLAnchorElement).getAttribute('routerLink');
    if (targetPath) {
      const targetElementId = targetPath.replace('/', ''); // Remove leading '/'
      const targetElement = document.getElementById(targetElementId); // Find the section by ID
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.router.navigate([], { fragment: targetElementId }); // Update the URL fragment
      }
    }
  }
}
