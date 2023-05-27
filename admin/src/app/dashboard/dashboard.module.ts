import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { ItemComponent } from './item/item.component';
import { TableReservationComponent } from './table-reservation/table-reservation.component';
import { TableComponent } from './table/table.component';
import { OrderComponent } from './order/order.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TableStatusComponent } from './table-status/table-status.component';
import { BillComponent } from './bill/bill.component';
import { DashPanelComponent } from './dash-panel/dash-panel.component';
import { NotificationComponent } from './notification/notification.component';
import { UsersComponent } from './users/users.component';
import { ToastrModule } from 'ngx-toastr';
import { DailyReportsComponent } from './daily-reports/daily-reports.component';
import { MostOrderComponent } from './most-order/most-order.component';
import { LikeComponent } from './like/like.component';


@NgModule({
  declarations: [
    DashboardComponent,
    CategoryComponent,
    SubCategoryComponent,
    ItemComponent,
    TableComponent,
    TableReservationComponent,
    OrderComponent,
    ChangePasswordComponent,
    TableStatusComponent,
    BillComponent,
    DashPanelComponent,
    UsersComponent,
    NotificationComponent,
    DailyReportsComponent,
    MostOrderComponent,
    LikeComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatNativeDateModule,
    NgxPaginationModule,
    ToastrModule.forRoot(),
  ],
})

export class dashboardModule {

}
