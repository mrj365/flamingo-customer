import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GiftCardService } from 'app/_services/gift-card.service';
import { ShoppingCartService } from 'app/_services/shopping-cart.service';
import { ApplyGiftCardDTO } from 'app/_models/dto/apply-gift-card-dto';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { UUIDUtil } from 'app/_util/uuid-util';
import { AppointmentUpdateConstants } from 'app/_models/constants/appointment-update-constants';
import { UserAppointmentService } from '../../_services/user-appointment.service.service';

@Component({
  selector: 'app-my-gift-apply-modal',
  templateUrl: './my-gift-apply-modal.component.html',
  styleUrls: ['./my-gift-apply-modal.component.css']
})
export class MyGiftApplyModalComponent implements OnInit {

  redeemGiftCardMode: boolean = false;
  updatingBalance: boolean = false;
  gcBalance: string = '';

  @Input()
  applyGiftCardBalance: boolean;

  @Input()
  appointment: boolean;

  @Input()
  recurring: boolean;

  @Input()
  appointmentId: number;

  @ViewChild('giftCardModal')
  public giftCardModal: ModalComponent;

  constructor(private giftCardService: GiftCardService,
    private shoppingCartService: ShoppingCartService, 
    private userAppointmentService: UserAppointmentService) { }

  ngOnInit() {
    this.giftCardService.giftCardUpdateResult$.subscribe(() => {
      this.shoppingCartService.applyGiftCardToLocalShoppingCart();
      this.getbalance();
      this.giftCardModal.close();
    });

    // Close the modal when an appointment is updated with apply or remove gift card
    this.userAppointmentService.giftCardUpdateResult$.subscribe(() => {
      this.giftCardModal.close();
    });

    this.getbalance();
  }

  getbalance() {
    this.giftCardService.getGiftCardsBalance().subscribe(balanceResult => {
      this.gcBalance = balanceResult.balance;
    });
  }

  applyGiftCardBalanceToOrder(applyGiftCardBalance: boolean) {
    if(this.appointment) {
      this.applyGiftCardToAppointment(applyGiftCardBalance);
    } else {
      this.applyToShoppingCart(applyGiftCardBalance);
    }
  }

  applyGiftCardToAppointment(applyGiftCardBalance: boolean) {
    if(this.recurring) {
      let options: BootboxPromptOptions = {
        title: 'Update gift card for re-occurring appointment',
        value : AppointmentUpdateConstants.ONLY_THIS,
        inputType: 'select',
        callback: (result) => this.continueApplyGiftCardToAppointment(result, applyGiftCardBalance),
        inputOptions: [
          {text: 'Update only this appointment', value: AppointmentUpdateConstants.ONLY_THIS},
          {text: 'Update this and following appointments', value: AppointmentUpdateConstants.THIS_AND_FUTURE},
          {text: 'Update all appointments in series', value: AppointmentUpdateConstants.ALL_IN_SERIES}
          ]
      };

      bootbox.prompt(options);
    } else {
      this.continueApplyGiftCardToAppointment(AppointmentUpdateConstants.ONLY_THIS, applyGiftCardBalance);
    }
  }

  continueApplyGiftCardToAppointment(updateType: string, applyGiftCardBalance: boolean) {
    if(!updateType) {
      this.giftCardModal.close();
      return;
    }
    
    let uuid: string = UUIDUtil.generateUUID();
    this.updatingBalance = true;

    this.userAppointmentService.applyGiftCard(this.appointmentId, new ApplyGiftCardDTO(applyGiftCardBalance, updateType), uuid).subscribe(() =>
        {
            this.updatingBalance = false;

            

        }, error => {
          this.updatingBalance = false;
        });
  }

  applyToShoppingCart(applyGiftCardBalance: boolean) {
    this.updatingBalance = true;
    this.shoppingCartService.applyGiftCardToShoppingCart(new ApplyGiftCardDTO(applyGiftCardBalance)).subscribe(() => {
      
      if(applyGiftCardBalance) {
        bootbox.alert('Your gift card balance has been applied to your order. Your gift card balance will be deducted from your order total'
        + ' after your order has been processed.');
      } else {
        bootbox.alert('Your gift card balance has been removed from the order.');
      }
      this.updatingBalance = false;
       this.giftCardModal.close();
    }, error => {
      this.updatingBalance = false;
    });
  }

  close() {
    this.giftCardModal.close();
  }

  open() {
    this.redeemGiftCardMode = false;
    this.giftCardModal.open();
  }

}
