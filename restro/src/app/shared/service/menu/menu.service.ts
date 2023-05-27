import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { config } from '../../config'
import { MyResponse } from '../../interface/responseData.interface';
import { itemData } from '../../interface/item.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }
  getItem() {
    return this.http.get<MyResponse>(config.url + 'api/v1/item/getItems'
    ).pipe(catchError(this.handleError))
  }

  orderPlace(formData: object) {
    return this.http.post<MyResponse>(config.url + 'api/v1/order', formData).pipe(
      catchError(this.handleError)
    );
  }

  getAllOrders() {
    return this.http.get<MyResponse>(config.url + `api/v1/order/getOrderUser`
    ).pipe(catchError(this.handleError));
  }

  like(itemId: Number) {
    return this.http.post<MyResponse>(config.url + `api/v1/like`, { itemId }
    ).pipe(catchError(this.handleError));
  }

  chkOrder() {
    return this.http.get<MyResponse>(config.url + `api/v1/order/chkOrder`
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
