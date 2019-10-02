import { UserOrderCustomizationDTO } from './../../_models/dto/user-order-customization-dto';
import { UserOrderCustomizationItemsDTO } from './../../_models/dto/user-order-customization-items-dto';
import { CheckoutViewDTO } from './../checkout/checkout-view-dto';
import { UserOrderCustomizationGroupListResultViewDTO } from './../../_models/view/user-order-customization-group-list-result-view-dto';
import { BeanUtils } from './../../_util/BeanUtils';
import { UserOrderCustomizationGroupResultViewDTO } from './../../_models/view/user-order-customization-group-result-view-dto';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from "environments/environment";

@Component({
  selector: 'app-order-customization-component',
  templateUrl: './order-customization-component.component.html',
  styleUrls: ['./order-customization-component.component.css']
})
export class OrderCustomizationComponentComponent implements OnInit {

  @ViewChild('modalEditCustomizations')
  public customizationsModalComponent: ModalComponent;

  public orderCustomizationGroups: UserOrderCustomizationGroupListResultViewDTO = new UserOrderCustomizationGroupListResultViewDTO();
  public checkoutViewDTO: CheckoutViewDTO = new CheckoutViewDTO();

  constructor(private shoppingCartService: ShoppingCartService) { 
    let shoppingCartDTO = this.shoppingCartService.getShoppingCart();
    this.checkoutViewDTO = new CheckoutViewDTO(shoppingCartDTO);

  }

  ngOnInit() {
  }

  openCustomizations() {

      this.loadCustomizations();
      this.customizationsModalComponent.open();
    }

    closeCustomizations() {      
      this.customizationsModalComponent.close();
    }

    loadCustomizations() {
        this.shoppingCartService.getCustomizations().subscribe(orderCustomizationGroups =>
            { 
                BeanUtils.copyProperties(this.orderCustomizationGroups, orderCustomizationGroups);
            });
    }

    public setSelected(itemId: number, group: UserOrderCustomizationGroupResultViewDTO) {
        for(let item of group.items) {
            if(item.id == itemId) {
                item.selected = true;
            } else {
                item.selected = false;
            }
        }
    }

    public addOrderCustomizations() {
        let customizationItems: UserOrderCustomizationItemsDTO = new UserOrderCustomizationItemsDTO();

        for(let groups of this.orderCustomizationGroups.orderCustomizationGroups) {
            for(let item of groups.items) {
                if(item.selected) {
                    let userOrderCustomizationDTO: UserOrderCustomizationDTO = new UserOrderCustomizationDTO(item.id, 1);
                    customizationItems.customizations.push(userOrderCustomizationDTO);
                }
            }
        }

        this.shoppingCartService.updateCustomizations(customizationItems).subscribe(() => {
            this.customizationsModalComponent.close();
        });
        
    }

}