import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { config } from '../../config';
import { Subject, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderExists = new Subject<boolean>();
  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }

  getAllOrders() {
    return this.http.get<any>(config.url + `api/v1/order/getOrderUser`
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
