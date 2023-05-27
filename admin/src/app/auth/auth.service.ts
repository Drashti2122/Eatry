import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { User } from './user.model';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { config } from '../shared/config';
import { MyResponse } from '../shared/interface/responseData.interface';
import { adminData } from '../shared/interface/adminData.iterface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  message = null;

  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }

  login(email: string, password: string) {
    // //console.log(email, password)
    return this.http.post<MyResponse<adminData>>(config.url + 'api/v1/admin', { email, password }
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.token);
    }));
  }

  forgot(email: string) {
    return this.http.post<MyResponse<adminData>>(config.url + 'api/v1/admin/forgotPassword', { email }
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.token);
    }));
  }

  resetPass(password: string, confirmPassword: string) {
    const adminData = JSON.parse(localStorage.getItem('adminData') as string);
    const token = adminData.token;
    // //console.log(token);
    return this.http.patch<MyResponse<adminData>>(config.url + `api/v1/admin/resetPassword/${token}`, { password, passwordConfirm: confirmPassword }
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.token);
    }));
  }

  changePassword(formData: Object) {
    // //console.log(formData.get("currentPassword"))
    return this.http.patch<MyResponse<adminData>>(config.url + 'api/v1/admin/changePassword', formData
    ).pipe(catchError(this.handleError), tap(resData => {
      this.handleAuthentication(resData.email, resData.token);
    }));
  }

  getToken() {
    return localStorage.getItem('adminData')
  }

  removeToken() {
    return localStorage.removeItem('adminData');
  }

  getAdmin() {
    const users = JSON.parse(localStorage.getItem('adminData') as string);
    return this.http.get<MyResponse<adminData>>(config.url + 'api/v1/admin/' + users.adminId,
    ).pipe(catchError(this.handleError));
  }

  logout() {
    localStorage.removeItem('adminData');
    this.route.navigate(['/auth']);
  }

  private handleAuthentication(adminId: string, token: string) {
    const user = new User(adminId, token)
    if (!user.adminId) {
      const users = JSON.parse(localStorage.getItem('adminData') as string);
      user.adminId = users.adminId
      user.token = users.token
    }

    this.user.next(user);
    localStorage.setItem('adminData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error.message) {
      return throwError(JSON.stringify(errorRes.error.message))
    } else {
      return throwError('An Unknown error occurred!')
    }
  }
}
