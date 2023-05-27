import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }

  billPlaced(formData: any) {
    return this.http.post<any>(config.url + `api/v1/bill`, formData
    ).pipe(catchError(this.handleError));
  }

  chkCheckout() {
    return this.http.get<any>(config.url + `api/v1/bill/getStatus`
    ).pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error.message) {
      return throwError(JSON.stringify(errorRes.error.message))
    } else {
      return throwError('An Unknown error occurred!')
    }
  }
}
