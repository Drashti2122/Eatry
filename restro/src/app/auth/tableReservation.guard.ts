import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TableReservationGaurd implements CanActivate {
    constructor(private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean | UrlTree> | Promise<boolean> {
        let getUserRole = JSON.parse(localStorage.getItem('role') as string);
        //console.log(getUserRole)

        if (getUserRole == 'User') {
            return true;

        } else {
            if (getUserRole == 'otpUser') {
                return this.router.navigate(['/otp'])
            }
            return this.router.navigate(['/home'])
        }
    }
}