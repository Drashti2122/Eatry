import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyReportsService {

  constructor(private http: HttpClient) { }

  getDailyReport(topMost: number) {
    return this.http
      .get<any>(config.url + 'api/v1/reports/' + topMost)
      .pipe(catchError(this.handleError));
  }

  topMostItem(topMost: number) {
    return this.http
      .get<any>(config.url + 'api/v1/reports/topMost/' + topMost)
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
