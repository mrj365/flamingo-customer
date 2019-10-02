import { Component, OnInit } from '@angular/core';
import { GiftCardService } from 'app/_services/gift-card.service';
import { RedeemGiftCardDTO } from 'app/_models/dto/redeem-gift-card-dto';

@Component({
  selector: 'app-my-gift-redeem',
  templateUrl: './my-gift-redeem.component.html',
  styleUrls: ['./my-gift-redeem.component.css']
})
export class MyGiftRedeemComponent implements OnInit {

  public giftCardNumber = '';

  processingRedeem: boolean = false;

  constructor(private giftCardService: GiftCardService) { }

  ngOnInit() {
    
  }

  redeem() {
    if(!this.giftCardNumber) {
      return;
    }

    this.processingRedeem = true;

    this.giftCardService.redeemGiftCard(new RedeemGiftCardDTO(this.giftCardNumber)).subscribe(result => {

      if(result.success) {
        bootbox.alert('Gift card successfully added for $' + result.amount + '.');
        // this.checkBalance();
        this.giftCardNumber = '';
      } else {
        bootbox.alert(result.clientMessage);
      }

      this.processingRedeem = false;
    }, error => {
      this.processingRedeem = false;
    });
  }

}
