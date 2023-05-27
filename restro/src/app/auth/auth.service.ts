import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './user.model';
import { OtpUser } from './otpUser.model';
import { ToastrService } from 'ngx-toastr';
import { config } from "../shared/config";
import { MyResponse } from '../shared/interface/responseData.interface';
import { userData } from '../shared/interface/user.interface';
import { otpUserData } from '../shared/interface/otpUser.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | any>(null);
  otpUser = new BehaviorSubject<OtpUser | any>(null);
  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) {
  }

  register(formData: object) {
    return this.http.post<MyResponse<userData>>(config.url + 'api/v1/user/signUp', formData
    ).pipe(catchError(this.handleError))
  }

  login(formData: object) {
    return this.http.post<MyResponse<userData>>(config.url + 'api/v1/user/signIn', formData
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.token);
    }));
  }

  forgot(formData: object) {
    return this.http.post<MyResponse>(config.url + 'api/v1/user/forgotPassword', formData
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.token);
    }));
  }

  reset(formData: object) {
    let userData = JSON.parse(localStorage.getItem('userData') as string);
    let token = userData.token;
    // //console.log(formData.get("userEmail"))
    return this.http.patch<MyResponse>(config.url + `api/v1/user/resetPassword/${token}`, formData
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.token);
    }));
  }

  sendEmailForOtp(formData: object) {
    return this.http.post<MyResponse<userData>>(config.url + `api/v1/otpUser/sendEmail`, formData
    ).pipe(catchError(this.handleError));
  }

  getOtpUser(formData: object | any) {
    let params = new HttpParams();
    for (let key in formData) {
      if (formData.hasOwnProperty(key)) {
        //console.log(key, formData[key])
        params = params.append(key, formData[key]);
      }
    }
    // //console.log("params" + params)
    return this.http.post<MyResponse>(config.url + `api/v1/otpUser/getOtpUsers`, formData
    ).pipe(catchError(this.handleError), tap(resData => {
      let data = resData.data;
      // //console.log(resData.otp);
      this.handleOtpAuthentication(data[0].otp)
    }));
  }

  private handleOtpAuthentication(otp: string) {
    //console.log(otp)
    let otpuser = new OtpUser(otp);
    if (!otpuser.otp) {
      let otp = JSON.parse(localStorage.getItem('otp') as string);
      otpuser.otp = otp;
    }
    this.otpUser.next(otpuser);
  }

  otpMatch(otp: string) {
    return this.http.post<MyResponse<otpUserData>>(config.url + `api/v1/otpUser/matchOTP`, { otp }
    ).pipe(catchError(this.handleError));
  }

  getCurrentUser() {
    return this.http.get<MyResponse<otpUserData>>(config.url + `api/v1/otpUser/getCurrentUser`
    ).pipe(catchError(this.handleError));
  }

  private handleAuthentication(userId: string, token: string) {
    let user = new User(userId, token)
    if (!user.userId) {
      let users = JSON.parse(localStorage.getItem('userData') as string);
      user.userId = users.userId
      user.token = users.token
    }

    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error.message) {
      return throwError(JSON.stringify(errorRes.error.message))
    } else {
      return throwError('An Unknown error occurred!')
    }
  }
}
