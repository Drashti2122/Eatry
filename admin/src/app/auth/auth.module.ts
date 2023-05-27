import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [AuthComponent, RegistrationComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {

}
