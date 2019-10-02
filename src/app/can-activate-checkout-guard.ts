import { environment } from 'environments/environment';
import { ShoppingCartService } from './_services/shopping-cart.service';
import { AuthenticationService } from './_services/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class CanActivateCheckoutGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService,
    private shoppingCartService: ShoppingCartService) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let userAuthenticated = false;

        if(!this.authService.isUserLoggedIn()) { // If the use ris not logged in, take them to the locations screen
            this.router.navigate(['/login']);
            return false;
        } else if ((this.hasNoServices() && !environment.pickupProfile) || this.hasServicesAndNoStartTime()) { // If the user has no services they will need to go back to the locations screen
            this.router.navigate(['/shopping-cart']);
            return false;
        } else {
            return true;
        }
    }

    /**
     * If the user has no services they will need to go back to the locations screen
     */
    hasNoServices() {
        let hasNoServices = false;
        let shoppingCartDTO = this.shoppingCartService.getShoppingCart();

        if(!shoppingCartDTO.services || shoppingCartDTO.services.length == 0) {
            hasNoServices = true;
        }

        return hasNoServices;
    }

    /**
     * If the user has services and no start time, they will need to go back to the date selection screen
     */
    hasServicesAndNoStartTime() {
        let hasServicesAndNoStartTime = false;
        let shoppingCartDTO = this.shoppingCartService.getShoppingCart();

        if(shoppingCartDTO.services && shoppingCartDTO.services.length > 0 
            && !shoppingCartDTO.appointmentStartDateTime) {
            hasServicesAndNoStartTime = true;
        }

        return hasServicesAndNoStartTime;
    }

    hasServicesAndStartTime() {
        let hasServicesAndStartTime = false;
        let shoppingCartDTO = this.shoppingCartService.getShoppingCart();

        if(shoppingCartDTO.services && shoppingCartDTO.services.length > 0 
            && shoppingCartDTO.appointmentStartDateTime) {
            hasServicesAndStartTime = true;
        }

        return hasServicesAndStartTime;
    }
}
