import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MyResponse } from 'src/app/shared/interface/responseData.interface';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent {
  errorMsg!: string;
  constructor(private authService: AuthService, private toastr: ToastrService) { }

  resetForm = new FormGroup({
    resetPassword: new FormControl('', Validators.required),
    resetCPassword: new FormControl('', Validators.required)
  });

  //validation
  get resetPassword(): string | any {
    return this.resetForm.get('resetPassword');
  }

  get resetCPassword(): string | any {
    return this.resetForm.get('resetCPassword');
  }

  onReset() {
    //console.log(this.resetForm.value)
    let formData = new FormData();

    let authObs!: Observable<MyResponse>;
    let userData = JSON.parse(localStorage.getItem('userData') as string);
    if (!userData) {
      this.toastr.error("somthing wrong!please try again");
    } else {
      authObs = this.authService.reset(formData)

      authObs.subscribe(resData => {
        this.toastr.success(resData.message);
        // this.router.navigate(['/dashboard']);
      }, error => {
        this.errorMsg = error;
        this.toastr.error(this.errorMsg);
      })
    }
    this.resetForm.reset();
  }
}
