import { AuthService } from './auth.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthGaurd implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean | UrlTree> | Promise<boolean> {
        let adminData = JSON.parse(localStorage.getItem('userData') as string);
        if (adminData) {
            return true;
        } else {
            return this.router.navigate(['/home'])
        }
    }
}