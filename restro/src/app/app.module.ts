import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { OtpPageComponent } from './otp-page/otp-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { CoreModule } from './core.module';
import { StripeModule } from 'stripe-angular';
// import { NgxStripeModule } from 'ngx-stripe';
@NgModule({
  declarations: [
    AppComponent,
    // BookReservationComponent,
    OtpPageComponent,
    WelcomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({ progressBar: true, progressAnimation: 'increasing', countDuplicates: true, closeButton: true }),
    BrowserAnimationsModule,
    CoreModule,
    StripeModule.forRoot('pk_test_51N7E9TSHeifmC4qm0nsnBKaknOaygWyFCMmVf9lrKj1IygJXU5jHndd4QmabGqchbY3Rr81oIsXHafKemco3efAr000qpZs6bP')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
