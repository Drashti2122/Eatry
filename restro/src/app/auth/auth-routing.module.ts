import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ForgotComponent } from "./forgot/forgot.component";
import { ResetComponent } from "./reset/reset.component";

const routes: Routes = [
  { path: '', component: ForgotComponent },
  { path: 'reset', component: ResetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
