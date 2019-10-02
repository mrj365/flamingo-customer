import { UserPaymentMethodListResultDTO } from './../../_models/dto/user-payment-method-list-result-dto';
import { UserPaymentMethodService } from './../../_services/user-payent-method.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.css'
    ]
})
export class PaymentMethodsComponent implements OnInit {

  userPaymentMethodListResultDTO: UserPaymentMethodListResultDTO = new UserPaymentMethodListResultDTO();

  constructor(private userPaymentMethodService: UserPaymentMethodService) {

}

  ngOnInit() {
    this.userPaymentMethodService.getUserCards()
        .subscribe(userPaymentMethodListResultDTO => {
          this.userPaymentMethodListResultDTO = userPaymentMethodListResultDTO;
        });
  }

  ngAfterViewInit() {
      // Windows navigated to by sibling resourse do
      // not automtically scroll to top. Thiw sill scroll to top
       window.scrollTo(0, 0);
   }

  formatPaymentMethodTypeStr(paymentMethodType: string): string {
      paymentMethodType = paymentMethodType.toLowerCase();
      paymentMethodType = paymentMethodType.charAt(0).toUpperCase() + paymentMethodType.slice(1);

      return paymentMethodType;
  }

  formatExpirationDate(expirationDate: string): string {
    expirationDate = expirationDate.substr(4, 6) + '/' + expirationDate.substr(0, 4);
    return expirationDate;
  }

  setPaymentMethodAsPreferred(paymentMethodGuid: string){
    bootbox.confirm('Are you sure you would like to set this card as your preferred payment method?',
        result =>
        {
          if(result){
            this.userPaymentMethodService.setPreferredPaymentMethod(paymentMethodGuid)
              .subscribe(result => {
                this.userPaymentMethodService.getUserCards()
                  .subscribe(userPaymentMethodListResultDTO => {
                    this.userPaymentMethodListResultDTO = userPaymentMethodListResultDTO;
                  });

              });

            
          }
        }
      );
  }

  deletePaymentMethod(paymentMethodGuid: string) {
    bootbox.confirm('Are you sure you want to delete this payment method?',
      result =>
        {
          if(result){
            this.userPaymentMethodService.deletePaymentMethod(paymentMethodGuid)
              .subscribe(result =>
                {
                  this.userPaymentMethodService.getUserCards()
                    .subscribe(userPaymentMethodListResultDTO => {
                      this.userPaymentMethodListResultDTO = userPaymentMethodListResultDTO;
                    });
                }
              
              );

            

              
          }
        }
    );
  }


}