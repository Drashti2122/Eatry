import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {
  errorMsg!: string;
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  forgotForm = new FormGroup({
    forgotEmail: new FormControl('', Validators.required)
  });

  //validation
  get forgotEmail() {
    return this.forgotForm.get('forgotEmail');
  }

  onForgot() {
    //console.log(this.forgotForm.value)
    let postData: any = this.forgotForm.value;
    let formData = new FormData();

    //validation
    if (!postData.forgotEmail) {
      this.toastr.error("email is required");
    } else {
      formData.append("userEmail", postData.forgotEmail)

      let authObs!: Observable<MyResponse>;
      authObs = this.authService.forgot(formData)

      authObs.subscribe(resData => {
        this.toastr.success(resData.message);
        // this.router.navigate(['/dashboard']);
      }, error => {
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
      this.forgotForm.reset();
    }

  }
}
