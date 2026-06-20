import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PortfolioLogoIconComponent } from '../components/portfolio-logo-icon/portfolio-logo-icon.component';
import { LandingPageComponent } from '../features/landing/landing-page.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminContentComponent } from './content/admin-content.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminLiveEditComponent } from './live-edit/admin-live-edit.component';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminMediaComponent } from './media/admin-media.component';
import { AdminShellComponent } from './shell/admin-shell.component';

@NgModule({
  declarations: [
    AdminContentComponent,
    AdminDashboardComponent,
    AdminLiveEditComponent,
    AdminLoginComponent,
    AdminMediaComponent,
    AdminShellComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LandingPageComponent,
    PortfolioLogoIconComponent,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
