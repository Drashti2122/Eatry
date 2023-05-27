import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { config } from '../../config';
import { catchError, throwError } from "rxjs";
import { MyResponse } from '../../interface/responseData.interface';
import { subCategoryData } from '../../interface/subCategoryData.interface';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  constructor(private http: HttpClient, private route: Router) {}

  // About Subcategory
  addSubCategory(formData:object|any) {
   const subCategoryName = formData.get("subCategoryName")
   const categoryId = formData.get("categoryId")
   return this.http.post<MyResponse>(config.url + 'api/v1/subCategory', { subCategoryName, categoryId }
   ).pipe(catchError(this.handleError))
 }

 getSubCategory() {
   return this.http.get<MyResponse>(config.url + 'api/v1/subCategory'
   ).pipe(catchError(this.handleError))
 }

 delSubCategory(id: number) {
   console.log(id)
   return this.http.delete<MyResponse>(config.url + 'api/v1/subCategory/' + id
   ).pipe(catchError(this.handleError))
 }

 editSubCategory(id: number) {
   return this.http.get<MyResponse>(config.url + 'api/v1/subCategory/' + id
   ).pipe(catchError(this.handleError))
 }

 updateSubCategory(id: number, subCategoryName: string, categoryId: number) {
   console.log(id)
   // console.log(localStorage.getItem('adminData'))
   console.log("inside update")
   return this.http.patch<MyResponse<subCategoryData>>(config.url + 'api/v1/subCategory/' + id, { subCategoryName, categoryId }
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
