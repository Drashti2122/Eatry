import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient, private route: Router) { }

  searchFilter(filterObj: any) {
    return this.http
      .get<any>(config.url + 'api/v1/filter/getFilterData/' + filterObj)
      .pipe(catchError(this.handleError));
  }

  likesFilter(filterObj: any) {
    return this.http
      .get<any>(config.url + 'api/v1/like/getFilterData/' + filterObj)
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
