import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { ContactUsForm } from '../contact-us/contact-us-form';
import { GiftCardFormDTO } from './gift-card-form-dto';
import { GiftCardService } from 'app/_services/gift-card.service';
import { Router } from '@angular/router';
import { BeanUtils } from '../../_util/BeanUtils';
import { PurchaseGiftCardDTO } from '../../_models/dto/purchase-gift-card-dto';
import { PurchaseGiftCardReceiptResultDTO } from 'app/_models/dto/purchase-gift-card-receipt-result-dto';
import { UUIDUtil } from 'app/_util/uuid-util';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css']
})
export class GiftComponent implements OnInit {

  public platformName = environment.platformName;

  public giftCardFormSubmitted: boolean = false;

  public purchaseComplete: boolean = false;
  public purchaseGiftCardReceiptResultDTO: PurchaseGiftCardReceiptResultDTO = new PurchaseGiftCardReceiptResultDTO();

  contactUsForm: NgForm;
  @ViewChild('contactUsForm') currentForm: NgForm;
  public model: GiftCardFormDTO = new GiftCardFormDTO();

  months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: string[] = [];
  currentYear = new Date().getFullYear();

  constructor(private giftCardService: GiftCardService, private zone: NgZone,
    private router: Router) { 
    // Populate years
    let todaysDate = new Date();
    let thisYear = todaysDate.getFullYear();

    for(let i = 0; i <= 20; i++) {
      let numberYear = thisYear + i;
      this.years.push(numberYear + '');
    }

    this.model.month = this.months[0];
    this.model.year = this.years[0];

    this.purchaseGiftCardReceiptResultDTO.senderEmail = "bla@bla.com";
    this.purchaseGiftCardReceiptResultDTO.recipientEmail = "ya@ya.com";
    this.purchaseGiftCardReceiptResultDTO.guid = "ABC-123";
  }

  ngOnInit() {
  }

  onSubmit(valid){
    if (valid) {
      this.getCardData();
    } else {
      this.validateForm();
    }
  }

  validateForm() {
    this.contactUsForm = this.currentForm;

    const form = this.contactUsForm.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && !control.valid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

formErrors = {
  'senderName': '',
  'senderEmail': '',
  'recipientName': '',
  'recipientEmail': '',
  'number': '',
  'cvv': '',
  'amount': ''
};

validationMessages = {
  'senderName': {
    'required': 'Your name is required.',
    'notblank': 'Your name is required.'
  },
  'senderEmail': {
    'required':      'Your email is required.',
    'notblank': 'Your email is required.',
    'email': 'Invalid email.'
  },
  'recipientName': {
    'required': 'Recipient name is required.',
    'notblank': 'Recipient name is required.'
  },
  'recipientEmail': {
    'required':      'Recipient email is required.',
    'notblank': 'Recipient email is required.',
    'email': 'Invalid email.'
  },
  'number': {
    'required': 'Card number is required.'
  },
  'cvv': {
    'required': 'CVV is required.'
  },
  'amount': {
    'required': 'The amount is required.',
    'currency': 'Please enter an amount that follows the format #.##',
    'NumbersOnly': 'Please enter an amount that follows the format #.##'
  }
};

  getCardData() {
    let idempotentUUID: string = UUIDUtil.generateUUID();
      
      this.giftCardFormSubmitted = true;
      let purchaseGiftCardDTO = BeanUtils.copyProperties(new PurchaseGiftCardDTO(), this.model);

      this.giftCardService.purchaseGiftCard(purchaseGiftCardDTO, idempotentUUID)
      .subscribe( result => {
          this.zone.run(() => {
            this.giftCardFormSubmitted =  false;
            

            if(result.success) {
              BeanUtils.copyProperties(this.purchaseGiftCardReceiptResultDTO, result);
              this.purchaseComplete = true;
              this.clearForm();
            }
          // this.router.navigate(['payment-methods']);
        });
      },
      error => {
        this.giftCardFormSubmitted = false;
      });
  }

  clearForm() {

    this.currentForm.reset({
          'amount': '',
          'senderName': '',
          'senderEmail': '',
          'recipientName': '',
          'recipientEmail': '',
          'message': '',
          'number': '',
          'month': '',
          'year': '',
          'cvv': ''
         });
    }
}
