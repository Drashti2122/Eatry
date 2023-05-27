import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subject, catchError, throwError } from "rxjs";
import { config } from "./shared/config";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    orderExists = new Subject<boolean>();
    userExists = new Subject<boolean>();
    constructor(private http: HttpClient, private route: Router, private toastr: ToastrService) { }

    private handleError(errorRes: HttpErrorResponse) {
        if (errorRes.error.message) {
            return throwError(JSON.stringify(errorRes.error.message))
        } else {
            return throwError('An Unknown error occurred!')
        }
    }
}