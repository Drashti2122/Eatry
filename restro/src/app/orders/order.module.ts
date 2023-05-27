import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { OrderRoutingModule } from './order-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { OrderComponent } from './order/order.component';

@NgModule({
    declarations: [
        OrderComponent
    ],
    imports: [
        OrderRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        ToastrModule.forRoot(),
    ],
    providers: []
})
export class OrderModule { }
