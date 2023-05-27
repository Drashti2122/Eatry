import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { adminData } from 'src/app/shared/interface/adminData.iterface';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  errorMsg!: string;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  forgotForm = new FormGroup({
    emailForgot: new FormControl('', Validators.required)
  })

  // Validation methods for all form fields
  get emailForgot() {
    return this.forgotForm.get('emailForgot');
  }


  onForgot() {
    // debugger;
    // //console.log(this.forgotForm.value)
    const postData: any = this.forgotForm.value;
    //console.log(postData.emailForgot)
    let authObs: Observable<MyResponse<adminData>>
    authObs = this.authService.forgot(postData.emailForgot)

    authObs.subscribe((resData: MyResponse) => {
      this.toastr.success(resData.message);
      //console.log(resData.token)
    }, (error: string) => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
