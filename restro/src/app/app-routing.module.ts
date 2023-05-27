import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OtpPageComponent } from './otp-page/otp-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AuthGaurd } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'welcome-page', component: WelcomePageComponent },
  { path: 'otp', component: OtpPageComponent },
  {
    path: 'home',
    loadChildren: () => import("./home/home.module").then(m => m.HomeModule)
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
