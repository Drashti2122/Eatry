import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { config } from '../../config';
import { catchError, throwError } from 'rxjs';
import { MyResponse } from '../../interface/responseData.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }

  getBestSeller() {
    return this.http.get<MyResponse>(config.url + `api/v1/reports`
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
