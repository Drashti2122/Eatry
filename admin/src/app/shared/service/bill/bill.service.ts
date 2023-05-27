import { Injectable } from '@angular/core';
import { MyResponse } from '../../interface/responseData.interface';
import { config } from '../../config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  constructor(private http: HttpClient, private route: Router) { }

  getBill() {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/bill')
      .pipe(catchError(this.handleError));
  }

  updateBillStatus(id: number) {
    return this.http
      .patch<MyResponse>(config.url + 'api/v1/bill/updateBillStatus', { id })
      .pipe(catchError(this.handleError));
  }

  searchFilter(filterObj: string) {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/bill/searchfilter/' + filterObj)
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
