import { AuthService } from './../auth/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MyResponse } from '../shared/interface/responseData.interface';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  errorMsg!: string;
  key!: string | Blob; // Blob (Binary Large Object) is a data type used to store binary data, such as images, audio files, or other large chunks of data
  table!: string | Blob;
  tableId!: string;

  constructor(private authService: AuthService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.key = params['key'];
      this.table = params['table'];
      //console.log(this.key, this.table)
    });
    this.getOtpUser()
  }

  getOtpUser() {
    let formData = new FormData();
    formData.append("tableKey", this.key);
    formData.append("tableNo", this.table);
    //console.log("getOtpUser")
    //console.log(this.key, this.table)
    let authObs!: Observable<MyResponse>;
    authObs = this.authService.getOtpUser(formData)

    authObs.subscribe(resData => {
      // this.toastr.success(resData.message);
      this.router.navigate(['/otp']);

      // this.getOtpUser.next()
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }

  //email
  emailOtpForm = new FormGroup({
    otpEmail: new FormControl('', Validators.required)
  });

  onEmailOtp() {

    //console.log(this.emailOtpForm.value);
    let postData: any = this.emailOtpForm.value;
    let formData = new FormData();

    formData.append("otpEmail", postData.otpEmail);
    formData.append("tableKey", this.key);
    formData.append("tableNo", this.table);

    //console.log(this.tableId)

    let authObs!: Observable<MyResponse>;
    authObs = this.authService.sendEmailForOtp(formData)

    authObs.subscribe(resData => {
      // this.toastr.success(resData.message);
      this.getOtpUser()
      this.router.navigate(['/otp']);
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
    this.emailOtpForm.reset();
  }
}
