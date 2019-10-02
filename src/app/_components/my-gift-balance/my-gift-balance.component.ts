import { Component, OnInit } from '@angular/core';
import { GiftCardService } from 'app/_services/gift-card.service';

@Component({
  selector: 'app-my-gift-balance',
  templateUrl: './my-gift-balance.component.html',
  styleUrls: ['./my-gift-balance.component.css']
})
export class MyGiftBalanceComponent implements OnInit {

  public giftCardBalance = '0.00';

  constructor(private giftCardService: GiftCardService) { 

    giftCardService.giftCardUpdateResult$.subscribe(() => {
      this.checkBalance();
    });

  }

  checkBalance() {
    this.giftCardService.getGiftCardsBalance().subscribe(giftCardBalanceResultDTO => {
      this.giftCardBalance = giftCardBalanceResultDTO.balance;
    }, error => {

    });
  }

  ngOnInit() {
    this.checkBalance();
  }

}
