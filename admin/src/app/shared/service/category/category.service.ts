import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { Subject, catchError } from 'rxjs';
import { config } from '../../config';
import { MyResponse } from '../../interface/responseData.interface';
import { categoryData } from '../../interface/categoryData.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient, private route: Router) { }

  addCategory(categoryName: string) {
    // console.log(localStorage.getItem('adminData'))
    console.log('inside save');
    return this.http
      .post<MyResponse>(config.url + 'api/v1/category', { categoryName })
      .pipe(catchError(this.handleError));
  }

  updateCategory(id: number, categoryName: string) {
    console.log(id);
    // console.log(localStorage.getItem('adminData'))
    console.log('inside update');
    return this.http
      .patch<MyResponse>(config.url + 'api/v1/category/' + id, { categoryName })
      .pipe(catchError(this.handleError));
  }

  getCategorys() {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/category')
      .pipe(catchError(this.handleError));
  }

  delCategory(id: number) {
    return this.http
      .delete<MyResponse>(config.url + 'api/v1/category/' + id)
      .pipe(catchError(this.handleError));
  }

  editCategory(id: number) {
    return this.http
      .get<MyResponse<categoryData>>(config.url + 'api/v1/category/' + id)
      .pipe(catchError(this.handleError));
  }

  totalCategoryData() {
    return this.http
      .get<MyResponse>(config.url + 'api/v1/category/totalCategoryData')
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
