import { AuthService } from './../../auth/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';
import { adminData } from 'src/app/shared/interface/adminData.iterface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  p = 0;
  errorMsg!: string;
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  })

  onchangePassword() {
    //console.log(this.changePasswordForm.value)
    const postData: any = this.changePasswordForm.value;
    const formData = new FormData();

    // //console.log(this.itemForm.value)
    formData.append('currentPassword', postData.currentPassword);
    formData.append('newPassword', postData.newPassword);
    formData.append('confirmPassword', postData.confirmPassword);

    let authObs!: Observable<MyResponse<adminData>>;
    authObs = this.authService.changePassword(formData)
    authObs.subscribe(resData => {
      this.toastr.success(resData?.message);
      // this.getAllCategory();
    }, error => {
      //console.log(error)
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}
