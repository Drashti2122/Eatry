import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { config } from '../../config';
import { ToastrService } from 'ngx-toastr';
import { MyResponse } from '../../interface/responseData.interface';
import { tableReservationData } from '../../interface/bookReservation.interface';

@Injectable({
  providedIn: 'root'
})
export class BookReservationService {

  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }

  bookReservation(formData: object) {
    return this.http.post<MyResponse<tableReservationData>>(config.url + `api/v1/tableReservation`, formData
    ).pipe(catchError(this.handleError));
  }

  getBookReservation() {
    return this.http.get<MyResponse>(config.url + `api/v1/tableReservation/getTableByUser`
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
