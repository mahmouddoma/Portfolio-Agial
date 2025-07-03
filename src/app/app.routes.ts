import { Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FeatureComponent } from './components/feature/feature.component';
import { OurServicesComponent } from './components/our-services/our-services.component';
import { ContactComponent } from './components/contact/contact.component';
import { PackagesComponent } from './components/packages/packages.component';

export const routes: Routes = [
  { path: 'about', component: AboutUsComponent },
  { path: 'features', component: FeatureComponent },
  { path: 'our-services', component: OurServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'packages', component: PackagesComponent },
];
