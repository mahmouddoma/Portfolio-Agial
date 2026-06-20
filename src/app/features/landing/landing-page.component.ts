import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AboutUsComponent } from '../../components/about-us/about-us.component';
import { BackToTopComponent } from '../../components/back-to-top/back-to-top.component';
import { ContactComponent } from '../../components/contact/contact.component';
import { FeatureComponent } from '../../components/feature/feature.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { OurServicesComponent } from '../../components/our-services/our-services.component';
import { PackagesComponent } from '../../components/packages/packages.component';
import { StudentJourneyComponent } from '../../components/student-journey/student-journey.component';
import { InViewportDirective } from '../../directives/directives/in-viewport.directive';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    AboutUsComponent,
    BackToTopComponent,
    ContactComponent,
    FeatureComponent,
    FooterComponent,
    HeaderComponent,
    OurServicesComponent,
    PackagesComponent,
    StudentJourneyComponent,
    InViewportDirective,
  ],
  templateUrl: './landing-page.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingPageComponent {}
