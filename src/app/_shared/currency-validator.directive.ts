import { Validator, ValidatorFn, AbstractControl, FormControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[currency][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: CurrencyValidatorDirective, multi: true }
  ]
})
export class CurrencyValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validateCurrencyFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }

}

// validation function - validate that phone number is digits only
function validateCurrencyFactory() : ValidatorFn {
  return (c: AbstractControl) => {

    let isValid = false;

    var CURRENCY_REGEXP = /([0-9]+)?(\.[0-9][0-9])/;

    //Do not test empty strings
    if (!c.value || CURRENCY_REGEXP.test(c.value)) {
        isValid = true;
    }

    if(isValid) {
      return null;
    } else {
      return {
        currency: {
          valid: false
        }
      };
    }

  }
}