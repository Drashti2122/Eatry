import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
// regular style toast
import { ToastrService } from 'ngx-toastr';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { adminData } from 'src/app/shared/interface/adminData.iterface';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  errorMsg!: string;
  constructor(private authService: AuthService, private toastr: ToastrService, private route: Router) {}

  loginForm = new FormGroup({
    loginEmail: new FormControl('', Validators.required),
    loginPassword: new FormControl('', Validators.required)
  })

  // Validation methods for all form fields
  get loginEmail() {
    return this.loginForm.get('loginEmail');
  }

  get loginPassword() {
    return this.loginForm.get('loginPassword');
  }

  onLogin() {
    //console.log(this.loginForm.value)
    const postData: any = this.loginForm.value;

    let authObs!: Observable<MyResponse<adminData>>;
    authObs = this.authService.login(postData.loginEmail, postData.loginPassword)

    authObs.subscribe(resData => {
      //console.log("hii")
      this.route.navigate(['/dashboard']);
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
