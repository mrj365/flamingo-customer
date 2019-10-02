import { Injectable } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
/**
 * Users that are logged in should not be able to access the login and register pages
 */
@Injectable()
export class CanActivateAlreadyLoggedIn {
    constructor(private router: Router, private authService: AuthenticationService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let userAuthenticated = false;

        if (this.authService.isUserLoggedIn()) {
             //  logged in so redirect to locations page with the return url and return false
            this.router.navigate(['/locations']);
        } else {
           return true;
        }
    }
}