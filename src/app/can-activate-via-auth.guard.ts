import { AuthenticationService } from './_services/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let userAuthenticated = false;

        if (this.authService.isUserLoggedIn()) {
            // logged in so return true
            userAuthenticated = true;
        } else {
            // not logged in so redirect to registration page with the return url and return false
            this.router.navigate(['/register'], { queryParams: { returnUrl: state.url }});
        }

        return userAuthenticated;
    }
}
