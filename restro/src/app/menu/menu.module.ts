import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../core.module';
// import { CoreModule } from '../core.module';


@NgModule({
  declarations: [
    MenuComponent,
    // OrdersComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MenuRoutingModule,
    ToastrModule.forRoot(),
    CoreModule            
  ],
  providers: []
})
export class MenuModule {

}
