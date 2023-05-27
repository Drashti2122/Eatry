import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { CategoryComponent } from "./category/category.component";
import { SubCategoryComponent } from "./sub-category/sub-category.component";
import { ItemComponent } from "./item/item.component";
import { TableReservationComponent } from "./table-reservation/table-reservation.component";
import { TableComponent } from "./table/table.component";
import { OrderComponent } from "./order/order.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { TableStatusComponent } from "./table-status/table-status.component";
import { BillComponent } from "./bill/bill.component";
import { DashPanelComponent } from "./dash-panel/dash-panel.component";
import { NotificationComponent } from "./notification/notification.component";
import { UsersComponent } from "./users/users.component";
import { DailyReportsComponent } from "./daily-reports/daily-reports.component";
import { MostOrderComponent } from "./most-order/most-order.component";
import { PageNotFoundComponent } from "../auth/page-not-found/page-not-found.component";
import { LikeComponent } from "./like/like.component";

// path: '', component: DashboardComponent, canActivate: [AuthGaurd], children: [
const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'category', component: CategoryComponent },
      { path: 'subCategory', component: SubCategoryComponent },
      { path: 'item', component: ItemComponent },
      { path: 'table', component: TableComponent },
      { path: 'tableReservation', component: TableReservationComponent },
      { path: 'order', component: OrderComponent },
      { path: 'pendingOrders', component: OrderComponent },
      { path: 'completedOrders', component: OrderComponent },
      { path: 'totalOrders', component: OrderComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'tableStatus', component: TableStatusComponent },
      { path: 'billStatus', component: BillComponent },
      { path: 'dashboard', component: DashPanelComponent },
      { path: 'manageUsers', component: UsersComponent },
      { path: 'notification', component: NotificationComponent },
      { path: 'dailyReports', component: DailyReportsComponent },
      { path: 'mostOrder', component: MostOrderComponent },
      { path: 'likes', component: LikeComponent },
      // { path: '**', component: PageNotFoundComponent }
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
