import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { config } from "../../config";
import { catchError, throwError } from 'rxjs';
import { MyResponse } from '../../interface/responseData.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }

  payme(token: object) {
    return this.http.post<MyResponse>(config.url + 'api/v1/payment', token).pipe(
      catchError(this.handleError)
    );
  }

  payme_table(token: object) {
    return this.http.post<MyResponse>(config.url + 'api/v1/payment/payTable', token).pipe(
      catchError(this.handleError)
    );
  }

  refundTable(id: number) {
    return this.http.post<MyResponse>(config.url + 'api/v1/payment/refundTable', { id }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error.message) {
      return throwError(JSON.stringify(errorRes.error.message))
    } else {
      return throwError('An Unknown error occurred!')
    }
  }
}
