import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { CoreModule } from '../core.module';
@NgModule({
  declarations: [ForgotComponent, ResetComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    HttpClientModule,
    CoreModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: []
})
export class AuthModule {

}
