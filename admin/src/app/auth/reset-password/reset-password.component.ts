import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastService } from 'angular-toastify';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { adminData } from 'src/app/shared/interface/adminData.iterface';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  errorMsg!: string;
  passwordMismatch!: string;

  constructor(private authService: AuthService, private toastr: ToastrService, private route: Router) { }
  resetForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required, this.matchValues('password')])
  });

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: string|any } | null => {
      const input = control.value;
      const isValid = control.root.value[matchTo] === input;
      return isValid ? null : { matchValues: { value: control.value } };
    };
  }

  //Validation methods for all form fields
  get password() {
    return this.resetForm.get('password');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  onReset() {
    // //console.log(this.resetForm.value)
    const postData: any = this.resetForm.value;
    //console.log(postData.password, postData.confirmPassword)

    const formData = new FormData();
    formData.append('password', postData.password);
    formData.append('confirmPassword', postData.confirmPassword);

    let authObs!: Observable<MyResponse<adminData>>;
    authObs = this.authService.resetPass(postData.password, postData.confirmPassword)

    authObs.subscribe(resData => {
      // //console.log(resData);
      this.route.navigate(['/auth']);
    }, error => {
      // //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
