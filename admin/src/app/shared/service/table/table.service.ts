import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { config } from '../../config';
import { MyResponse } from '../../interface/responseData.interface';
import { tableData } from '../../interface/table.interface';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(private http: HttpClient, private route: Router) {}


  //About table
  addTable(formData: object) {
    return this.http.post<MyResponse>(config.url + 'api/v1/table', formData
    ).pipe(catchError(this.handleError))
  }

  getTable() {
    return this.http.get<MyResponse>(config.url + 'api/v1/table'
    ).pipe(catchError(this.handleError))
  }

  delTable(id: number) {
    // console.log(id)
    return this.http.delete<MyResponse>(config.url + 'api/v1/table/' + id
    ).pipe(catchError(this.handleError))
  }

  editTable(id: number) {
    return this.http.get<MyResponse<tableData>>(config.url + 'api/v1/table/' + id
    ).pipe(catchError(this.handleError))
  }

  editTableStatus(id: number) {
    return this.http.get<MyResponse<tableData>>(config.url + 'api/v1/table/editTableStatus/' + id
    ).pipe(catchError(this.handleError))
  }

  updateTable(id: number, formData: object) {
    return this.http.patch<MyResponse<tableData>>(config.url + 'api/v1/table/' + id, formData
    ).pipe(catchError(this.handleError))
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error.message) {
      return throwError(JSON.stringify(errorRes.error.message));
    } else {
      return throwError('An Unknown error occurred!');
    }
  }
}
