import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { config } from '../../config';
import { MyResponse } from '../../interface/responseData.interface';
import { orderData } from '../../interface/orderData.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) { }

  //About order
  getOrder(status: String) {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/order/' + status)
      .pipe(catchError(this.handleError));
  }

  updateStatus(id: number) {
    return this.http
      .patch<MyResponse<orderData>>(config.url + 'api/v1/order/' + id, {})
      .pipe(catchError(this.handleError));
  }

  searchFilter(filterObj: string) {
    return this.http
      .get<any>(config.url + 'api/v1/order/searchFilter/' + filterObj)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error.message) {
      return throwError(JSON.stringify(errorRes.error.message));
    } else {
      return throwError('An Unknown error occurred!');
    }
  }
}
