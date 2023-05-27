import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { CoreModule } from '../core.module';
import { ToastrModule } from 'ngx-toastr';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { BookReservationComponent } from '../book-reservation/book-reservation.component';
import { AboutComponent } from '../about/about.component';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        MainComponent,
        BookReservationComponent,
        AboutComponent
    ],
    imports: [
        HomeRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        CoreModule
    ],
    providers: [],
    bootstrap: []
})
export class HomeModule { }
