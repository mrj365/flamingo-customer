import { OrderCustomizationComponentComponent } from './../order-customization-component/order-customization-component.component';
import { environment } from 'environments/environment';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Subscription } from 'rxjs/Subscription';
import { ShoppingCartViewDTO } from './../../_models/view/dto/shopping-cart-view-dto';
import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverContent } from 'ngx-popover';
import { Popover } from 'ngx-popover';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  public shoppingCart: ShoppingCartViewDTO = new ShoppingCartViewDTO();
  public subscription: Subscription;

  @ViewChild('orderCustomizationComponent') 
  public orderCustomizationsModal: OrderCustomizationComponentComponent;

  

  constructor(private shoppingCartService: ShoppingCartService,
    private router: Router) {
    // Subscribe to shopping cart updates
    this.subscription = shoppingCartService.shippingCartUpdateResult$.subscribe(
    shoppingCart => {
        this.shoppingCart = new ShoppingCartViewDTO(shoppingCart);
    });
   }

  ngOnInit() {
    let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
    this.shoppingCart = new ShoppingCartViewDTO(shoppingCartDTO);
  }

  ngAfterViewInit() {
      // Need to manually scroll to top of screen since
      // navigation is done through a sibling component
       window.scrollTo(0, 0);
   }

   removeService(serviceId: number) {
    this.shoppingCartService.removeService(this.shoppingCart.storefrontId, serviceId).subscribe();
   }

   openCustomizations() {
     this.orderCustomizationsModal.openCustomizations();
   }

   getCheckoutDateFormatted(): string {

    if(this.shoppingCart.appointmentStartDateTime){
      return moment(this.shoppingCart.appointmentStartDateTime).format('dddd, MMMM Do YYYY hh:mma');
    } else {
        return '';
    }
  }

  checkout() {
    this.router.navigateByUrl('/date-selection');
  }
}