import { Component, OnInit } from '@angular/core';
import { GiftCardService } from '../../_services/gift-card.service';
import { RedeemGiftCardDTO } from 'app/_models/dto/redeem-gift-card-dto';

@Component({
  selector: 'app-my-gifts',
  templateUrl: './my-gifts.component.html',
  styleUrls: ['./my-gifts.component.css']
})
export class MyGiftsComponent implements OnInit {

  constructor(private giftCardService: GiftCardService) { 

    

  }

  ngOnInit() {
    
  }


}
