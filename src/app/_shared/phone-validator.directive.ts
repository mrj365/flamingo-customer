import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl } from '@angular/forms';

@Directive({
  selector: '[phone][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: PhoneValidatorDirective, multi: true }
  ]
})
export class PhoneValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validatePhoneFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }
  
}

// validation function - validate that phone number is digits only
function validatePhoneFactory() : ValidatorFn {
  return (c: AbstractControl) => {

    let isValid = false;

    var PHONE_REGEXP =  new RegExp('\\d+', 'g');

    //Do not test empty strings
    if (!c.value || c.value.length < 10 || c.value.length > 10 || PHONE_REGEXP.test(c.value)) {
        isValid = true;
    }

    if(isValid) {
      return null;
    } else {
      return {
        phone: {
          valid: false
        }
      };
    }

  }
}



