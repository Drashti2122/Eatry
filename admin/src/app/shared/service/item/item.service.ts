import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { config } from '../../config';
import { catchError, throwError } from 'rxjs';
import { itemData } from '../../interface/itemData.interface';
import { MyResponse } from '../../interface/responseData.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient, private route: Router) {}

  //About Item

  getItem() {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/item')
      .pipe(catchError(this.handleError));
  }

  editItem(id: number) {
    return this.http
      .get<MyResponse<itemData>>(config.url + 'api/v1/item/' + id)
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
