import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthService } from "./auth.service";

export const SENDOTP = 'snedot';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  request!: HttpRequest<any>;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let getUserRole = JSON.parse(localStorage.getItem('role') as string);
    let status = JSON.parse(localStorage.getItem('status') as string)
    //console.log(getUserRole)

    if (getUserRole && getUserRole == 'otpUser' && status == 'active') {
      let otpusers = JSON.parse(localStorage.getItem('otp') as string);
      if (!otpusers) {
        return next.handle(req);
      }
      let modifiedReq = req.clone({ params: new HttpParams().set('auth', otpusers).set('role', 'otpUser') })
      //console.log(modifiedReq)
      return next.handle(modifiedReq);
    }
    else if (getUserRole && getUserRole == 'User') {
      return this.authService.user.pipe(take(1), exhaustMap(user => {
        let users;
        if (!user) {
          users = JSON.parse(localStorage.getItem('userData') as string);
          if (!users) {
            return next.handle(req);
          }
          const modifiedReq = req.clone({ params: new HttpParams().set('auth', users.token).set('role', 'user') })
          return next.handle(modifiedReq);
        }
        const modifiedReq = req.clone({ params: new HttpParams().set('auth', user?.token).set('role', 'user') })
        return next.handle(modifiedReq);
      }));
    }
    else {
      return next.handle(req);
    }
  }
}
