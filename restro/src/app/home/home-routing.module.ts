import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { MainComponent } from './main/main.component';
import { BookReservationComponent } from '../book-reservation/book-reservation.component';
import { AboutComponent } from '../about/about.component';
import { TableReservationGaurd } from '../auth/tableReservation.guard';

const routes: Routes = [
    {
        path: '', component: HomeComponent,
        children: [
            {
                path: '', // child route path
                component: MainComponent // child route component that the router renders
            },
            {
                path: 'forgot',
                loadChildren: () => import("../auth/auth.module").then(m => m.AuthModule),
            },
            {
                path: 'menu',
                loadChildren: () => import("../menu/menu.module").then(m => m.MenuModule)
            },
            {
                path: 'orders',
                loadChildren: () => import("../orders/order.module").then(m => m.OrderModule)
            },
            { path: 'about', component: AboutComponent },
            { canActivate: [TableReservationGaurd], path: 'book-table', component: BookReservationComponent },

        ],
    },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
