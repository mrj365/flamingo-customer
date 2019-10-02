import { Component, OnInit, NgZone } from '@angular/core';
import { LocationService } from 'app/_services/location.service';
import { ShoppingCartService } from 'app/_services/shopping-cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorefrontService } from 'app/_services/storefront.service';
import { AuthenticationService } from 'app/_services/authentication.service';

@Component({
  selector: 'app-pickup-redirect',
  templateUrl: './pickup-redirect.component.html',
  styleUrls: ['./pickup-redirect.component.css']
})
export class PickupRedirectComponent implements OnInit {

  constructor(    
    private locationService: LocationService,
    private ngZone: NgZone,
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute,
    private router: Router,
    private storefrontService: StorefrontService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
    let locationId = this.route.snapshot.queryParams['locationId'];
    this.goToDateSelection(locationId);
  }


  goToDateSelection(locationId: number) {
    this.shoppingCartService.addPickupService(locationId).subscribe(() =>
      {
        this.router.navigateByUrl('date-selection');
      });
  }

}
