import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { config } from '../../config';
import { Router } from '@angular/router';
import { MyResponse } from '../../interface/responseData.interface';
import { tableReservationData } from '../../interface/table-Reservation.interface';

@Injectable({
  providedIn: 'root',
})
export class TableReservationService {
  constructor(private http: HttpClient, private route: Router) { }

  //About table reservation
  getTableReservation() {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/tableReservation')
      .pipe(catchError(this.handleError));
  }

  getTableReservationByDate(searchDate: object) {
    // console.log(Date(searchDate))
    return this.http
      .get<MyResponse>(config.url + 'api/v1/tableReservation/' + searchDate)
      .pipe(catchError(this.handleError));
  }

  searchTable(search: object) {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/tableReservation/' + search)
      .pipe(catchError(this.handleError));
  }

  searchBoth(search: string) {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/tableReservation/searchFilter/' + search)
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
