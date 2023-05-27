import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurd } from './auth/auth.gaurd';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';

// const routes: Routes = [];
const Approutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule)
  },
  {
    canActivate: [AuthGaurd],
    path: "dashboard",
    loadChildren: () => import("./dashboard/dashboard.module").then(m => m.dashboardModule)
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(Approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
