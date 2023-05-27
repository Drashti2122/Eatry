import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MyResponse } from '../../interface/responseData.interface';
import { config } from '../../config';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotification() {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/notification/')
      .pipe(catchError(this.handleError));
  }

  getNotificationWithDetails() {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/notification/notificationDetails')
      .pipe(catchError(this.handleError));
  }

  delNotification(id: number) {
    return this.http
      .delete<MyResponse>(config.url + 'api/v1/notification/' + id)
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
