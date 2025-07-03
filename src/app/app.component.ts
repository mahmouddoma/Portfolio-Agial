import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { HeaderComponent } from './components/header/header.component';
import { FeatureComponent } from './components/feature/feature.component';
import { OurServicesComponent } from './components/our-services/our-services.component';
import { ContactComponent } from './components/contact/contact.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { PackagesComponent } from './components/packages/packages.component';

@Component({
  selector: 'app-root',
  imports: [
    FooterComponent,
    AboutUsComponent,
    HeaderComponent,
    FeatureComponent,
    ContactComponent,
    OurServicesComponent,
    ContactComponent,
    BackToTopComponent,
    PackagesComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppComponent {
  title = 'project-landing';
}
