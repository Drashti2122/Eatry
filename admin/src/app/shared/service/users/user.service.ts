import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MyResponse } from '../../interface/responseData.interface';
import { config } from '../../config';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private route: Router) { }
  getUser() {
    return this.http.get<MyResponse>(config.url + 'api/v1/user'
    ).pipe(catchError(this.handleError))
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error.message) {
      return throwError(JSON.stringify(errorRes.error.message));
    } else {
      return throwError('An Unknown error occurred!');
    }
  }
}
