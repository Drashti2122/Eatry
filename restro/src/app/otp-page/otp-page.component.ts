import { AuthService } from 'src/app/auth/auth.service';
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { otpUserData } from '../shared/interface/otpUser.interface';
import { io } from 'socket.io-client';
import { MyResponse } from '../shared/interface/responseData.interface';

const SOCKET_ENDPOINT = 'http://localhost:5000';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.css']
})
export class OtpPageComponent {
  errorMsg!: string;
  currentUser!: otpUserData;
  socket: any;

  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router) {
    this.getOtpUser();
  }

  ngOnInit(): void {
    this.socket = io(SOCKET_ENDPOINT);
  }

  //otp
  otpForm = new FormGroup({
    otp1: new FormControl('', Validators.required),
    otp2: new FormControl('', Validators.required),
    otp3: new FormControl('', Validators.required),
    otp4: new FormControl('', Validators.required),
    otp5: new FormControl('', Validators.required),
    otp6: new FormControl('', Validators.required)
  });

  onOtp() {
    let otp = Object.values(this.otpForm.value).join('');
    // //console.log("OTP:" + otp)

    let authObs!: Observable<MyResponse>;
    authObs = this.authService.otpMatch(otp)

    authObs.subscribe(resData => {
      // this.toastr.success(resData?.message);
      let role = 'otpUser';
      localStorage.setItem('otp', JSON.stringify(resData.otpToken));
      localStorage.setItem('role', JSON.stringify(role));
      localStorage.setItem('status', JSON.stringify(resData.userStatus));
      this.router.navigateByUrl('/refresh', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/home']);
      });
      // this.router.navigate(['/home']);
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
    this.otpForm.reset();
  }

  getOtpUser() {
    let authObs!: Observable<MyResponse>;
    authObs = this.authService.getCurrentUser()

    authObs.subscribe(resData => {
      // this.toastr.success(resData?.message);
      this.currentUser = resData?.data;
    }, error => {
      this.errorMsg = error;
      this.toastr.error(this.errorMsg);
    })
  }
}