import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminAuthGuard } from '../core/auth/admin-auth.guard';
import { AdminContentComponent } from './content/admin-content.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminLiveEditComponent } from './live-edit/admin-live-edit.component';
import { AdminLoginComponent } from './login/admin-login.component';
import { AdminMediaComponent } from './media/admin-media.component';
import { AdminShellComponent } from './shell/admin-shell.component';

const routes: Routes = [
  {
    path: 'login',
    component: AdminLoginComponent,
  },
  {
    path: '',
    component: AdminShellComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'content', component: AdminContentComponent },
      { path: 'media', component: AdminMediaComponent },
      { path: 'live-edit', component: AdminLiveEditComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
