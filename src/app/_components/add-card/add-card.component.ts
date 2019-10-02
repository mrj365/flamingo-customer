import { UserPaymentMethodService } from './../../_services/user-payent-method.service';
import { AddPaymentMethodForm } from './add-payment-method-form';
import { NgForm } from '@angular/forms';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {
  title = 'Add Card';
  model: AddPaymentMethodForm;
  addPaymentMethodForm: NgForm;
  @ViewChild('addPaymentMethodForm') currentForm: NgForm;

  months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years: string[] = [];
  currentYear = new Date().getFullYear();

  newPaymentMethodFormSubmitted: boolean = false;

  constructor(private userPaymentMethodService: UserPaymentMethodService, private zone: NgZone,
    private router: Router) {

      this.model = new AddPaymentMethodForm();

      // Populate years
      let todaysDate = new Date();
      let thisYear = todaysDate.getFullYear();

      for(let i = 0; i <= 20; i++) {
        let numberYear = thisYear + i;
        this.years.push(numberYear + '');
      }

      this.model.month = this.months[0];
      this.model.year = this.years[0];

  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    // Windows navigated to by sibling resourse do
    // not automtically scroll to top. Thiw sill scroll to top
      window.scrollTo(0, 0);
   }

// https://forums.meteor.com/t/solution-for-ui-not-update-have-to-click-somewhere-router-not-work/25781
  getCardData(valid) {
    if (valid) {
      
      this.newPaymentMethodFormSubmitted = true;

      this.userPaymentMethodService.createPaymentMethod(this.model.number, this.model.month, this.model.year, this.model.cvv)
      .subscribe( result => {
          this.zone.run(() => {
          this.router.navigate(['payment-methods']);
        });
      },
      error => {
                    this.newPaymentMethodFormSubmitted = false;
                });
    } else {
      this.validateForm();
    }
  }

  validateForm() {
      this.addPaymentMethodForm = this.currentForm;

      const form = this.addPaymentMethodForm.form;

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
    'number': '',
    'cvv': ''
  };

validationMessages = {
  'number': {
    'required': 'Card number is required.'
  },
  'cvv': {
    'required': 'CVV is required.',
    'maxlength': 'The maximum length of the CVV is 4 digits.'
  }
};

}
